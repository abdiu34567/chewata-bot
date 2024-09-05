import { Context } from "telegraf";
import { mainMenu, shareContact } from "./keyboards";
import { connectToServer, getDb } from "./db/config";
import { UserController } from "./db";
import recordDataToSheet, { UserData } from "./Api/sheetApiConfig";
import { TransactionController } from "./db/transaction";

export const startBot = async (ctx: Context) => {
  //check if user is here for the first time
  const db = getDb();

  const message = ctx.message as { text: string };
  const inviter = message?.text?.split(" ")[1];

  // const inviterId = Number(inviter.trim())

  const userController = new UserController(db);
  var user = await userController.queryUser({ tgId: String(ctx.chat?.id) });

  //if user is invited
  if (inviter && !user) {
    //increment refferal count for inviter
    const res1 = await userController.increaseReferral({
      tgId: inviter,
      name: ctx.from?.first_name + " " + ctx.from?.last_name || "",
    });

    //register the new user
    const res2 = (await userController.createUser({
      tgId: String(ctx.chat?.id),
      invitedBy: inviter,
      isVerified: false,
      name: ctx.from?.first_name + " " + ctx.from?.last_name || "",
    })) as any;

    //redirect the new user to signup page
    await ctx.reply(
      `Register using the button below ☎️\n\n` +
        `የታችኛውን ምልክት በመጫን የሃውስ ኦፍ ጨዋታ ቤተሰብ ይቀላቀሉ። ☎️`,
      shareContact
    );

    await recordDataToSheet(res1!);
    await recordDataToSheet(res2!);

    return;
  }

  if (user?.isVerified) {
    //redirect to main menu
    return ctx.reply("Main Menu:", mainMenu);
  }

  //Either user is new or not verified
  await ctx.reply(
    `Register using the button below ☎️\n\n` +
      `የታችኛውን ምልክት በመጫን የሃውስ ኦፍ ጨዋታ ቤተሰብ ይቀላቀሉ። ☎️`,
    shareContact
  );

  //user is new
  if (!inviter && !user) {
    //add bonus for all new users
    const db = getDb();
    const transaction = new TransactionController(db);
    transaction.addBonus(String(ctx.chat?.id), 25, "well done");

    //register the new user
    const res2 = (await userController.createUser({
      tgId: String(ctx.chat?.id),
      isVerified: false,
      name: ctx.from?.first_name + " " + ctx.from?.last_name || "",
    })) as any;

    recordDataToSheet(res2!);

    await ctx.telegram.sendMessage(
      "-1002232324613",
      `💡 <b>New User Joined:</b>\n\n` +
        `🪪 User Telegram Id: <code>${ctx.from?.id}</code>\n` +
        `👤 User Name: <code>${ctx.from?.first_name}</code>\n` +
        `⚙️ User Status: ❌ <code>verified</code>`,
      { parse_mode: "HTML" }
    );
  }
};
