import { Context } from "telegraf";
import { getDb } from "./db/config";
import { UserController } from "./db";
import recordDataToSheet from "./Api/sheetApiConfig";

const handleGame = async (ctx: Context) => {
  const cbk = ctx.callbackQuery as { game_short_name: string };
  if (cbk.game_short_name === "korki") {
    await ctx.answerGameQuery(
      `https://chewata-web.vercel.app/roulette/korki/?user_id=${100}`
    );
  }

  if (cbk.game_short_name === "levelup") {
    await ctx.answerGameQuery(`https://cactus-chewata.web.app?userID=123`);
  }

  //count total play clicks
  const db = getDb();
  const userController = new UserController(db);
  const res = await userController.incrementPlayCount({
    tgId: String(ctx.callbackQuery?.message?.chat?.id),
    name: ctx.from?.first_name + " " + ctx.from?.last_name,
  });

  recordDataToSheet(res!);
};

export default handleGame;
