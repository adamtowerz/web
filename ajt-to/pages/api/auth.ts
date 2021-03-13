// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const token = JSON.parse(req.body).token;

    console.log(token, process.env.MAGIC_PASSWORD);
    if (token === process.env.MAGIC_PASSWORD) {
        res.status(200).send(null);
    } else {
        res.status(403).send(null)
    }
};
