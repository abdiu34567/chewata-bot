import { Context } from "telegraf";
import { sendClimateGame, sendGameChewata, sendGameLevelUp } from "./keyboards";

const playGame = async (ctx: Context) => {
  //dev
  //await ctx.replyWithGame("chewata", sendGameLevelUp);
  //await ctx.replyWithGame("korki", sendGameChewata)

  //prod
  await ctx.sendMessage("Climate Game", sendClimateGame);
  await ctx.replyWithGame("levelup", sendGameLevelUp);
};

export default playGame;
