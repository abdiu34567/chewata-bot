import { Markup } from "telegraf";
import { button } from "telegraf/typings/markup";

export const shareContact = Markup.keyboard([
  Markup.button.contactRequest("☎️ Share your phone number"),
])
  .oneTime()
  .resize();

//"🏆 Leaderboard"
//"🏆 መሪ ሰሌዳ"

export const mainMenuAmharic = Markup.keyboard([
  ["🎮 ተጫወት", "✉️ ጋብዝ"],
  ["⚙️ ቅንጅቶች", "👥🏅 የጋባዦች መሪ ሰሌዳ"],
  ["📜 ውሎች እና ሁኔታዎች"],
]);

export const mainMenu = Markup.keyboard([
  ["🎮 Play", "✉️ Invite"],
  ["⚙️ Settings", "👥🏅 InviteLeaderboard"],
  ["📜Terms & Conditions"],
]);

export const inviteAmharic = (userId: number | string) =>
  Markup.inlineKeyboard([
    Markup.button.url(
      "✉️ ጋብዝ:",
      `https://t.me/share/url?url=https://t.me/houseofchewataBot?start=${userId}`
    ),
  ]);

export const invite = (userId: number | string) =>
  Markup.inlineKeyboard([
    Markup.button.url(
      "✉️ Invite:",
      `https://t.me/share/url?url=https://t.me/houseofchewataBot?start=${userId}`
    ),
  ]);

export const sendGameChewata = Markup.inlineKeyboard([
  Markup.button.game("Play Chewata"),
]);

export const sendGameLevelUp = Markup.inlineKeyboard([
  Markup.button.game("Play Levelup"),
]);

export const leaderboardAmharic = (userId: number | string) =>
  Markup.inlineKeyboard([
    Markup.button.url(
      "🏆 መሪ ሰሌዳ:",
      `https://chewata-web.vercel.app/core/leaderboard?user_id=${userId}`
    ),
  ]);

export const leaderboard = (userId: number | string) =>
  Markup.inlineKeyboard([
    Markup.button.url(
      "🏆 Leaderboard:",
      `https://chewata-web.vercel.app/core/leaderboard?user_id=${userId}`
    ),
  ]);

export const inviteLeaderboard = (userId: number | string) =>
  Markup.inlineKeyboard([
    Markup.button.url(
      "👥🏅 Invite Leaderboard:",
      `https://invite-leaderboard.vercel.app/`
    ),
  ]);

export const inviteLeaderboardAmharic = (userId: number | string) =>
  Markup.inlineKeyboard([
    Markup.button.url(
      "👥🏅 የጋባዦች መሪ ሰሌዳ:",
      `https://invite-leaderboard.vercel.app/`
    ),
  ]);

export const settingAmharic = Markup.inlineKeyboard([
  Markup.button.callback("🗣️ ቋንቋ", "ቋንቋ"),
  Markup.button.callback("🗺️ መመሪያ", "መመሪያ"),
]);

export const setting = Markup.inlineKeyboard([
  Markup.button.callback("🗣️ Language", "language"),
  Markup.button.callback("🗺️ Guide", "guide"),
]);

export const languageAmharic = Markup.inlineKeyboard([
  Markup.button.callback("እንግሊዝኛ", "እንግሊዝኛ"),
  Markup.button.callback("አማርኛ", "አማርኛ"),
]);

export const language = Markup.inlineKeyboard([
  Markup.button.callback("English", "en"),
  Markup.button.callback("Amharic", "am"),
]);

export const gamesAmharic = Markup.inlineKeyboard([
  Markup.button.callback("🎮 Korki", "korki-am"),
  Markup.button.callback("🎮 Levelup", "levelup-am"),
]);

export const games = Markup.inlineKeyboard([
  Markup.button.callback("🎮 Korki", "korki"),
  Markup.button.callback("🎮 Levelup", "levelup"),
]);

//korki => https://chewata-web.vercel.app/roulette/korki/?user_id={request.user.id}
//chewata => https://cactus-chewata.web.app?userID=123

//polll
export const Ques1 = Markup.inlineKeyboard([
  Markup.button.callback("A", "Spain"),
  Markup.button.callback("B", "England"),
]);

export const Ques2 = Markup.inlineKeyboard([
  [
    Markup.button.callback("A", "spain-0"),
    Markup.button.callback("B", "spain-1"),
    Markup.button.callback("C", "spain-2"),
  ],
  [
    Markup.button.callback("D", "spain-3"),
    Markup.button.callback("E", "spain-4"),
    Markup.button.callback("F", "spain-5"),
  ],
]);

export const Ques3 = Markup.inlineKeyboard([
  [
    Markup.button.callback("A", "england-1"),
    Markup.button.callback("B", "england-2"),
    Markup.button.callback("C", "england-3"),
  ],
  [
    Markup.button.callback("D", "england-4"),
    Markup.button.callback("E", "england-5"),
    Markup.button.callback("F", "england-6"),
  ],
]);

export const Ques4 = Markup.inlineKeyboard([
  Markup.button.callback("A", "3-yes"),
  Markup.button.callback("B", "3-no"),
]);

export const Ques5 = Markup.inlineKeyboard([
  Markup.button.callback("A", "4-yes"),
  Markup.button.callback("B", "4-no"),
]);
