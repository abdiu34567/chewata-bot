import { Context } from "telegraf";
import { sendClimateGame, sendGameChewata, sendGameLevelUp } from "./keyboards";

const playGame = async (ctx: Context) => {
  //dev
  //await ctx.replyWithGame("chewata", sendGameLevelUp);
  await ctx.replyWithGame("Climate", sendClimateGame);

  //prod
  await ctx.replyWithGame("levelup", sendGameLevelUp);
  // await ctx.replyWithGame("korki", sendGameChewata)
};

export default playGame;
