import { Context } from "telegraf";
import { setting } from "./keyboards";


const settings = async (ctx: Context) => {
    await ctx.reply('Settings:\n\nCooming soon ...', setting)
}


export default settings