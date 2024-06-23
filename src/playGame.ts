import { Context } from "telegraf";
import { sendGame } from "./keyboards";


const playGame = (ctx: Context) => {
    ctx.replyWithGame("chewata", sendGame)
}




export default playGame