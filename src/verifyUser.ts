import { Context } from "telegraf";
import { getDb } from "./db/config";
import { UserController } from "./db";
import { mainMenu } from "./keyboards";




const verifyUser = async (ctx: Context) => {

    //save contact
    //verify user

    const db = getDb()
    const userController = new UserController(db);
    const message = ctx.message! as any

    await userController.createUser({
        tgId: String(ctx.chat?.id),
        phone: message.contact.phone_number,
        isVerified: true
    })

    ctx.reply("Main Menu: ", mainMenu)

}


export default verifyUser;