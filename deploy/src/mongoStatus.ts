import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from "dotenv";
dotenv.config();

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?appName=DeloyStatus`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    await client.connect();
    return client.db("deployStatus");
  } catch (error) {
    console.error("Failed to connect to the database", error);
    throw error;
  }
}


export async function updateStatus(id: string, newStatus: string) {
  const database = await connectToDatabase();
  const collection = database.collection("status");

  try {
    const result = await collection.updateOne(
      { id: id },
      { $set: { status: newStatus } }
    );

    if (result.matchedCount === 0) {
      console.log(`No document found with id ${id}`);
      return null;
    }

    console.log(`Updated ${result.modifiedCount} document(s)`);
    return result;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  } finally {
    await client.close();
  }
}
