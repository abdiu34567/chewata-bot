import { Context } from "telegraf";
import { getDb } from "./db/config";
import { UserController } from "./db";

const handleGame = async (ctx: Context) => {
    await ctx.answerGameQuery(`https://chewata-web.vercel.app/roulette/korki/?user_id=${100}`)

    const db = getDb()
    const userController = new UserController(db);
    await userController.incrementPlayCount({ tgId: String(ctx.chat?.id) })
}



export default handleGame