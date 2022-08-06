import { Knex, knex } from "knex";
import { NextApiResponse } from "next";

interface Connection {
  query: (
    query: { builder: knex.QueryBuilder },
    res?: NextApiResponse
  ) => Promise<any[] | {}>;
  multiQuery: (
    queryList: { key: string; builder: knex.QueryBuilder }[],
    res?: NextApiResponse
  ) => Promise<void | any>;
  getNextGroupTrainings: () => string[];
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

  getNextGroupTrainings: () => {
    const nextSessions = [];
    const date = new Date();
    const month = date.getMonth();
    const oneWeek = 7;
    while (true) {
      const sunday = new Date(
        date.setDate(date.getDate() - date.getDay() + oneWeek)
      );
      if (nextSessions.length === 5) return nextSessions;
      nextSessions.push(sunday.toISOString().split(".")[0].split("T")[0])
    }
  },
};

export const conn = knex(config);

export default db;
