import { Context } from "telegraf";
import { sendGameChewata, sendGameLevelUp } from "./keyboards";


const playGame = async (ctx: Context) => {
    //dev
    // ctx.replyWithGame("chewata", sendGameLevelUp)
    // ctx.replyWithGame("chewata", sendGameChewata)

    //prod
    await ctx.replyWithGame("levelup", sendGameLevelUp)
    await ctx.replyWithGame("korki", sendGameChewata)
}




export default playGame