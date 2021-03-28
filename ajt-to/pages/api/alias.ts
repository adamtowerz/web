// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

import { getInternalAliases, getExternalAliases, addAlias } from "../../api";

interface ApiRequest extends NextApiRequest {
  auth?: boolean;
}

// not really middleware as it is invoked manually
function authMiddleware(req: ApiRequest, res: NextApiResponse) {
  if (req.headers.authorization) {
    if (req.headers.authorization === `Basic ${process.env.MAGIC_PASSWORD}`) {
      req.auth = true;
    }
  }
}

async function getAliasHandler(req: ApiRequest, res: NextApiResponse) {
  const aliases = req.auth
    ? await getInternalAliases()
    : await getExternalAliases();
  res.status(200).json({ aliases });
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
