import { MongoClient, Db } from "mongodb";

// Assuming environment variables are set outside this file
const uri: string = process.env.DB_URI!;
const client: MongoClient = new MongoClient(uri);

let dbInstance: Db | null = null;

export const connectToServer = async (): Promise<void> => {
  try {
    await client.connect();
    dbInstance = client.db(process.env.DB_NAME);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    process.exit(1);
  }
};

export const getDb = (): Db => {
  if (!dbInstance) {
    throw new Error("No database connected!");
  }
  return dbInstance;
};
