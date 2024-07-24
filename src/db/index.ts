import { Collection, Db, MongoError } from "mongodb";

export class UserController {
  private collection: Collection;

  constructor(db: Db) {
    this.collection = db.collection("users");
    this.collection.createIndex({ tgId: 1 }, { unique: true });
  }

  public async createUser(user: any) {
    const {
      tgId,
      name,
      phone,
      credits,
      korkis,
      language,
      referralCount,
      playCount,
      invitedBy,
      isVerified,
    } = user;

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
    const { tgId } = user;

    if (!tgId) {
      return;
    }

    try {
      const result = await this.collection.findOneAndUpdate(
        { tgId: tgId },
        {
          $inc: { referralCount: 1 },
          $setOnInsert: {
            tgId: tgId,
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
}
