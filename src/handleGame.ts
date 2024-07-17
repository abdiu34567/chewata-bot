import { Context } from "telegraf";
import { getDb } from "./db/config";
import { UserController } from "./db";
import recordDataToSheet from "./Api/sheetApiConfig";

const handleGame = async (ctx: Context) => {
  const cbk = ctx.callbackQuery as { game_short_name: string };
  if (cbk.game_short_name === "korki") {
    await ctx.answerGameQuery(
      `https://chewata-web.vercel.app/roulette/korki/?user_id=${100}`
    );
  }

  if (cbk.game_short_name === "levelup") {
    await ctx.answerGameQuery(`https://cactus-chewata.web.app?userID=123`);
  }

  //count total play clicks
  const db = getDb();

  const name = ctx.from?.first_name + " " + ctx.from?.last_name || "";
  await recordPlay(String(ctx.from?.id), name, db);

  //   const userController = new UserController(db);
  //   const res = await userController.incrementPlayCount({
  //     tgId: String(ctx.callbackQuery?.message?.chat?.id),
  //     name: ctx.from?.first_name + " " + ctx.from?.last_name,
  //   });

  //   console.log(res);
  //
  //   recordDataToSheet(res!);
};

// Function to record a play and calculate score
async function recordPlay(tgId: string, name: string, db: any) {
  const now = new Date();
  const minTimeBetweenPlays = 5 * 60 * 1000; // 5 minutes in milliseconds
  const collection = db.collection("users");

  // Find the player's document
  const player = await collection.findOne({ tgId });

  if (!player) {
    // New player, create a new document
    await collection.insertOne({
      tgId,
      name,
      playCount: 1,
      lastPlayTime: now,
      score: 1,
    });
    return { playCount: 1, score: 1 };
  } else {
    const timeSinceLastPlay = player.lastPlayTime
      ? now.getTime() - new Date(player.lastPlayTime).getTime()
      : Infinity;
    const newPlayCount = player.playCount + 1;

    if (timeSinceLastPlay >= minTimeBetweenPlays) {
      // Calculate weighted score increment
      const weightedScoreIncrement = Math.min(
        Math.floor(timeSinceLastPlay / (15 * 60 * 1000)),
        8
      ); // Cap at 2 hours (8 * 15 minutes)

      // Update player stats
      const updatedPlayer = await collection.findOneAndUpdate(
        { tgId },
        {
          $inc: {
            playCount: 1,
            score: weightedScoreIncrement,
          },
          $set: { lastPlayTime: now },
        },
        { returnDocument: "after" }
      );

      return {
        playCount: updatedPlayer.playCount,
        score: updatedPlayer.score,
      };
    } else {
      // Only update playCount if the cooldown period hasn't passed
      await collection.updateOne({ tgId }, { $inc: { playCount: 1 } });

      return {
        playCount: newPlayCount,
        score: player.score,
      };
    }
  }
}

export default handleGame;
