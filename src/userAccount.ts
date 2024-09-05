import { Context } from "telegraf";
import { getDb } from "./db/config";
import { UserController } from "./db";
import { TransactionController } from "./db/transaction";

export const loadUserAccount = async (ctx: Context) => {
  const first_name = ctx.from?.first_name;
  const last_name = ctx.from?.last_name;

  const full_name = first_name + " " + last_name || "";
  const db = getDb();
  const userController = new UserController(db);
  const user = await userController.getUserDetailsWithTransactions(
    String(ctx.from?.id)
  );

  ctx.replyWithHTML(
    `<b>Your account details:</b>\n\n` +
      `<pre>\n` +
      `Name: ${full_name}\n` +
      `Phone: ${user?.phone || ""}\n` +
      `Total Deposited Amount:       ${user.totalDeposited} ETB\n` +
      `Total Bonus Received:         ${user.totalBonus} ETB\n` +
      `Total Withdrawn Amount:       ${user.totalWithdrawn} ETB\n` +
      `----------------------------\n` +
      `Total Balance:                ${user.totalBalance} ETB\n` +
      `----------------------------` +
      `</pre>`
  );

  //   console.log(user);
};
