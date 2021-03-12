// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

import { getInternalAliases, getExternalAliases} from "../../cache";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const aliases = await getInternalAliases();

  res.status(200).json({ aliases });
};
