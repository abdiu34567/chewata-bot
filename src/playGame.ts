import { Context } from "telegraf";
import { sendGameChewata, sendGameLevelUp } from "./keyboards";


const playGame = (ctx: Context) => {
    //dev
    // ctx.replyWithGame("chewata", sendGameLevelUp)
    // ctx.replyWithGame("chewata", sendGameChewata)

    //prod
    ctx.replyWithGame("levelup", sendGameLevelUp)
    ctx.replyWithGame("korki", sendGameChewata)
}




export default playGame