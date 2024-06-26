// import dotenv from "dotenv";
// dotenv.config();

import { UserController } from "./db";
import { connectToServer, getDb } from "./db/config";

// import { UserController } from "./db";
// import { connectToServer, getDb } from "./db/config";

async function notifyUsers() {
  //   await connectToServer();
  // console.log("hello");
  //check if user is here for the first time
  const db = getDb();
  const userController = new UserController(db);
  const users = await userController.fetchUsers();

  users?.forEach((user) => {
    try {
      console.log("user: ", user.tgId);
    } catch (err) {
      console.log(err);
    }
  });

  //   console.log("users: ", users);
}

// notifyUsers();
