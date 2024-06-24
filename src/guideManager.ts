import { Context } from "telegraf";
import { games, gamesAmharic } from "./keyboards";

export const guideManager = async (ctx: Context) => {
  const message = ctx.callbackQuery as { data: string };
  const text = message.data;
  if (text === "መመሪያ") {
    return await ctx.editMessageText("ጨዋታ ይምረጡ:", gamesAmharic);
  }

  await ctx.editMessageText("Choose Game:", games);
};

export const korkiGuide = async (ctx: Context) => {
  const cbk = ctx.callbackQuery as { data: string };
  const text = cbk.data;
  if (text === "korki-am") {
    const message =
      "ስትራተጂካዊ የማሽከርከር ጀብዱ ጀምር! 🌀🌟 ምረጥ\n\nወደ መፍተል ጨዋታው ለመግባት <b>'ጨዋታ'</b> እና <b>'Korki'</b> ን መታ ያድርጉ።\n\nልዩ የብራንድ ኮርኮችን እና መከለያዎችን ይሰብስቡ ፣ እያንዳንዳቸው የተለያዩ የነጥብ እሴቶች።\n\nበየእለቱ ሽልማቶች እድልዎን ለመጠቀም <b>'start'</b> እና <b>'stop'</b> ን ይንኩ።\n\nበማሽከርከር ጉዞዎ ላይ መልካም ዕድል! 🎉\n\nነጥቦችዎን ለማየት እና ወደ ላይ ለመውጣት የመሪዎች ሰሌዳውን ይፈትሹ! 📊🏆\n\n";
    return await ctx.replyWithHTML(message);
  }

  const message =
    "<b>#SpinAndWin:</b>\n\nEmbark on a strategic spinning adventure! 🌀🌟 Choose \n\n<b>'Game'</b> and tap <b>'Korki'</b> to enter the spinning game. \n\nCollect exclusive brand corks and hoods, each with different point values. \n\nTap <b>Start</b> and <b>Stop</b> to seize your chance at daily rewards. \n\nBest of luck on your spinning journey! 🎉 \n\nCheck the leaderboard to see your points and climb to the top! 📊🏆 \n\n<b>#SpinAndWin</b>";

  await ctx.replyWithHTML(message);
};

export const levelupGuide = async (ctx: Context) => {
  const cbk = ctx.callbackQuery as { data: string };
  const text = cbk.data;
  if (text === "levelup-am") {
    const message =
      "አጨዋወት \n\nበጥምዝምዝ መንገድ እያንቀሳቀሳችሁ \n\nምግብ 🍊ለማግኘት ሞክሩ፥ ቫይረሶች🦠\n\nሳያጠቋችሁ ኪኒኖቹን  አግኙ 💊 \n\nእናም ወደ ጤና ማዕከል 🏥 \n\nአንዴ ኪኒኖቹን ከዋጣችሁ ቫይረሶቹን🦠 \n\nለማሸነፍ 8 ሰከንድ አላችሁ ";
    return await ctx.reply(message);
  }

  const message =
    "<b>Start:</b> move through the maze sliding up, down, left and right\n\nTry to eat 🍊 \n\nAvoid virus🦠 but if you get attacked take 💊, or go to hospital 🏥. \n\nIf you take the pills 💊 you have 8 seconds to kill the virus 🦠 \n\nBest of luck on your ,journey! 🎉";

  await ctx.replyWithHTML(message);
};
