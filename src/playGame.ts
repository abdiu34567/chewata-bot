import { Context } from "telegraf";
import { sendGameChewata, sendGameLevelUp } from "./keyboards";


const playGame = (ctx: Context) => {
    ctx.replyWithGame("chewata", sendGameLevelUp)
    ctx.replyWithGame("chewata", sendGameChewata)
    // ctx.replyWithGame("levelup", sendGameLevelUp)
    // ctx.replyWithGame("korki", sendGameChewata)
}




export default playGame