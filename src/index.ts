import dotenv from "dotenv";
dotenv.config();

import { Telegraf } from "telegraf";
import { connectToServer, getDb } from "./db/config";
import { startBot } from "./startBot";
import verifyUser from "./verifyUser";
import { mainMenu, mainMenuAmharic, shareContact } from "./keyboards";
import inviteUser from "./inviteUser";
import playGame from "./playGame";
import handleGame from "./handleGame";
import { sendInviteLeaderboard, sendLeaderboard } from "./leaderboard";
import settings from "./settings";
import { sendLanguages } from "./sendLanguages";
import { translateToAmharic, translateToEnglish } from "./translate";
import { guideManager, korkiGuide, levelupGuide } from "./guideManager";
import { deleter, getLanguage } from "./utils";
import { UserController } from "./db";

const bot = new Telegraf(process.env.BOT_TOKEN!); // Make sure to have BOT_TOKEN in your .env file

// Connect to MongoDB before starting the bot
connectToServer()
  .then(() => {
    bot.use(async (ctx, next) => {
      // console.log(ctx.message);

      const notifierGroupID = process.env.GROUP_NOTIFIER_ID as string;
      const chatId = String(ctx.message?.chat.id || ctx.editedMessage?.chat.id);

      //limit the bot from disturbing the Group
      if (chatId == notifierGroupID) {
        return;
      }

      return next();
    });

    // bot.command("/notify", async (ctx) => {});

    bot.start(startBot);

    bot.on("contact", verifyUser);

    bot.hears(["✉️ Invite", "✉️ ጋብዝ"], inviteUser);
    bot.hears(["🎮 Play", "🎮 ተጫወት"], playGame);
    bot.hears(["🏆 Leaderboard", "🏆 መሪ ሰሌዳ"], sendLeaderboard);
    bot.hears(
      ["👥🏅 InviteLeaderboard", "👥🏅 የጋባዦች መሪ ሰሌዳ"],
      sendInviteLeaderboard
    );
    bot.hears(["⚙️ Settings", "⚙️ ቅንጅቶች"], settings);
    bot.gameQuery(handleGame);

    bot.action(["language", "ቋንቋ"], sendLanguages);
    bot.action(["am", "አማርኛ"], translateToAmharic);
    bot.action(["en", "እንግሊዝኛ"], translateToEnglish);
    bot.action(["guide", "መመሪያ"], guideManager);
    bot.action(["korki-am", "korki"], korkiGuide);
    bot.action(["levelup-am", "levelup"], levelupGuide);

    //TODO: Detect amharic
    bot.use(async (ctx) => {
      //check if user is registered already
      const db = getDb();
      const userController = new UserController(db);
      // const inviterId = Number(inviter.trim())

      var user = await userController.queryUser({ tgId: String(ctx.chat?.id) });
      if (!user || !user?.phone) {
        return ctx.reply(
          "Please share your phone number for sign up:",
          shareContact
        );
      }

      // console.log("user: ", user);

      const language = await getLanguage(String(ctx.chat?.id));
      if (language === "am") {
        return await ctx.reply("ዋና ምናሌ", mainMenuAmharic);
      }

      await ctx.reply("Main Menu: ", mainMenu);
    });

    bot.launch({
      webhook: {
        domain: "https://chewata-bot-rv7c.vercel.app/",
      },
    });

    // bot.launch();
  })
  .catch(console.error);

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
