import { Context } from "telegraf";
import { language, languageAmharic } from "./keyboards";

export const sendLanguages = async (ctx: Context) => {
  const message = ctx.callbackQuery as { data: string };
  const text = message.data;

  if (text === "ቋንቋ") {
    return await ctx.editMessageText("ቋንቋ ይምረጡ:", languageAmharic);
  }

  await ctx.editMessageText("Select Language:", language);
};
