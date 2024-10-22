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
    const client = await clientPromise;
    const db = client.db("picklists")
  }
  else {
    return res.status(405).json({ message: "Method not allowed."});
  }
}