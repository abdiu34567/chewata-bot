import { Context } from "telegraf";
import { sendGameChewata, sendGameLevelUp } from "./keyboards";


const playGame = (ctx: Context) => {
    ctx.replyWithGame("levelup", sendGameLevelUp)
    ctx.replyWithGame("korki", sendGameChewata)
}




export default playGame