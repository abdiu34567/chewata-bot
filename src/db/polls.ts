import {
  Collection,
  Db,
  MongoError,
  Document,
  WithId,
  FindOneAndUpdateOptions,
  UpdateFilter,
} from "mongodb";

interface PollDocument extends Document {
  tgId: string;
  poll: Array<{ question: number; choice: string }>;
}
export class PollController {
  private collection: Collection<PollDocument>;

  constructor(db: Db) {
    this.collection = db.collection<PollDocument>("polls");
    // Ensure unique index on tgId for this collection
    this.collection.createIndex({ tgId: 1 }, { unique: true });
  }
  public async setPollResult(user: {
    tgId: string;
    question: number;
    choice: string;
  }) {
    const { tgId, choice, question } = user;

    if (!tgId || !choice || !question) {
      return;
    }

    try {
      const result = await this.collection.findOneAndUpdate(
        { tgId: tgId },
        {
          $setOnInsert: {
            tgId,
          },
          $push: { poll: { question, choice } },
        } as any,
        { returnDocument: "after", upsert: true }
      );
      return result;
    } catch (e: any) {
      console.log(e.message);
      return null;
    }
  }
}
