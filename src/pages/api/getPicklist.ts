import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/app/lib/database';
import { PicklistSchema2024 } from '@/app/lib/types';
 
type ResponseData = {
  message: string
  data?: PicklistSchema2024[],
  static?: boolean
};
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method == "GET") {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: "Picklist name is required."})
    }
    
    const client = await clientPromise;
    const db = client.db("quick-pick");
    const picklists = db.collection("picklists");

    const requestedPicklist = await picklists.findOne({ name: name });

    if (!requestedPicklist) {
      return res.status(404).json({ message: `Picklist of name '${name}' not found.`});
    }
    else {
      return res.status(200).json({ message: "Picklist retrieved successfully.", data: requestedPicklist["data"], static: requestedPicklist["static"] });
    }

  }
  else {
    return res.status(405).json({ message: "Method not allowed."});
  }
}