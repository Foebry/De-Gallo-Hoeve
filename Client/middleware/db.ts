import { Knex, knex } from "knex";
import { NextApiRequest, NextApiResponse } from "next";

interface Connection {
  query: (
    query: { builder: knex.QueryBuilder },
    res?: NextApiResponse
  ) => Promise<any[] | any>;
  multiQuery: (
    queryList: { key: string; builder: knex.QueryBuilder }[],
    res?: NextApiResponse
  ) => Promise<void | any>;
  insert: (
    obj: any,
    table: string,
    res: NextApiResponse,
    callback?: (id: number[]) => Promise<void>
  ) => Promise<void>;
  register: (
    req: NextApiRequest,
    res: NextApiResponse,
    callback: () => Promise<void>
  ) => void;
}

const config: Knex.Config = {
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEMA,
    port: 3306,
  },
};

const db: Connection = {
  query: async (query, res) => {
    try {
      const response = await query.builder;
      const data = JSON.parse(JSON.stringify(response));
      return res ? res.status(200).json(data) : data;
    } catch (error: any) {
      console.log(error.message);
      return res?.status(500).json({ failure: "Internal Server Error" });
    }
  },

  multiQuery: async (queryList, res) => {
    let error = undefined;

    const response = await Promise.all(
      queryList.map(async (query) => {
        try {
          const response = await query.builder;
          const data = await JSON.parse(JSON.stringify(response));
          return { key: query.key, body: data };
        } catch (e: any) {
          console.log(e.message);
          error = true;
          stop();
        }
      })
    );

    if (error)
      return res
        ?.status(500)
        .json({ code: 500, failure: "Internal Server Error" });

    const data = response.reduce((prev, curr) => {
      const body = Array.isArray(curr?.body)
        ? curr?.body
        : curr?.body[curr?.key];
      return { ...prev, [`${curr?.key}`]: body };
    }, {});

    return res ? res.send(data) : data;
  },

  insert: async (data, table, res, callback) => {
    try {
      const id = await conn.insert({ ...data }).into(table);
      callback ? await callback(id) : res.status(200);
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  register: async (req, res, callback) => {
    try {
      return await conn.transaction((trx) => {
        const { csrf, honden, password_verification, ...klantData } = req.body;
        conn
          .insert({ ...klantData })
          .into("klant")
          .transacting(trx)
          .then((ids) => {
            honden.forEach((hond: any) => (hond.klant_id = ids[0]));
            return conn("hond").insert(honden).transacting(trx);
          })
          .then(() => {
            trx.commit();
            callback();
            return res
              .status(201)
              .json({ message: "Registratie goed ontvangen!" });
          })
          .catch(() => {
            trx.rollback();
            return res
              .status(500)
              .json({ message: "Internal Server Error inner" });
          });
      });
    } catch {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    // const { csrf, honden, password_verification, ...klantData } = req.body;
    // return await db.insert({ ...klantData }, "klant", res, async (klant_id) => {
    //   const promises = await Promise.all(
    //     honden.map(async (hond: any) => {
    //       return await db.insert(
    //         { ...hond, klant_id: klant_id?.[0] },
    //         "hond",
    //         res
    //       );
    //     })
    //   );
    //   promises.forEach((promise: any) => console.log({ promise }));
    //   if (res.statusCode === 200) {
    //     callback();
    //     return res
    //       .status(201)
    //       .json({ message: "Bedankt voor uw registratie!" });
    //   }
    //   return res.status(400).json({ message: "Something not quite right" });
    // });
  },
};

export const conn = knex(config);

export default db;
