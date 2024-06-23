import dotenv from 'dotenv';
dotenv.config();


import { Telegraf } from 'telegraf';
import { connectToServer, getDb } from './db/config'
import { startBot } from './startBot';
import verifyUser from './verifyUser';
import { mainMenu } from './keyboards';
import inviteUser from './inviteUser';
import playGame from './playGame';
import handleGame from './handleGame';
import sendLeaderboard from './sendLeaderboard';
import sendInviteLeaderboard from './sendInviteLeaderboard';
import settings from './settings';

const bot = new Telegraf(process.env.BOT_TOKEN!);  // Make sure to have BOT_TOKEN in your .env file

// Connect to MongoDB before starting the bot
connectToServer().then(() => {
    bot.start(startBot);

    bot.on('contact', verifyUser)

    bot.hears("✉️ Invite", inviteUser)
    bot.hears("🎮 Play", playGame)
    bot.hears("🏆 Leaderboard", sendLeaderboard)
    bot.hears("👥🏅 InviteLeaderboard", sendInviteLeaderboard)
    bot.hears("⚙️ Settings", settings)

    bot.gameQuery(handleGame)

    bot.use(ctx => ctx.reply("Main Menu: ", mainMenu))



    bot.launch();
}).catch(console.error);

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
