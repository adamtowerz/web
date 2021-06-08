// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

import { getAliases, addAlias } from "../../api/alias";

import { ApiRequest, authMiddleware } from "../../api/auth";

async function getAliasHandler(req: ApiRequest, res: NextApiResponse) {
  res.status(200).json({ aliases: await getAliases(req) });
}

async function addAliasHandler(req: ApiRequest, res: NextApiResponse) {
  const {
    alias = null,
    link = null,
    label = null,
    internal = true,
  } = JSON.parse(req.body);
  if (
    !alias ||
    !link ||
    typeof alias !== "string" ||
    typeof link !== "string" ||
    (label && typeof label !== "string") ||
    typeof internal !== "boolean"
  ) {
    res
      .status(400)
      .send({ error: "Malformed alias, link, label, or internal flag" });
  }

  await addAlias(alias, link, { label, internal });
  res.status(200).send({ success: true });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  authMiddleware(req, res);

  if (req.method === "GET") {
    await getAliasHandler(req, res);
  } else if (req.method === "POST") {
    await addAliasHandler(req, res);
  }
};
