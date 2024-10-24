import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

const client: MongoClient = new MongoClient(uri!, options);
const clientPromise: Promise<MongoClient> = client.connect();

export default clientPromise;