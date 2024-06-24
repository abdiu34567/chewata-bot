import { Context } from "telegraf";
import { sendGameChewata, sendGameLevelUp } from "./keyboards";
import { translate } from "./utils";

const playGame = async (ctx: Context) => {
  //dev
  //   await ctx.replyWithGame("chewata", sendGameLevelUp);
  // ctx.replyWithGame("chewata", sendGameChewata)

  //prod
  await ctx.replyWithGame("levelup", sendGameLevelUp);
  // await ctx.replyWithGame("korki", sendGameChewata)
};

export default playGame;
