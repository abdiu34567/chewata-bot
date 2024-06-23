import { Context } from "telegraf";
import { getDb } from "./db/config";
import { UserController } from "./db";

const handleGame = async (ctx: Context) => {
    const cbk = ctx.callbackQuery as { game_short_name: string }
    if (cbk.game_short_name === 'korki') {
        await ctx.answerGameQuery(`https://chewata-web.vercel.app/roulette/korki/?user_id=${100}`)
    }

    if (cbk.game_short_name === 'levelup') {
        await ctx.answerGameQuery(`https://cactus-chewata.web.app?userID=123`)
    }


    //count total play clicks
    const db = getDb()
    const userController = new UserController(db);
    await userController.incrementPlayCount({ tgId: String(ctx.chat?.id),
        name: ctx.chat?.first_name+" "+ ctx.chat?.last_name 
     })
}



export default handleGame