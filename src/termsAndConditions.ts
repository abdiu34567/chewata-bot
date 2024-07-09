import { Context } from "telegraf";

const termsAndConditions = async (ctx: Context) => {
  const message = ctx.message as { text: string };
  const text = message.text;
  if (text === "📜 ውሎች እና ሁኔታዎች") {
    const TAC_Amharic =
      `<b>📜 የChewata ቤት ውሎች እና ሁኔታዎች</b>\n\n` +
      `<b>1. መግቢያ፥</b>\n` +
      `ወደ Chewata ቤት እንኳን በደህና መጡ! የእኛን ቴሌግራም ጨዋታ ቦት በመጠቀም፣ በእነዚህ ውሎች ተስማምተዋል። ካልተስማሙ እባክዎን ቦቱን አይጠቀሙ።\n\n` +
      `<b>2. የተጠቃሚ ብቁነት፡-</b>\n` +
      `ይህን ቦት ለመጠቀም ቢያንስ 18 አመት መሆን አለቦት።\n\n` +
      `<b>3. የመለያ ምዝገባ፡-</b>\n` +
      `ሲመዘገቡ ትክክለኛ እና ወቅታዊ መረጃ ማቅረብ እና ይህን መረጃ ወቅታዊ ማድረግ አለቦት።\n\n` +
      `<b>4. የተጠቃሚ ምግባር፡-</b>\n` +
      `ቦቱን ለማንኛውም ህገወጥ ተግባራት ላለመጠቀም፣ሌሎችን ለማስመሰል፣አጸያፊ ይዘት ላለማጋራት ወይም የቦት አገልግሎቶችን ላለማደናቀፍ ተስማምተሃል።\n\n` +
      `<b>5. አእምሯዊ ንብረት፡-</b>\n` +
      `በቦት ውስጥ ያሉት ሁሉም ይዘቶች የ Chewata House ወይም የፍቃድ ሰጪዎቹ ናቸው። ያለፈቃድ ማንኛውንም ይዘት አያባዙ ወይም አያሰራጩ።\n\n` +
      `<b>6. የተጠያቂነት ገደብ፡-</b>\n` +
      `Chewata ቤት የቀረበው "እንደሆነ" ነው. በአጠቃቀሙ ለሚነሱ ጉዳዮች ተጠያቂ አይደለንም።\n\n` +
      `<b>7. ማካካሻ፡-</b>\n` +
      `እርስዎ ከቦት አጠቃቀምዎ ጋር በተያያዙ ማናቸውም የይገባኛል ጥያቄዎች የ Chewata ቤትን ለመከላከል እና ለመካስ ተስማምተዋል።\n\n` +
      `<b>8. ሽልማቶች እና ማስተዋወቂያዎች፡-</b>\n` +
      `አሸናፊዎች የግል ዝርዝሮችን እንዲያቀርቡ እና ሽልማቶችን ለመሰብሰብ በአካል ተገኝተው ሊጠየቁ ይችላሉ። አለማክበር ኪሳራ ሊያስከትል ይችላል.\n\n` +
      `<b>9. መቋረጥ፡</b>\n` +
      `እነዚህን ውሎች በመጣስ በማንኛውም ጊዜ የቦቱን መዳረሻ የማቋረጥ መብታችን የተጠበቀ ነው።\n\n` +
      `<b>10. በውሎች ላይ የተደረጉ ለውጦች፡-</b>\n` +
      `እነዚህን ውሎች እናዘምነዋለን እና ለውጦችን በbot እናሳውቀዎታለን። ከለውጦች በኋላ መጠቀም የቀጠለ ማለት አዲሶቹን ውሎች ይቀበላሉ ማለት ነው።\n\n` +
      `<b>11. የአስተዳደር ህግ፡-</b>\n` +
      `እነዚህ ውሎች የሚተዳደሩት በኢትዮጵያ ህግጋት ሲሆን አለመግባባቶች በኢትዮጵያ ፍርድ ቤቶች ይፈታሉ ።\n\n`;

    return await ctx.replyWithHTML(TAC_Amharic);
  }
  const TAC_English =
    "<b>📜Terms and Conditions for House of Chewata</b>\n\n" +
    "<b>1. Introduction:</b>\n" +
    "Welcome to House of Chewata! By using our Telegram Game Bot, you agree to these terms. If you do not agree, please do not use the bot.\n\n" +
    "<b>2. User Eligibility:</b>\n" +
    "You must be at least 18 years old to use this bot.\n\n" +
    "<b>3. Account Registration:</b>\n" +
    "When registering, you must provide accurate and current information and keep this information up to date.\n\n" +
    "<b>4. User Conduct:</b>\n" +
    "You agree not to use the bot for any illegal activities, impersonate others, share offensive content, or attempt to disrupt the bot’s services.\n\n" +
    "<b>5. Intellectual Property:</b>\n" +
    "All content within the bot is owned by House of Chewata or its licensors. Do not reproduce or distribute any content without permission.\n\n" +
    "<b>6. Limitation of Liability:</b>\n" +
    'House of Chewata is provided "as is." We are not liable for issues arising from its use.\n\n' +
    "<b>7. Indemnification:</b>\n" +
    "You agree to defend and indemnify House of Chewata against any claims related to your use of the bot.\n\n" +
    "<b>8. Prizes and Promotions:</b>\n" +
    "Winners may be required to provide personal details and appear in person to collect prizes. Failure to comply may result in forfeiture.\n\n" +
    "<b>9. Termination:</b>\n" +
    "We reserve the right to terminate your access to the bot at any time for violating these terms.\n\n" +
    "<b>10. Changes to Terms:</b>\n" +
    "We may update these terms and will notify you of changes through the bot. Continued use after changes means you accept the new terms.\n\n" +
    "<b>11. Governing Law:</b>\n" +
    "These terms are governed by the laws of Ethiopia, and disputes will be resolved in Ethiopian courts.\n\n";
  await ctx.replyWithHTML(TAC_English);
};

export default termsAndConditions;
