import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from "dotenv";
dotenv.config();

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?appName=DeloyStatus`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }, 
  connectTimeoutMS: 30000
});

async function connectToDatabase() {
  try {
    await client.connect();
    return client.db("deployStatus");
  } catch (error) {
    console.error("Failed to connect to the database", error);
    return null;
  }
}

export async function insertStatus(id: string, status: string) {
  const database = await connectToDatabase();
  if (!database) return null;

  const collection = database.collection("status");

  try {
    const statusData = { id, status };
    const result = await collection.insertOne(statusData);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    return result;
  } catch (error) {
    console.error("Error inserting status:", error);
    return null;
  } finally {
    await client.close();
  }
}

export async function getStatusById(id: string) {
  const database = await connectToDatabase();
  if (!database) return "not found";

  const collection = database.collection("status");

  try {
    const result = await collection.findOne({ id: id });
    if (result) {
      return result.status;
    } else {
      console.log(`No status found for id ${id}`);
      return "not found";
    }
  } catch (error) {
    console.error("Error retrieving status:");
    return "not found";
  } finally {
    await client.close();
  }
}
