import { Context } from "telegraf";
import { connectToServer, getDb } from "./db/config";
import { UserController } from "./db";
import { mainMenu } from "./keyboards";
import recordDataToSheet from "./Api/sheetApiConfig";

const verifyUser = async (ctx: Context) => {
  const db = getDb();
  const userController = new UserController(db);
  const message = ctx.message! as any;

  const res = await userController.verifyUser({
    tgId: String(ctx.chat?.id),
    phone: message.contact.phone_number,
    isVerified: true,
  });

  await ctx.reply("Main Menu: ", mainMenu);

  recordDataToSheet(res);

  if (!res || (res && !res.tgId)) {
    return ctx.telegram.sendMessage(
      "1173180004",
      `Error:\n\nr${JSON.stringify(res, undefined, 2)}\n\n tgId: ${
        ctx.from?.id
      }`
    );
  }

  await ctx.telegram.sendMessage(
    "-1002232324613",
    `💡 <b>User Shared phone number:</b>\n\n` +
      `🪪 User Telegram Id: <code>${ctx.from?.id}</code>\n` +
      `👤 User Name: <code>${ctx.from?.first_name}</code>\n` +
      `⚙️ User Status: ✅ <code>verified</code>`,
    { parse_mode: "HTML" }
  );
};

export default verifyUser;
