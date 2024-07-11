import { Context } from "telegraf";
import { Ques2, Ques3, Ques4, Ques5 } from "./keyboards";
import { getDb } from "./db/config";
import { PollController } from "./db/polls";

export const saveClub = async (ctx: Context) => {
  const cbk = ctx.callbackQuery as { data: string };
  const clubName = cbk.data;

  const db = getDb();
  const pollController = new PollController(db);

  const from = ctx.from! as { id: number };
  const tgId = String(from.id);

  await pollController.setPollResult({ tgId, question: 1, choice: clubName });

  await ctx.editMessageText(
    "[🇪🇸 Spain]\n\n<b>What will be the final score for Spain?</b>\n\n" +
      " (A) <i>0</i> \n (B) <i>1</i> \n (C) <i>2</i> \n (D) <i>3</i> \n (E) <i>4</i> \n (F) <i>5 or above</i>",
    { reply_markup: Ques2.reply_markup, parse_mode: "HTML" }
  );

  console.log(clubName);
};

export const saveClubScoreSpain = async (ctx: Context) => {
  const cbk = ctx.callbackQuery as { data: string };
  const clubScoreSpain = cbk.data;

  const db = getDb();
  const pollController = new PollController(db);

  const from = ctx.from! as { id: number };
  const tgId = String(from.id);

  await pollController.setPollResult({
    tgId,
    question: 2,
    choice: clubScoreSpain,
  });

  await ctx.editMessageText(
    "[🏴󠁧󠁢󠁥󠁮󠁧󠁿 England]\n\n<b> What will be the final score for England?</b>\n\n" +
      " (A) <i>0</i> \n (B) <i>1</i> \n (C) <i>2</i> \n (D) <i>3</i> \n (E) <i>4</i> \n (F) <i>5 or above</i> \n",
    { reply_markup: Ques3.reply_markup, parse_mode: "HTML" }
  );

  console.log(clubScoreSpain);
};
export const saveClubScoreEngland = async (ctx: Context) => {
  const cbk = ctx.callbackQuery as { data: string };
  const clubScoreEngland = cbk.data;

  const db = getDb();
  const pollController = new PollController(db);

  const from = ctx.from! as { id: number };
  const tgId = String(from.id);

  await pollController.setPollResult({
    tgId,
    question: 3,
    choice: clubScoreEngland,
  });

  await ctx.editMessageText(
    "<b> Will both teams score?</b>\n\n" + " (A) <i>Yes</i> \n (B) <i>No</i>",
    { reply_markup: Ques4.reply_markup, parse_mode: "HTML" }
  );

  console.log(clubScoreEngland);
};
export const save3rdQuestion = async (ctx: Context) => {
  const cbk = ctx.callbackQuery as { data: string };
  const thirdQues = cbk.data;

  const db = getDb();
  const pollController = new PollController(db);

  const from = ctx.from! as { id: number };
  const tgId = String(from.id);

  await pollController.setPollResult({
    tgId,
    question: 4,
    choice: thirdQues.split("-")[1],
  });

  await ctx.editMessageText(
    "[🌟 Bonus]\n\n<b> Will there be a penalty shootout?</b>\n\n" +
      " (A) <i>Yes</i> \n (B) <i>No</i>",
    { reply_markup: Ques5.reply_markup, parse_mode: "HTML" }
  );

  console.log(thirdQues);
};
export const save4rdQuestion = async (ctx: Context) => {
  const cbk = ctx.callbackQuery as { data: string };
  const forthQues = cbk.data;

  const db = getDb();
  const pollController = new PollController(db);

  const from = ctx.from! as { id: number };
  const tgId = String(from.id);

  await pollController.setPollResult({
    tgId,
    question: 5,
    choice: forthQues.split("-")[1],
  });

  await ctx.editMessageText(
    "🎉 Thank you for participating in our European 2024 Finale poll with House of Chewata! 🎉",
    { parse_mode: "HTML" }
  );

  console.log(forthQues);
};
