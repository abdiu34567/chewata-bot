import { Context } from "telegraf";
import { mainMenu, Ques1, shareContact } from "./keyboards";
import { connectToServer, getDb } from "./db/config";
import { UserController } from "./db";
import recordDataToSheet, { UserData } from "./Api/sheetApiConfig";
import { text } from "stream/consumers";
import { verifyMyUser } from "./verifyUser";
import { PollController } from "./db/polls";

export const startBot = async (ctx: Context) => {
  //check if user is here for the first time
  const db = getDb();

  const message = ctx.message as { text: string };
  const inviter = message?.text?.split(" ")[1];

  if (inviter && inviter.includes("poll")) {
    const pollCOntroller = new PollController(db);
    const poll = await pollCOntroller.queryUser({ tgId: String(ctx.from?.id) });
    if (!poll) {
      return await ctx.replyWithHTML(
        "<b>Who do you think will win?</b>\n\n (A) <i>Spain</i> \n (B) <i>England</i>",
        Ques1
      );
    }
  }
  // const inviterId = Number(inviter.trim())

  const userController = new UserController(db);
  var user = await userController.queryUser({ tgId: String(ctx.chat?.id) });

  //if user is invited
  if (inviter && !user) {
    //increment refferal count for inviter
    const res1 = await userController.increaseReferral({
      tgId: inviter,
    });

    //register the new user
    const res2 = (await userController.createUser({
      tgId: String(ctx.chat?.id),
      invitedBy: inviter,
      isVerified: false,
      name: ctx.from?.first_name + " " + ctx.from?.last_name,
    })) as any;

    //redirect the new user to signup page
    await ctx.reply(
      "Please share your phone number for sign up:",
      shareContact
    );

    recordDataToSheet(res1!);
    recordDataToSheet(res2!);
  }

  if (user?.isVerified) {
    //redirect to main menu
    return ctx.reply("Main Menu:", mainMenu);
  }

  //Either user is new of not verified
  return ctx.reply("Please share your phone number for sign up:", shareContact);
};

export const fakerBot = async (ctx: any) => {
  //check if user is here for the first time
  await connectToServer();
  const db = getDb();
  const userController = new UserController(db);

  const message = ctx.message as { text: string };
  const inviter = message?.text?.split(" ")[1];
  // const inviterId = Number(inviter.trim())

  var user = await userController.queryUser({ tgId: String(ctx.chat?.id) });

  //if user is invited
  if (inviter && !user) {
    //increment refferal count for inviter
    const res1 = await userController.increaseReferral({
      tgId: inviter,
    });

    // return console.log("inviter: ", inviter);
    //register the new user
    const res2 = (await userController.createUser({
      tgId: String(ctx.chat?.id),
      invitedBy: inviter,
      isVerified: false,
      name: ctx.from?.first_name + " " + ctx.from?.last_name,
    })) as any;

    //redirect the new user to signup page
    console.log("res1: ", res1);
    console.log("res2: ", res2);

    recordDataToSheet(res1!);
    recordDataToSheet(res2!);
  }

  if (user?.isVerified) {
    return console.log("user is verified");
    //redirect to main menu
  }

  //Either user is new of not verified
  console.log("user is not verified");
};

// fakerBot({
//   message: { text: "/start 5291325438" },
//   chat: { id: 229313916439 },
//   from: { first_name: "BM", last_name: "WT" },
// });

// fakerBot({
//   message: { text: "/start 5291325438" },
//   chat: { id: 882394394995 },
//   from: { first_name: "Ashener", last_name: "Pc" },
// });
// fakerBot({
//   message: { text: "/start 5291325438" },
//   chat: { id: 358318891487 },
//   from: { first_name: "Fkr", last_name: "Deva" },
// });
