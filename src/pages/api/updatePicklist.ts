import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/app/lib/database';
 
type ResponseData = {
  message: string
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method == "POST") {
        const body = req.body;

        const client = await clientPromise;
        const db = client.db("quick-pick");
        const picklists = db.collection("picklists");

        const picklistExists = await picklists.findOne({ name: body["name"] });

        if (picklistExists) {
            await picklists.updateOne({ name: body["name"] }, {"$set": {
                name: body["name"],
                data: body["data"],
                static: true
            }});

            return res.status(200).json({ message: `Picklist of name '${body["name"]}' updated`});
        }
        else {
            return res.status(404).json({ message: `Picklist with name '${body["name"]}' doesn't exist.`});
        }

    }
    else {
        return res.status(405).json({ message: "Method not allowed."});
    }
}