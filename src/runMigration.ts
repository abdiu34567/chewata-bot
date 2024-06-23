import { MongoClient } from 'mongodb';
import * as users from '../assets/db.json';

// const fs = require('fs');

import dotenv from 'dotenv';
dotenv.config();

// Connection URI
const uri: string = process.env.DB_URI!;
const client = new MongoClient(uri);

// Path to the JSON file
// const filePath = './data.json';

// Function to read JSON file and parse it
const loadData = () => {
    // const fileData = fs.readFileSync(filePath);
    // const users = JSON.parse(fileData.toString());
    const userd = users as any
    return userd?.default;
};

// Function to insert data into MongoDB
const insertData = async (users: any) => {
    try {
        await client.connect();
        const database = client.db("chewata");
        const collection = database.collection("users");

        // Optional: Clear the collection if you don't want duplicates
        await collection.deleteMany({});

        // Insert the data
        const result = await collection.insertMany(users);
        console.log(`${result.insertedCount} documents were inserted`);
    } catch (err) {
        console.error("Failed to insert documents:", err);
    } finally {
        await client.close();
    }
};

const runMigration = async () => {
    const users = loadData();
    await insertData(users);
};

runMigration();
