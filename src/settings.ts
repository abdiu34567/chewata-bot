import { Context } from "telegraf";
import { setting, settingAmharic } from "./keyboards";

const settings = async (ctx: Context) => {
  const message = ctx.message as { text: string };
  const text = message.text;
  if (text === "⚙️ ቅንጅቶች") {
    return await ctx.reply("ቅንጅቶች:", settingAmharic);
  }

  await ctx.reply("Settings:", setting);
};

export default settings;
