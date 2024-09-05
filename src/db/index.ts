import { Collection, Db, MongoError } from "mongodb";

export class UserController {
  private collection: Collection;

  constructor(db: Db) {
    this.collection = db.collection("users");
    this.collection.createIndex({ tgId: 1 }, { unique: true });
  }

  public async createUser(user: any) {
    const { tgId, name, phone, invitedBy } = user;

    if (!tgId) {
      return null;
    }

    const newUser = {
      name,
      phone,
    };

    try {
      const result = await this.collection.findOneAndUpdate(
        { tgId: tgId },
        {
          $set: newUser,
          $setOnInsert: {
            tgId,
            dateJoined: new Date(),
            invitedBy,
            new_referral: 0,
            referralCount: 0,
            playCount: 0,
            isVerified: false,
            language: "en",
            credits: 100,
            korkis: 0,
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

  public async verifyUser(user: any) {
    const { tgId, phone, name } = user;

    if (!tgId) {
      return null;
    }

    const verifyUser = {
      phone,
      isVerified: true,
    };

    try {
      const result = await this.collection.findOneAndUpdate(
        { tgId: tgId },
        {
          $set: verifyUser,
          $setOnInsert: {
            dateJoined: new Date(),
            name,
            referralCount: 0,
            new_referral: 0,
            playCount: 0,
            language: "en",
            credits: 100,
            korkis: 0,
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

  public async increaseReferral(user: any) {
    const { tgId, name } = user;

    if (!tgId) {
      return;
    }

    try {
      const result = await this.collection.findOneAndUpdate(
        { tgId: tgId },
        {
          $inc: { new_referral: 1 },
          $setOnInsert: {
            referralCount: 1,
            tgId: tgId,
            name,
            dateJoined: new Date(),
            isVerified: false,
          },
        },
        { returnDocument: "after", upsert: true }
      );
      return result;
    } catch (e: any) {
      console.log(e.message);
      return null;
    }
  }

  public async queryUser(user: any) {
    const { tgId } = user;

    if (!tgId) {
      return;
    }

    try {
      const user = await this.collection.findOne({ tgId });
      if (user) {
        return user;
      } else {
        return null;
      }
    } catch (e: any) {
      console.log(e.message);
      return null;
    }
  }

  public async incrementPlayCount(user: any) {
    const { tgId, name } = user;

    if (!tgId) {
      return;
    }

    try {
      const result = await this.collection.findOneAndUpdate(
        { tgId: tgId },
        {
          $inc: { playCount: 1 },
          $setOnInsert: {
            tgId,
            name,
            dateJoined: new Date(),
            isVerified: false,
          },
        },
        { returnDocument: "after", upsert: true }
      );
      return result;
    } catch (e: any) {
      console.log(e.message);
      return e.message;
      return null;
    }
  }

  public async updateLanguage(user: any) {
    const { tgId, language } = user;

    if (!tgId || (language !== "en" && language !== "am")) {
      return;
    }

    try {
      const result = await this.collection.updateOne(
        { tgId: tgId },
        { $set: { language } },
        { upsert: true }
      );
      return result;
    } catch (e) {
      return null;
    }
  }

  public async fetchUsers() {
    try {
      const result = await this.collection.find().toArray();
      return result;
    } catch (e) {
      return null;
    }
  }

  async getUserDetailsWithTransactions(tgId: string) {
    const pipeline = [
      {
        $match: { tgId: tgId },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "tgId",
          foreignField: "userId",
          as: "transactions",
        },
      },
      {
        $project: {
          full_name: 1,
          phone: 1,
          totalDeposited: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$transactions",
                    as: "transaction",
                    cond: {
                      $and: [
                        { $eq: ["$$transaction.type", "deposit"] },
                        { $eq: ["$$transaction.status", "completed"] },
                      ],
                    },
                  },
                },
                as: "transaction",
                in: "$$transaction.amount",
              },
            },
          },
          totalBonus: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$transactions",
                    as: "transaction",
                    cond: {
                      $and: [
                        { $eq: ["$$transaction.type", "bonus"] },
                        { $eq: ["$$transaction.status", "completed"] },
                      ],
                    },
                  },
                },
                as: "transaction",
                in: "$$transaction.amount",
              },
            },
          },
          totalWithdrawn: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$transactions",
                    as: "transaction",
                    cond: {
                      $and: [
                        { $eq: ["$$transaction.type", "withdrawal"] },
                        { $eq: ["$$transaction.status", "completed"] },
                      ],
                    },
                  },
                },
                as: "transaction",
                in: "$$transaction.amount",
              },
            },
          },
        },
      },
      {
        $addFields: {
          totalBalance: {
            $subtract: [
              { $add: ["$totalDeposited", "$totalBonus"] },
              "$totalWithdrawn",
            ],
          },
        },
      },
    ];

    const result = await this.collection.aggregate(pipeline).toArray();
    return result[0];
  }
}
