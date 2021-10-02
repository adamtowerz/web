import { getEvents } from "data/Cal";

export default async function handler(req, res) {
    res.send({ events: await getEvents() })

    return {
        revalidate: 2 * 60
    }
}