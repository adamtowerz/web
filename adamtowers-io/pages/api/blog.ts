import Airtable from "airtable";
import { createBlankPost, getPostData, updatePostBySlug } from "data/Blog";
import { NextApiRequest, NextApiResponse } from "next";
import { BlogPost } from "types";

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

function devOnlyMiddleware(req: NextApiRequest, res: NextApiResponse, next) {
  if (process.env.WRITE_ENABLED) {
    next();
  } else {
    res.statusCode = 403;
    res.end();
  }
}

let airtable: Airtable;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, devOnlyMiddleware);

  if (!airtable) {
    airtable = new Airtable({
      apiKey: process.env.AIRTABLE_KEY,
    });
  }

  if (req.method === "POST") {
    const { slug } = req.body;
    await createBlankPost(airtable, slug);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end();
  } else if (req.method === "PATCH") {
    const newPostData: BlogPost = req.body.post;
    await updatePostBySlug(airtable, newPostData);
    const post = await getPostData(airtable, newPostData.slug, false);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ post: post }));
  }

  return {
    revalidate: 10 * 60,
  }
}
