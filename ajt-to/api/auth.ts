// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { cookie } from "./utils/cookie";

const AUTH_COOKIE_KEY = "authCookie";

export interface ApiRequest extends NextApiRequest {
    auth?: boolean;
}

export function isLoggedIn(req: ApiRequest): boolean {
    return req.cookies[AUTH_COOKIE_KEY] === process.env.MAGIC_PASSWORD;
}

// not really middleware as it is invoked manually
export function authMiddleware(req: ApiRequest, res: NextApiResponse) {
    req.auth = isLoggedIn(req)
}

export function enforceAuth(handler: (req: ApiRequest, res: NextApiResponse) => void) {
    return (req: ApiRequest, res: NextApiResponse) => {
        if (req.auth) {
            handler(req, res);
        } else {
            res.status(403).send(null)
        }
    }
}

export function handleLoginRequest(req: NextApiRequest, res: NextApiResponse) {
    const token = JSON.parse(req.body).token;

    if (token === process.env.MAGIC_PASSWORD) {
        cookie(res, AUTH_COOKIE_KEY, process.env.MAGIC_PASSWORD, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
        })
        res.status(200).send(null);
    } else {
        res.status(403).send(null)
    }
}

export function handleLogoutRequest(req: NextApiRequest, res: NextApiResponse) {
    cookie(res, AUTH_COOKIE_KEY, '', {
        path: '/',
        maxAge: -1,
        httpOnly: true,
        sameSite: 'strict',
    })
    res.status(200).send(null);
}