import { Knex, knex } from "knex";
import { NextApiResponse } from "next";
import bcrypt from "bcrypt";

interface LoginPayload {
  email: string;
  password: string;
}

interface Connection {
  getJwtPayload: (body: LoginPayload, res: NextApiResponse) => Promise<void>;
  query: (
    query: { builder: knex.QueryBuilder },
    res: NextApiResponse
  ) => Promise<void>;
  multiQuery: (
    queryList: { key: string; builder: knex.QueryBuilder }[],
    res?: NextApiResponse
  ) => Promise<void | any>;
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
  getJwtPayload: async ({ email, password }, res) => {
    try {
      const response = await conn
        .select("id", "email", "roles", "vnaam", "verified", "password")
        .from("klant")
        .where({ email })
        .first();

      if (!response)
        return res.status(400).json({ code: 400, email: "Email not found" });

      const data = JSON.parse(JSON.stringify(response));
      const match = await bcrypt.compare(password, data.password);

      return match
        ? { ...data, password: undefined }
        : res.status(400).json({ code: 400, password: "Invalid password" });
    } catch (error: any) {
      console.log(error.message);
      return res
        .status(500)
        .json({ code: 500, failure: "Internal server Error" });
    }
  },

  query: async (query, res) => {
    try {
      const response = await query.builder;
      const data = JSON.parse(JSON.stringify(response));
      return res.status(200).json(data);
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).json({ failure: "Internal Server Error" });
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
      return res?.status(500)
        .json({ code: 500, failure: "Internal Server Error" });

    const data = response.reduce((prev, curr) => {
      const body = Array.isArray(curr?.body)
        ? curr?.body
        : curr?.body[curr?.key];
      return { ...prev, [`${curr?.key}`]: body };
    }, {});

    return res ? res.send(data) : data;
  },
};

export const conn = knex(config);

export default db;
