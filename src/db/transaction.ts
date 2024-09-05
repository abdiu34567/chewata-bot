import { Collection, Db, ObjectId } from "mongodb";
import { initiateWithdrawal, WithdrawalRequest } from "../Api/payments";

interface Transaction {
  _id?: ObjectId;
  userId: string;
  amount: number;
  type: "deposit" | "withdrawal" | "bonus";
  status: "pending" | "completed" | "failed";
  payload?: string;
  createdAt: Date;
}

export class TransactionController {
  private transactionCollection: Collection<Transaction>;

  constructor(db: Db) {
    this.transactionCollection = db.collection<Transaction>("transactions");

    db.collection("transactions").createIndex({
      userId: 1,
      type: 1,
      status: 1,
    });
  }

  async createTransaction(
    transaction: Omit<Transaction, "_id" | "createdAt">
  ): Promise<Transaction | null> {
    try {
      const newTransaction: Transaction = {
        ...transaction,
        createdAt: new Date(),
      };

      const result = await this.transactionCollection.insertOne(newTransaction);
      return result.acknowledged ? newTransaction : null;
    } catch (error) {
      console.error("Error creating transaction:", error);
      return null;
    }
  }
  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    try {
      return await this.transactionCollection.find({ userId }).toArray();
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  }

  async addBonus(
    userId: string,
    amount: number,
    reason: string
  ): Promise<Transaction | null> {
    try {
      const bonusTransaction: Omit<Transaction, "_id" | "createdAt"> = {
        userId,
        amount,
        type: "bonus",
        status: "completed", // Bonuses are typically completed immediately
        payload: `Bonus: ${reason}`,
      };

      return await this.createTransaction(bonusTransaction);
    } catch (error) {
      console.error("Error adding bonus:", error);
      return null;
    }
  }

  // Update calculateBalance method to include bonuses
  async calculateBalance(userId: string): Promise<number> {
    try {
      const transactions = await this.getTransactionsByUserId(userId);
      return transactions.reduce((balance, transaction) => {
        if (transaction.status !== "completed") return balance;
        if (transaction.type === "deposit" || transaction.type === "bonus") {
          return balance + transaction.amount;
        } else if (transaction.type === "withdrawal") {
          return balance - transaction.amount;
        }
        return balance;
      }, 0);
    } catch (error) {
      console.error("Error calculating balance:", error);
      return 0;
    }
  }

  async processWithdrawal(
    userId: string,
    amount: number,
    accountDetails: {
      account_name: string;
      account_number: string;
      bank_code: number;
    }
  ) {
    try {
      const currentBalance = await this.calculateBalance(userId);
      if (currentBalance < amount) {
        return { success: false, message: "Insufficient balance" };
      }

      const withdrawalData: WithdrawalRequest = {
        account_name: accountDetails.account_name,
        account_number: accountDetails.account_number,
        amount: amount.toString(),
        currency: "ETB",
        bank_code: accountDetails.bank_code,
      };

      const withdrawalResult = await initiateWithdrawal(withdrawalData);

      if (withdrawalResult.status === "success") {
        const transaction = this.createTransaction({
          userId,
          amount,
          type: "withdrawal",
          status: "completed",
          payload: `Withdrawal successful. Reference: ${withdrawalResult.reference}`,
        });

        if (!transaction) {
          return { success: false, message: "Failed to create transaction" };
        }

        return {
          success: true,
          message: "Withdrawal request created",
          transaction,
        };
      } else {
        return { success: false, message: "Withdrawal failed" };
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      return null;
    }
  }

  public async getTransactionByPayload(payload: string) {
    try {
      return await this.transactionCollection.findOne({ payload });
    } catch (e: any) {
      console.error("Error getting transaction:", e);
      return null;
    }
  }

  async updateTransactionStatus(
    payload: string,
    status: "completed" | "failed"
  ): Promise<boolean> {
    try {
      const result = await this.transactionCollection.updateOne(
        { payload },
        { $set: { status } }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Error updating transaction status:", error);
      return false;
    }
  }

  async findAndUpdateTransaction(
    payload: string
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const result = await this.transactionCollection.updateOne(
        { payload: payload, type: "deposit", status: "pending" },
        { $set: { status: "completed" } }
      );
      return {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      };
    } catch (error) {
      console.error("Error finding and updating transaction:", error);
      return { matchedCount: 0, modifiedCount: 0 };
    }
  }
}
