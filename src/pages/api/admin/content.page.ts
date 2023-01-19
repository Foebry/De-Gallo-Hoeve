import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { btoa } from "buffer";
import { getContentCollection, getTrainingCollection } from "src/utils/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { intro, diensten, trainingen } = req.body;

  const collection = await getContentCollection();
  await collection.updateOne(
    { _id: new ObjectId("62fa1f25bacc03711136ad59") },
    {
      $set: {
        subtitle: btoa(intro.subtitle),
        content: btoa(intro.content.join("\n")),
      },
    }
  );
  await collection.updateOne(
    { _id: new ObjectId("633862b5fbcc3a3006dcda52") },
    {
      $set: {
        subtitle: btoa(diensten.subtitle),
        content: btoa(diensten.content.join("\n")),
      },
    }
  );
  const trainingCollection = await getTrainingCollection();
  await trainingCollection.updateOne(
    { _id: new ObjectId("62fa1f25bacc03711136ad5f") },
    {
      $set: {
        subtitle: btoa(trainingen.subtitle),
        content: btoa(trainingen.content.join("\n")),
        bullets: trainingen.bullets,
        prijsExcl: trainingen.price,
      },
    }
  );
  return res.status(200).send({ intro, diensten, trainingen });
};

export default handler;
