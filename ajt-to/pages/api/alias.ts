// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

import { getAliases } from "../../api/alias";

async function getAliasHandler(_, res: NextApiResponse) {
  res.status(200).json({ aliases: await getAliases() });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return getAliasHandler(req, res);
  }
};
