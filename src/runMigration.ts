import { MongoClient } from "mongodb";
import * as users from "../assets/db.json";

// const fs = require('fs');

import dotenv from "dotenv";
import { json } from "stream/consumers";
dotenv.config();

// Connection URI
const uri: string = process.env.DB_URI!;
const client = new MongoClient(uri);

async function migrateNewUsers() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("chewata");
    const usersCollection = db.collection("users");
    const pollsCollection = db.collection("polls");

    // Get all unique tgIds from the polls collection
    const pollUsers = await pollsCollection.distinct("tgId");

    // Get all existing tgIds from the users collection
    const existingUsers = await usersCollection.distinct("tgId");

    // Find new users that are in polls but not in users
    const newUsers = pollUsers.filter((tgId) => !existingUsers.includes(tgId));

    if (newUsers.length === 0) {
      console.log("No new users to migrate.");
      return;
    }

    console.log(`Found ${newUsers.length} new users to migrate.`);
    return 0;
    // Prepare bulk operation
    const bulkOps = newUsers.map((tgId) => ({
      insertOne: {
        document: {
          tgId: tgId,
          playCount: 0,
          lastPlayTime: null,
          score: 0,
          name: "",
          phone: "",
          credits: 100,
          korkis: 0,
          language: "en",
          isVerified: false,
          referralCount: 0,
          // Add any other default fields you want for new users
        },
      },
    }));
    // return console.log(JSON.stringify(bulkOps, undefined, 2));

    // Execute bulk operation
    const result = await usersCollection.bulkWrite(bulkOps);

    console.log(`Successfully migrated ${result.insertedCount} new users.`);
  } catch (error) {
    console.error("An error occurred during migration:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

// Run the migration
migrateNewUsers();
