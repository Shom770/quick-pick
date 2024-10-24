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

    const picklistExists = await picklists.findOne({ name: body["picklistName"] });

    if (picklistExists) {
      return res.status(409).json({ message: `Picklist of name '${body["picklistName"]}' already exists`});
    }
    else {
      await picklists.insertOne({
        name: body["picklistName"],
        data: body["data"],
        static: false
      })

      return res.status(200).json({ message: `Picklist with name '${body["picklistName"]}' created successfully`})
    }

  }
  else {
    return res.status(405).json({ message: "Method not allowed."});
  }
}