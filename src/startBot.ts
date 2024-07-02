import { Context } from "telegraf";
import { mainMenu, shareContact } from "./keyboards";
import { getDb } from "./db/config";
import { UserController } from "./db";
import recordDataToSheet, { UserData } from "./Api/sheetApiConfig";

export const startBot = async (ctx: Context) => {
  //check if user is here for the first time
  const db = getDb();
  const userController = new UserController(db);

  const message = ctx.message as { text: string };
  const inviter = message?.text?.split(" ")[1];
  // const inviterId = Number(inviter.trim())

  var user = await userController.queryUser({ tgId: String(ctx.chat?.id) });

  //if user is invited
  if (inviter && !user) {
    //increment refferal count for inviter
    const res1 = await userController.increaseReferral({ tgId: inviter });

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
