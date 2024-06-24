import { Context } from "telegraf";
import { setlanguage } from "./utils";
import { mainMenu, mainMenuAmharic } from "./keyboards";




export const translateToAmharic = async(ctx:Context) => {
   await setlanguage(String(ctx.chat?.id), "am")
   await ctx.reply("Language set to: Amharic")
   await ctx.reply("ዋና ምናሌ", mainMenuAmharic)
}



export const translateToEnglish = async(ctx:Context) => {
   await setlanguage(String(ctx.chat?.id), "en")
   await ctx.reply("Language set to: English")
   await ctx.reply("Main Menu", mainMenu)
}
