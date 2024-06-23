import { Markup } from "telegraf";
import { button } from "telegraf/typings/markup";

export const shareContact = Markup.keyboard([
    Markup.button.contactRequest('☎️ Share your phone number')
]).oneTime().resize();

// export const mainMenu = Markup.keyboard([
//     [Markup.keyboard('🎮 Play')]
//     Markup.button.contactRequest('☎️ Share your phone number')
//     Markup.button.contactRequest('☎️ Share your phone number')
// ]).oneTime().resize();

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