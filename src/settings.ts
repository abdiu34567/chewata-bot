import { Context } from "telegraf";
import { setting } from "./keyboards";


const settings = async (ctx: Context) => {
    await ctx.reply('Settings:', setting)
}


export default settings