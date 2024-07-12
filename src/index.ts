import dotenv from "dotenv";
dotenv.config();

import { Telegraf } from "telegraf";
import { connectToServer, getDb } from "./db/config";
import { startBot } from "./startBot";
import verifyUser from "./verifyUser";
import {
  mainMenu,
  mainMenuAmharic,
  Ques1,
  Ques2,
  Ques3,
  Ques4,
  shareContact,
} from "./keyboards";
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
import termsAndConditions from "./termsAndConditions";
import { PollController } from "./db/polls";
import { ExtraPoll } from "telegraf/typings/telegram-types";
import {
  save3rdQuestion,
  save4rdQuestion,
  saveClub,
  saveClubScoreEngland,
  saveClubScoreSpain,
} from "./poll";

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

    //poll
    bot.action(["Spain", "England"], saveClub);
    bot.action(
      ["spain-0", "spain-1", "spain-2", "spain-3", "spain-4"],
      saveClubScoreSpain
    );
    bot.action(
      ["england-0", "england-1", "england-2", "england-3", "england-4"],
      saveClubScoreEngland
    );

    bot.action(["3-yes", "3-no"], save3rdQuestion);
    bot.action(["4-yes", "4-no"], save4rdQuestion);

    bot.hears(["✉️ Invite", "✉️ ጋብዝ"], inviteUser);
    bot.hears(["🎮 Play", "🎮 ተጫወት"], playGame);
    bot.hears(["🏆 Leaderboard", "🏆 መሪ ሰሌዳ"], sendLeaderboard);
    bot.hears(
      ["👥🏅 InviteLeaderboard", "👥🏅 የጋባዦች መሪ ሰሌዳ"],
      sendInviteLeaderboard
    );
    bot.hears(["⚙️ Settings", "⚙️ ቅንጅቶች"], settings);
    bot.hears(["📜Terms & Conditions", "📜 ውሎች እና ሁኔታዎች"], termsAndConditions);

    bot.gameQuery(handleGame);

    bot.action(["language", "ቋንቋ"], sendLanguages);
    bot.action(["am", "አማርኛ"], translateToAmharic);
    bot.action(["en", "እንግሊዝኛ"], translateToEnglish);
    bot.action(["guide", "መመሪያ"], guideManager);
    bot.action(["korki-am", "korki"], korkiGuide);
    bot.action(["levelup-am", "levelup"], levelupGuide);

    //TODO: Detect amharic
    bot.use(async (ctx) => {
      //sent from GAS
      //   return await ctx.replyWithHTML(
      //     "<b>Who do you think will win?</b>\n\n (A) <i>Spain</i> \n (B) <i>England</i>",
      //     Ques1
      //   );

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
