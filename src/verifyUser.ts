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
    tgId: String(ctx.chat?.id),
    phone: message.contact.phone_number,
    isVerified: true,
  });

  // ctx.reply("Main Menu: ", mainMenu);
  console.log(res1);
  recordDataToSheet(res1);
};

// verifyMyUser({
//   message: { contact: { phone_number: "251900307532" } },
//   chat: { id: 613308323179 },
// });
