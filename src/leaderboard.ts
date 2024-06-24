import { Context } from "telegraf"
import { inviteLeaderboard, inviteLeaderboardAmharic, leaderboard, leaderboardAmharic } from "./keyboards"



export const sendInviteLeaderboard = async (ctx: Context) => {

    const message = ctx.message as {text:string}
    const text = message.text;
    if(text === "👥🏅 የጋባዦች መሪ ሰሌዳ"){
     return await ctx.reply("መሪ ሰሌዳ:", inviteLeaderboardAmharic(ctx.chat?.id!))
    }
    
    await ctx.reply("Leaderboard:", inviteLeaderboard(ctx.chat?.id!))
}



export const sendLeaderboard = async (ctx: Context) => {

    const message = ctx.message as {text:string}
    const text = message.text;

    if(text === "🏆 መሪ ሰሌዳ"){
        return await ctx.reply("መሪ ሰሌዳ:", leaderboardAmharic(ctx.chat?.id!))
    }
    
    await ctx.reply("Leaderboard:", leaderboard(ctx.chat?.id!))
}

