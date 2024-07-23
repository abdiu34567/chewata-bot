import { Context } from "telegraf";
import { connectToServer, getDb } from "./db/config";
import { UserController } from "./db";
import { mainMenu } from "./keyboards";
import recordDataToSheet from "./Api/sheetApiConfig";

const verifyUser = async (ctx: Context) => {
  //save contact
  //verify user

  const db = getDb();
  const userController = new UserController(db);
  const message = ctx.message! as any;

  const res = await userController.verifyUser({
    tgId: String(ctx.chat?.id),
    phone: message.contact.phone_number,
    isVerified: true,
  });

  ctx.reply("Main Menu: ", mainMenu);

  recordDataToSheet(res);
};

export default verifyUser;

export const verifyMyUser = async (ctx: any) => {
  //save contact
  //verify user
  await connectToServer();
  const db = getDb();
  const userController = new UserController(db);
  const message = ctx.message! as any;

  const res1 = await userController.verifyUser({
    tgId: String(ctx.from?.id),
    phone: message.contact.phone_number,
    isVerified: true,
  });

  if (res1 && !res1.tgId) {
    return ctx.telegram.sendMessage(
      "1173180004",
      `Error:\n\nr${JSON.stringify(res1, undefined, 2)}\n\n tgId: ${
        ctx.from?.id
      }`
    );
  }

  // ctx.reply("Main Menu: ", mainMenu);
  recordDataToSheet(res1);

  await ctx.telegram.sendMessage(
    "-1002232324613",
    `💡 <b>User Shared phone number:</b>\n\n` +
      `🪪 User Telegram Id: <code>${ctx.from?.id}</code>\n` +
      `👤 User Name: <code>${ctx.from?.first_name}</code>\n` +
      `⚙️ User Status: ✅ <code>verified</code>`,
    { parse_mode: "HTML" }
  );
};

// verifyMyUser({
//   message: { contact: { phone_number: "251900307532" } },
//   chat: { id: 613308323179 },
// });
