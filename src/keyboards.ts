import { Markup } from "telegraf";

export const shareContact = Markup.keyboard([
  Markup.button.contactRequest("☎️ Share your phone number"),
])
  .oneTime()
  .resize();

//"🏆 Leaderboard"
//"🏆 መሪ ሰሌዳ"

export const mainMenuAmharic = Markup.keyboard([
  ["👤 መለያ", "🎮 ተጫወት"],
  ["✉️ ጋብዝ", "👥🏅 የሪፈራል መሪ ሰሌዳ"],
  ["📜 ውሎች እና ሁኔታዎች", "⚙️ ቅንጅቶች"],
]);

export const mainMenu = Markup.keyboard([
  ["👤 Account", "🎮 Play"],
  ["✉️ Invite", "👥🏅 Refferal Leaderboard"],
  ["📜Terms & Conditions", "⚙️ Settings"],
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

export const sendClimateGame = Markup.inlineKeyboard([
  //   Markup.button.url("Play Climate", "https://climate-app-react.vercel.app/"),
  Markup.button.webApp("Play Climate", "https://climate-app-react.vercel.app/"),
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
      "👥🏅 Refferal Leaderboard:",
      `https://invite-leaderboard.vercel.app/${userId}`
    ),
  ]);

export const inviteLeaderboardAmharic = (userId: number | string) =>
  Markup.inlineKeyboard([
    Markup.button.url(
      "👥🏅 የሪፈራል መሪ ሰሌዳ:",
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

export const bothLanguage = Markup.inlineKeyboard([
  Markup.button.callback("Amharic", "amharic"),
  Markup.button.callback("Engilish", "english"),
]);

// export const bothLanguage = Markup.keyboard([
//   ["🎮 Play", "✉️ Invite"],
//   ["⚙️ Settings", "👥🏅 Refferal Leaderboard"],
//   ["📜Terms & Conditions"],
// ])

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

export const prize = Markup.inlineKeyboard([
  Markup.button.callback("🕹 Levelup", "G-levelUp"),
]);

export const confirmWithdrawalKbd = Markup.inlineKeyboard([
  Markup.button.callback("✅ Confirm", "confirm"),
  Markup.button.callback("❌ Cancel", "cancel"),
]);

export const adminConfirmWithdrawalKbd = Markup.inlineKeyboard([
  Markup.button.callback("✅ Confirm", "admin_confirm"),
  Markup.button.callback("❌ Cancel", "admin_cancel"),
]);

export const banks = Markup.inlineKeyboard([
  [
    Markup.button.callback("Abay Bank", "bankCode_130"),
    Markup.button.callback("Addis International Bank", "bankCode_772"),
  ],
  [
    Markup.button.callback("Awash Bank", "bankCode_656"),
    Markup.button.callback("Ahadu Bank", "bankCode_207"),
  ],
  [
    Markup.button.callback("Bank of Abyssinia", "bankCode_347"),
    Markup.button.callback("Berhan Bank", "bankCode_571"),
  ],
  [
    Markup.button.callback("Dashen Bank", "bankCode_880"),
    Markup.button.callback("CBEBirr", "bankCode_128"),
  ],
  [
    Markup.button.callback("Commercial Bank of Ethiopia (CBE)", "bankCode_946"),
    Markup.button.callback("Coopay-Ebirr", "bankC0de_893"),
  ],
  [
    Markup.button.callback("Global Bank Ethiopia", "bankCode_301"),
    Markup.button.callback("Hibret Bank", "bankCode_534"),
  ],
  [
    Markup.button.callback("Lion International Bank", "bankCode_315"),
    Markup.button.callback("M-Pesa", "bankCode_266"),
  ],
  [
    Markup.button.callback("Nib International Bank", "bankCode_979"),
    Markup.button.callback("Oromia International Bank", "bankCode_423"),
  ],
  [
    Markup.button.callback("telebirr", "bankCode_855"),
    Markup.button.callback("Wegagen Bank", "bankCode_472"),
  ],
  [Markup.button.callback("Zemen Bank", "bankCode_687")],
]);

//korki => https://chewata-web.vercel.app/roulette/korki/?user_id={request.user.id}
//chewata => https://cactus-chewata.web.app?userID=123
