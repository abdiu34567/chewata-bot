import dotenv from "dotenv";
dotenv.config();

import { Telegraf } from "telegraf";
import { connectToServer, getDb } from "./db/config";
import { startBot } from "./startBot";
import verifyUser from "./verifyUser";
import { mainMenu, mainMenuAmharic } from "./keyboards";
import inviteUser from "./inviteUser";
import playGame from "./playGame";
import handleGame from "./handleGame";
import { sendInviteLeaderboard, sendLeaderboard } from "./leaderboard";
import settings from "./settings";
import { sendLanguages } from "./sendLanguages";
import { translateToAmharic, translateToEnglish } from "./translate";
import { guideManager, korkiGuide, levelupGuide } from "./guideManager";
import { getLanguage } from "./utils";

const bot = new Telegraf(process.env.BOT_TOKEN!); // Make sure to have BOT_TOKEN in your .env file

// Connect to MongoDB before starting the bot
connectToServer()
  .then(() => {
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

    bot.action(["language", "ቋንቋ"], sendLanguages);
    bot.action(["am", "አማርኛ"], translateToAmharic);
    bot.action(["en", "እንግሊዝኛ"], translateToEnglish);
    bot.action(["guide", "መመሪያ"], guideManager);
    bot.action(["korki-am", "korki"], korkiGuide);
    bot.action(["levelup-am", "levelup"], levelupGuide);

    bot.gameQuery(handleGame);

    //TODO: Detect amharic
    bot.use(async (ctx) => {
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
