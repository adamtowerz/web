// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

import { getAliases, addAlias, deleteAlias } from "../../api/alias";

import { ApiRequest, authMiddleware, enforceAuth } from "../../api/auth";

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
    return;
  }

  await addAlias(alias, link, { label, internal });
  res.status(200).send({ success: true });
}

async function deleteAliasHandler(req: ApiRequest, res: NextApiResponse) {
  const {
    alias = null,
  } = JSON.parse(req.body);
  if (
    !alias ||
    typeof alias !== "string"
  ) {
    res
      .status(400)
      .send({ error: "Malformed alias, link, label, or internal flag" });
    return;
  }

  await deleteAlias(alias);
  res.status(200).send({ success: true });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  authMiddleware(req, res);

  if (req.method === "GET") {
    return getAliasHandler(req, res);
  } else if (req.method === "POST") {
    return await (enforceAuth(addAliasHandler)(req, res));
  } else if (req.method === "DELETE") {
    return await (enforceAuth(deleteAliasHandler)(req, res));
  }
};
