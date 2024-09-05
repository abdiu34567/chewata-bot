import { Collection, Db, MongoError } from "mongodb";

export class paymentController {
  private collection: Collection;

  constructor(db: Db) {
    this.collection = db.collection("payment");
    this.collection.createIndex({ tgId: 1 }, { unique: true });
  }

  public async manageTransaction(user: any) {
    const { tgId, payload, amount, status } = user;

    if (!tgId) {
      return null;
    }

    const newpayment = {
      status,
      payload,
      balance: amount,
    };

    try {
      const result = await this.collection.findOneAndUpdate(
        { tgId: tgId },
        {
          $set: newpayment,
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        {
          returnDocument: "after",
          upsert: true,
        }
      );
      return result;
    } catch (e: any) {
      console.log(e.message);
      return null;
    }
  }

  public async findTransaction(payload: string) {
    try {
      const result = await this.collection.findOne({ payload });
      if (result) {
        return result;
      } else {
        return null;
      }
    } catch (e: any) {
      console.log(e.message);
      return null;
    }
  }
}
