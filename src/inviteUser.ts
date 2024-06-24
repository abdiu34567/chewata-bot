import { Context } from "telegraf";
import { invite, inviteAmharic } from "./keyboards";





const inviteUser = async(ctx: Context) => {

    const message = ctx.message as {text:string}
    const text = message.text;

    if(text === "✉️ ጋብዝ"){
     return  await ctx.reply('ጓደኛዎን ይጋብዙ:', inviteAmharic(ctx.chat?.id!))
    }


   await ctx.reply('Invite Your Friend:', invite(ctx.chat?.id!))

}



export default inviteUser