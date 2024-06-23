import { Context } from "telegraf";
import { invite } from "./keyboards";





const inviteUser = (ctx: Context) => {
    ctx.reply('Invite Your Friend:', invite(ctx.chat?.id!))

}



export default inviteUser