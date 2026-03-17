import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/app/lib/database';

type ResponseData = { message: string };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed." });
    }

    const { name, customColumns } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Picklist name is required." });
    }

    const client = await clientPromise;
    const db = client.db("quick-pick");
    const picklists = db.collection("picklists");

    const exists = await picklists.findOne({ name });
    if (!exists) {
        return res.status(404).json({ message: `Picklist '${name}' doesn't exist.` });
    }

    await picklists.updateOne({ name }, { "$set": { customColumns } });

    return res.status(200).json({ message: "Custom columns updated." });
}
