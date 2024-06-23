import { Context } from "telegraf"
import { inviteLeaderboard } from "./keyboards"



const sendInviteLeaderboard = async (ctx: Context) => {
    await ctx.reply("Leaderboard:", inviteLeaderboard(ctx.chat?.id!))
}


export default sendInviteLeaderboard