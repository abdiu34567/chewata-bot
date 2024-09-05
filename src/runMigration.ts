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

    // Get the users collection
    const users = db.collection("users");
    const transactions = db.collection("transactions");

    // Find all users
    const allUsers = await users.find({}).toArray();

    // Transaction records to insert
    let transactionRecords = allUsers.map((user) => ({
      userId: user.tgId, // Assuming tgId is the field you want to use as userId
      amount: 25,
      type: "bonus",
      status: "completed",
      payload: "well done",
      createdAt: new Date("2024-08-26T10:23:24.784Z"), // Using a fixed date as per your example
    }));

    // Insert records into the transactions collection
    await transactions.insertMany(transactionRecords);
    console.log("Bonus records inserted");
  } catch (error) {
    console.error("An error occurred during migration:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

// Run the migration
migrateNewUsers();
