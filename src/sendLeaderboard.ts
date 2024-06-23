import { Context } from "telegraf";
import { leaderboard } from "./keyboards";

const sendLeaderboard = async (ctx: Context) => {
    await ctx.reply("Leaderboard:", leaderboard(ctx.chat?.id!))
}


export default sendLeaderboard
