import dotenv from "dotenv";
dotenv.config();

import { Context, session, Telegraf } from "telegraf";
import { connectToServer, getDb } from "./db/config";
import { startBot } from "./startBot";
import verifyUser from "./verifyUser";
import { mainMenu, mainMenuAmharic, shareContact } from "./keyboards";
import inviteUser from "./inviteUser";
import playGame from "./playGame";
import handleGame, { sendGames } from "./handleGame";
import { sendInviteLeaderboard, sendLeaderboard } from "./leaderboard";
import settings from "./settings";
import { sendLanguages } from "./sendLanguages";
import { translateToAmharic, translateToEnglish } from "./translate";
import { guideManager, korkiGuide, levelupGuide } from "./guideManager";
import { getLanguage } from "./utils";
import { UserController } from "./db";
import termsAndConditions from "./termsAndConditions";
import { loadUserAccount } from "./userAccount";
import {
  askForDepositeAmount,
  withdrawalRequest,
  confirmWithdrawal,
  handleBankSelection,
  handleCheckOut,
  handleDepositAmount,
  handleSuccessPayment,
  processWithdrawal,
  saveAccountNumber,
  saveAccountOwnerName,
  withdrawal,
  adminProcessWithdrawal,
} from "./payement";

interface SessionData {
  state: string;
  bankCode?: string;
  accountNumber?: string;
  accountOwner?: string;
  amount?: string;
  bank?: string;
  // ... more session data go here
}

// Define your own context type
export interface MyContext extends Context {
  session?: SessionData;
  // ... more props go here
}

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN!); // Make sure to have BOT_TOKEN in your .env file
bot.use(session());
// Connect to MongoDB before starting the bot
connectToServer()
  .then(() => {
    bot.use(async (ctx, next) => {
      //   console.log(ctx.message);

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

    bot.command("prize", sendGames);
    bot.command("deposite", askForDepositeAmount);
    bot.command("withdraw", withdrawal);

    bot.hears("ok", adminProcessWithdrawal);
    bot.hears(["👤 Account", "/account"], loadUserAccount);
    bot.hears(["✉️ Invite", "✉️ ጋብዝ", "/invite"], inviteUser);
    bot.hears(["🎮 Play", "🎮 ተጫወት", "/play"], playGame);
    bot.hears(["🏆 Leaderboard", "🏆 መሪ ሰሌዳ", "/leaderboard"], sendLeaderboard);
    bot.hears(
      ["👥🏅 Refferal Leaderboard", "👥🏅 የሪፈራል መሪ ሰሌዳ"],
      sendInviteLeaderboard
    );
    bot.hears(["⚙️ Settings", "⚙️ ቅንጅቶች", "/settings"], settings);
    bot.hears(
      ["📜Terms & Conditions", "📜 ውሎች እና ሁኔታዎች", "/termsandconditions"],
      termsAndConditions
    );

    bot.gameQuery(handleGame);

    bot.action(["language", "ቋንቋ"], sendLanguages);
    bot.action(["am", "አማርኛ", "amharic"], translateToAmharic);
    bot.action(["en", "እንግሊዝኛ", "english"], translateToEnglish);
    bot.action(["guide", "መመሪያ"], guideManager);
    bot.action(["korki-am", "korki"], korkiGuide);
    bot.action(["levelup-am", "levelup"], levelupGuide);
    bot.action(/bankCode_/, handleBankSelection);
    bot.action("confirm", withdrawalRequest);

    bot.on("successful_payment", handleSuccessPayment);
    bot.on("pre_checkout_query", handleCheckOut);

    //TODO: Detect amharic
    bot.use(async (ctx: MyContext) => {
      if (ctx.session?.state === "deposite") {
        return await handleDepositAmount(ctx);
      }

      if (ctx.session?.bankCode && ctx.session.state === "bank_selection") {
        return await saveAccountNumber(ctx);
      }

      if (
        ctx.session?.accountNumber &&
        ctx.session.state === "account_number"
      ) {
        return await saveAccountOwnerName(ctx);

        // return await processWithdrawal(ctx);
      }

      if (ctx.session?.accountOwner && ctx.session?.state === "account_owner") {
        return await confirmWithdrawal(ctx);
      }

      //check if user is registered already
      const db = getDb();
      const userController = new UserController(db);
      // const inviterId = Number(inviter.trim())

      var user = await userController.queryUser({ tgId: String(ctx.chat?.id) });
      if (!user || !user?.phone) {
        return ctx.reply(
          `Register using the button below ☎️\n\n` +
            `የታችኛውን ምልክት በመጫን የሃውስ ኦፍ ጨዋታ ቤተሰብ ይቀላቀሉ። ☎️`,
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
        domain: "https://chewata-bot.vercel.app/",
      },
    });

    // bot.launch();
  })
  .catch(console.error);

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
