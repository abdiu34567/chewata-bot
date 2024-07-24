import { Context } from "telegraf";
import { getDb } from "./db/config";
import { UserController } from "./db";
import recordDataToSheet from "./Api/sheetApiConfig";

const handleGame = async (ctx: Context) => {
  const cbk = ctx.callbackQuery as { game_short_name: string };

  //   const name = ctx.from?.first_name + " " + ctx.from?.last_name || "";
  //   await recordPlay(String(ctx.from?.id), name);

  const db = getDb();
  const userController = new UserController(db);
  const res = await userController.incrementPlayCount({
    tgId: String(ctx.from?.id),
    name: ctx.from?.first_name + " " + ctx.from?.last_name,
  });

  if (!res || (res && !res.tgId)) {
    return ctx.telegram.sendMessage(
      "1173180004",
      `Error:\n\nr${JSON.stringify(res, undefined, 2)}\n\n tgId: ${
        ctx.from?.id
      }`
    );
  }

  recordDataToSheet(res!);

  if (cbk.game_short_name === "korki") {
    await ctx.answerGameQuery(
      `https://chewata-web.vercel.app/roulette/korki/?user_id=${100}`
    );
  }

  if (cbk.game_short_name === "levelup") {
    await ctx.answerGameQuery(`https://cactus-chewata.web.app?userID=123`);
  }
};

async function recordPlay(userId: string, name: string) {
  const db = getDb();
  const collection = db.collection("users");
  const now = new Date();
  const minTimeBetweenPlays = 1 * 60 * 1000; // 1 minute in milliseconds
  const rollingWindowDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  // Find the player's document
  const player = await collection.findOne({ tgId: userId });

  if (!player) {
    console.log("New player");
    // New player, create a new document
    await collection.insertOne({
      tgId: userId,
      name,
      playCount: 1,
      lastPlayTime: now,
      score: 1,
      windowStartTime: now,
    });
    return { playCount: 1, score: 1 };
  } else {
    const timeSinceLastPlay =
      now.getTime() - new Date(player.lastPlayTime).getTime();
    const newPlayCount = player.playCount + 1;

    if (timeSinceLastPlay >= minTimeBetweenPlays) {
      const timeSinceWindowStart =
        now.getTime() - new Date(player.windowStartTime).getTime();
      let newScore, newWindowStartTime;

      if (timeSinceWindowStart >= rollingWindowDuration) {
        console.log("more than 2 hours");
        // If more than 2 hours have passed, restart the process
        newScore = player.score + 1;
        newWindowStartTime = now;
      } else {
        console.log("less than 2 hours");
        // Within the 2-hour window
        const weightedScoreIncrement = Math.min(
          Math.floor(timeSinceLastPlay / (3 * 60 * 1000)),
          3
        ); // Cap at 2, integer value
        newScore = player.score + weightedScoreIncrement;
        newWindowStartTime = player.windowStartTime;
      }

      // Update player stats
      const updatedPlayer = await collection.findOneAndUpdate(
        { tgId: userId },
        {
          $inc: { playCount: 1 },
          $set: {
            lastPlayTime: now,
            score: newScore,
            windowStartTime: newWindowStartTime,
          },
        },
        { returnDocument: "after" }
      );

      return {
        playCount: updatedPlayer!.playCount,
        score: updatedPlayer!.score,
      };
    } else {
      console.log("less than 1 minute");
      // Only update playCount if the cooldown period hasn't passed
      await collection.updateOne({ tgId: userId }, { $inc: { playCount: 1 } });
      return {
        playCount: newPlayCount,
        score: player.score,
      };
    }
  }
}

// Function to record a play and calculate score
// async function recordPlay(tgId: string, name: string) {
//   const now = new Date();
//   const minTimeBetweenPlays = 5 * 60 * 1000; // 5 minutes in milliseconds
//   //count total play clicks
//   const db = getDb();
//   const collection = db.collection("users");

//   // Find the player's document
//   const player = await collection.findOne({ tgId });

//   if (!player) {
//     // New player, create a new document
//     await collection.insertOne({
//       tgId,
//       name,
//       playCount: 1,
//       lastPlayTime: now,
//       score: 1,
//     });
//     return { playCount: 1, score: 1 };
//   } else {
//     const timeSinceLastPlay = player.lastPlayTime
//       ? now.getTime() - new Date(player.lastPlayTime).getTime()
//       : Infinity;
//     const newPlayCount = player.playCount + 1;
//     console.log("timeSinceLastPlay: ", timeSinceLastPlay);
//     console.log("minTimeBetweenPlays: ", minTimeBetweenPlays);

//     if (timeSinceLastPlay >= minTimeBetweenPlays) {
//       // Calculate weighted score increment
//       const weightedScoreIncrement = Math.min(
//         Math.floor(timeSinceLastPlay / (15 * 60 * 1000)),
//         8
//       ); // Cap at 2 hours (8 * 15 minutes)

//       // Update player stats
//       const updatedPlayer = await collection.findOneAndUpdate(
//         { tgId },
//         {
//           $inc: {
//             playCount: 1,
//             score: weightedScoreIncrement,
//           },
//           $set: { lastPlayTime: now },
//         },
//         { returnDocument: "after" }
//       );

//       return {
//         playCount: updatedPlayer!.playCount,
//         score: updatedPlayer!.score,
//       };
//     } else {
//       // Only update playCount if the cooldown period hasn't passed
//       await collection.updateOne({ tgId }, { $inc: { playCount: 1 } });

//       return {
//         playCount: newPlayCount,
//         score: player.score,
//       };
//     }
//   }
// }

export default handleGame;
