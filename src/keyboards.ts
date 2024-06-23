import { Markup } from "telegraf";
import { button } from "telegraf/typings/markup";

export const shareContact = Markup.keyboard([
    Markup.button.contactRequest('☎️ Share your phone number')
]).oneTime().resize();


export const mainMenu = Markup.keyboard([
    ['🎮 Play', '🏆 Leaderboard'],
    ['✉️ Invite', '👥🏅 InviteLeaderboard'],
    ['⚙️ Settings']
])


export const invite = (userId: number | string) => Markup.inlineKeyboard([
    Markup.button.url('✉️ Invite', `https://t.me/share/url?url=https://t.me/chewetaa_bot?start=${userId}`),
]);

export const sendGame = Markup.inlineKeyboard([
    Markup.button.game('Play Chewata')
]);

export const leaderboard = (userId: number | string) => Markup.inlineKeyboard([
    Markup.button.url('🏆 Leaderboard', `https://chewata-web.vercel.app/core/leaderboard?user_id=${userId}`),
]);


export const inviteLeaderboard = (userId: number | string) => Markup.inlineKeyboard([
    Markup.button.url('🏆 Leaderboard', `https://invite-leaderboard.vercel.app/`),
]);



export const setting = Markup.inlineKeyboard([
    Markup.button.callback('🗣️ Language', 'language'),
    Markup.button.callback('🗺️', 'guide'),
]);
