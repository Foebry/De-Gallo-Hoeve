import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { btoa } from 'buffer';
import { getContentById } from 'src/controllers/ContentController';
import { ContentNotFoundError } from 'src/shared/RequestError';
import { getContentCollection } from 'src/utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') return getContent(req, res);
  else if (req.method === 'PUT') return changeContent(req, res);
  else return res.status(405).send('Not Allowed');
};

const getContent = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const data = await getContentById(new ObjectId(id as string));
  if (!data) {
    throw new ContentNotFoundError();
  }

  const result = {
    subtitle: Buffer.from(data.subtitle, 'base64').toString(),
    content: Buffer.from(data.content, 'base64').toString().split('\n'),
    image: data.image,
  };

  return res.status(200).send(result);
};

const changeContent = async (req: NextApiRequest, res: NextApiResponse) => {
  const { subtitle, content, image } = req.body;
  const { id } = req.query;

  const collection = await getContentCollection();
  await collection.updateOne(
    { _id: new ObjectId(id as string) },
    {
      $set: {
        subtitle: btoa(subtitle),
        content: btoa(content.join('\n')),
        image,
      },
    }
  );

  return res.status(200).send({ subtitle, content, image });
};

export default handler;
