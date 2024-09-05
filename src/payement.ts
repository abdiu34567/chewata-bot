import { Markup } from "telegraf";
import { MyContext } from ".";
import { getDb } from "./db/config";
import { paymentController } from "./db/payments";
import { TransactionController } from "./db/transaction";
import {
  adminConfirmWithdrawalKbd,
  banks,
  confirmWithdrawalKbd,
} from "./keyboards";
import { generateSecureToken } from "./utils";
import { forceReply } from "telegraf/typings/markup";
import recordTransactionsTOSheet from "./Api/trackTransactions";

export const askForDepositeAmount = async (ctx: MyContext) => {
  return await ctx.reply("coming soon ...");
  if (!ctx.session) {
    ctx.session = { state: "" };
  }

  await ctx.reply("Please enter the amount you want to deposit?");
  ctx.session!.state = "deposite";
};

// Function to handle the deposit amount and send an invoice
export const handleDepositAmount = async (ctx: MyContext) => {
  const message = ctx.message as { text: string };
  const amount = Number(message?.text); // Get the amount entered by the user

  if (isNaN(amount) || amount <= 0) {
    return ctx.reply("Please enter a valid amount.");
  }

  const payload = generateSecureToken();

  const invoice = {
    chat_id: ctx.from?.id!,
    title: "Deposit",
    description: "Deposit to your account",
    payload, // Unique payload for your internal reference
    provider_token: process.env.PROVIDER_TOKEN!,
    currency: "ETB",
    prices: [{ label: "Deposit", amount: amount * 100 }],
    start_parameter: "start", // A unique parameter for this invoice
  };

  await ctx.replyWithInvoice(invoice);
  const db = getDb();
  await deposite(db, payload, amount, "pending", ctx.from?.id!);

  ctx.session!.state = ""; // Reset the state after sending the invoice
};

export const handleCheckOut = async (ctx: MyContext) => {
  const checkOut = ctx.preCheckoutQuery as { invoice_payload: string };

  const payload = checkOut?.invoice_payload;

  const db = getDb();
  const transaction = new TransactionController(db);

  const { matchedCount, modifiedCount } =
    await transaction.findAndUpdateTransaction(payload);

  if (matchedCount > 0 && modifiedCount > 0) {
    await ctx.answerPreCheckoutQuery(true);
  } else {
    await ctx.answerPreCheckoutQuery(
      false,
      "Invalid or expired payment attempt."
    );
  }
};

export const handleSuccessPayment = async (ctx: MyContext) => {
  const payment = ctx.message as { successful_payment: any };
  if (payment) {
    // send this to G sheet and Telegram private Group
    const userFullName = ctx.from?.first_name || "" + ctx.from?.last_name || "";
    const username = ctx.from?.username || "";
    const amount = payment.successful_payment.total_amount / 100;
    const currency = payment.successful_payment.currency;
    const invoice_payload = payment.successful_payment.invoice_payload;

    //TODO: send this to Excel sheet
    //send this to TG private group

    await ctx.telegram.sendMessage(
      "-1002149274408",
      `<b>✅ Deposite</b>\n\n` +
        `👤 <a href="tg://user?id=${ctx.from?.id}">${userFullName}</a>\n` +
        `💡 @${username || "-"}\n\n` +
        `Amount: <code>${amount} ETB</code>\n`,
      {
        parse_mode: "HTML",
      }
    );

    await recordTransactionsTOSheet({
      id: ctx.from?.id!,
      name: userFullName,
      amount,
      type: "Deposite",
    });

    // return managePayment(payload, amount, status, id);
  }
};

export const deposite = async (
  db: any,
  payload: string,
  amount: number,
  status: "pending" | "completed" | "failed",
  id: number
) => {
  const transactionManager = new TransactionController(db);
  await transactionManager.createTransaction({
    userId: String(id),
    type: "deposit",
    payload,
    amount,
    status,
  });
};

export const withdrawal = async (ctx: MyContext) => {
  return await ctx.reply("coming soon ...");
  return await ctx.reply("Select Bank:", banks);
  const db = getDb();
  //   const result = await new TransactionController(db).processWithdrawal(
  //     String(ctx.from?.id),
  //     1000,{}
  //   );

  //   if (!result!.success) {
  //     return await ctx.reply(result!.message);
  //   }

  await ctx.reply(
    "Your withdrawal request has been received and is being processed. You will receive a notification once it's completed."
  );
};

export const handleBankSelection = async (ctx: MyContext) => {
  const cbkData = ctx.callbackQuery as { data: string };
  ctx.session = {
    bankCode: cbkData.data.split("_")[1],
    state: "bank_selection",
    bank: cbkData.data.split("_")[0],
  };
  return await ctx.reply("Please enter your account number:");
};

export const saveAccountNumber = async (ctx: MyContext) => {
  const message = ctx.message as { text: string };
  ctx.session!.accountNumber = message.text;
  ctx.session!.state = "account_number";
  await ctx.reply("Please enter the account owner's full name:");
};

export const saveAccountOwnerName = async (ctx: MyContext) => {
  const message = ctx.message as { text: string };
  ctx.session!.accountOwner = message.text;
  ctx.session!.state = "account_owner";
  await ctx.reply("Please enter the amount of the transaction:");
};

export const confirmWithdrawal = async (ctx: MyContext) => {
  const message = ctx.message as { text: string };
  const withdrawalAmount = message.text;
  ctx.session!.amount = withdrawalAmount;

  const accountNumber = ctx.session!.accountNumber;
  const accountOwner = ctx.session!.accountOwner;
  const amount = ctx.session!.amount;
  const bankCode = ctx.session!.bankCode;
  const bankName = getBankNameById(Number(bankCode));

  await ctx.replyWithHTML(
    `<b>Please confirm your withdrawal:</b>\n\n` +
      `<pre>--------------------------\n` +
      `Bank:                ${bankName}\n` +
      `Account Number:      ${accountNumber}\n` +
      `Account Name:        ${accountOwner}\n` +
      `Requested Amount:    ${amount} ETB\n` +
      `Transaction Fee:     3.5% ETB\n` +
      `You will receive:    ${Number(amount) / 3.5} ETB\n` +
      `--------------------------` +
      `</pre>`,
    confirmWithdrawalKbd
  );
};

export const withdrawalRequest = async (ctx: MyContext) => {
  const accountNumber = ctx.session?.accountNumber;
  const accountOwner = ctx.session?.accountOwner;
  const amount = ctx.session?.amount;
  const bankCode = ctx.session?.bankCode;

  if (!accountNumber || !accountOwner || !amount || !bankCode) {
    try {
      ctx.deleteMessage(ctx.message?.message_id);
    } catch (e) {}

    return ctx.reply(
      "Session Expired!, please click /withdrawal to restart the withdraw"
    );
  }
  const bankName = getBankNameById(Number(bankCode));

  const db = getDb();
  const transaction = new TransactionController(db);
  const balance = await transaction.calculateBalance(String(ctx.from?.id));

  if (balance < Number(amount)) {
    return await ctx.reply("❌ Insufficient balance");
  }

  //send for verification
  ctx.telegram.sendMessage(
    "-1002149274408",
    `<b>✅ Withdrawal</b>\n\n` +
      `👤 <b><a href="tg://user?id=${ctx.from?.id}">${
        ctx.from?.first_name || ""
      } ${ctx.from?.last_name || ""}</a>\n` +
      `🆔 <code>${ctx.from?.id}</code>\n` +
      `💡 @${ctx.from?.username || "-"}\n` +
      `💰 ${balance} ETB</b>\n\n` +
      `<pre>Amount: ${amount} ETB\n` +
      `Account Number: ${accountNumber}\n` +
      `Account Name: ${accountOwner}\n` +
      `Bank Name: ${bankName}\n</pre>`,
    {
      parse_mode: "HTML",
      //   reply_markup: adminConfirmWithdrawalKbd.reply_markup,
    }
  );

  //edit as sent
  await ctx.editMessageText(
    `<b>✅ Withdrawal Request Sent</b>\n\n` +
      `💰 <pre>Balance: ${balance} ETB\n\n` +
      `Amount:  ${Number(amount) / 3.5} ETB\n` +
      `Account Number: ${accountNumber}\n` +
      `Account Name: ${accountOwner}\n` +
      `Bank Name: ${bankName}\n</pre>`,
    { parse_mode: "HTML" }
  );

  await recordTransactionsTOSheet({
    id: ctx.from?.id!,
    name: accountOwner,
    amount: Number(amount),
    type: "Withdrawal",
    bank: bankName,
    userBankAccount: accountNumber,
  });
};

export const processWithdrawal = async (ctx: MyContext) => {
  const message = ctx.message as { text: string };
  const withdrawalAmount = message.text;

  if (isNaN(Number(withdrawalAmount))) {
    ctx.session!.state = "account_number";
    return ctx.reply("Please enter a valid amount.");
  }

  await ctx.reply("Please enter the amount of the transaction:");
};

function getBankNameById(bankId: number) {
  // Check if bankDetails and bankDetails.data exist
  if (!bankDetails || !bankDetails.data) {
    return "Bank details not available";
  }

  // Find the bank with the matching id
  const bank = bankDetails.data.find((bank) => bank.id === bankId);

  // Return the bank name if found, otherwise return a message
  return bank ? bank.name : "Bank not found";
}

function getBankCode(bankName: string) {
  // Normalize the input bank name
  const normalizedBankName = bankName.trim().toLowerCase();

  // Find the bank in the bankDetails data array
  const bank = bankDetails.data.find(
    (bank) => bank.name.toLowerCase() === normalizedBankName
  );

  // Return the swift code if found, otherwise return null
  return bank ? bank.id : null;
}

export const adminProcessWithdrawal = async (ctx: MyContext) => {
  const message = ctx.message as {
    reply_to_message: { text: string; message_id: number };
    message_id: number;
  };

  //Verify from which Group the request is coming
  if (String(ctx.chat?.id) !== "-1002149274408") {
    return await ctx.reply("❌ You are not authorized to use this command");
  }

  const replyTOMessage = message?.reply_to_message;
  const replyTO = replyTOMessage?.message_id;

  const transactionDetails = replyTOMessage?.text;

  const userInfo = transactionDetails?.split("\n\n")[1];
  const userId = userInfo?.split("\n")[1].split(" ")[1].trim();

  const transaction = transactionDetails?.split("\n\n")[2];
  const details = transaction?.split("\n");
  const amountDetail = details[0].split(": ")[1].trim();
  const amount = amountDetail.split(" ")[0];

  const accountNumber = details[1].split(": ")[1].trim();
  const accountOwner = details[2].split(": ")[1].trim();
  const bank = details[3].split(": ")[1].trim();
  const bankCode = getBankCode(bank);

  console.log(userId, amount, accountNumber, accountOwner, bank, bankCode);

  const db = getDb();
  const transactionManager = new TransactionController(db);
  const result = await transactionManager.processWithdrawal(
    String(userId),
    Number(amount),
    {
      account_name: accountOwner,
      account_number: accountNumber,
      bank_code: Number(bankCode),
    }
  );

  if (!result?.success) {
    return ctx.reply("❌ withdrawal failed", {
      parse_mode: "HTML",
      reply_parameters: { message_id: replyTO },
    });
  }

  ctx.reply(`✅ Withdrawal successful`, {
    parse_mode: "HTML",
    reply_parameters: { message_id: replyTO },
  });

  //notify user for succesful withdrawal
  ctx.telegram.sendMessage(
    userId,
    "✅ Your withdrawal request has been processed successfully.\n\n" +
      `<b>Amount:</b> <code>${amount}</code>\n` +
      `<b>To Bank:</b> <code>${bank}</code>`,
    { parse_mode: "HTML" }
  );
};

const bankDetails = {
  message: "Banks retrieved",
  data: [
    {
      id: 130,
      slug: "abay_bank",
      swift: "ABAYETAA",
      name: "Abay Bank",
      acct_length: 16,
      country_id: 1,
      is_mobilemoney: null,
      is_active: 1,
      is_rtgs: 1,
      active: 1,
      is_24hrs: null,
      created_at: "2023-01-24T04:28:30.000000Z",
      updated_at: "2024-08-03T08:10:24.000000Z",
      currency: "ETB",
    },
    {
      id: 772,
      slug: "addis_int_bank",
      swift: "ABSCETAA",
      name: "Addis International Bank",
      acct_length: 15,
      country_id: 1,
      is_mobilemoney: null,
      is_active: 1,
      is_rtgs: 1,
      active: 1,
      is_24hrs: 1,
      created_at: "2024-08-12T04:21:18.000000Z",
      updated_at: "2024-08-12T04:21:18.000000Z",
      currency: "ETB",
    },
    {
      id: 207,
      slug: "ahadu_bank",
      swift: "AHUUETAA",
      name: "Ahadu Bank",
      acct_length: 10,
      country_id: 1,
      is_mobilemoney: null,
      is_active: 1,
      is_rtgs: 1,
      active: 1,
      is_24hrs: 1,
      created_at: "2024-08-12T04:21:18.000000Z",
      updated_at: "2024-08-12T04:21:18.000000Z",
      currency: "ETB",
    },
    {
      id: 656,
      slug: "awash_bank",
      swift: "AWINETAA",
      name: "Awash Bank",
      acct_length: 14,
      country_id: 1,
      is_mobilemoney: null,
      is_active: 1,
      is_rtgs: 0,
      active: 1,
      is_24hrs: 0,
      created_at: "2022-03-17T04:21:30.000000Z",
      updated_at: "2024-08-02T20:08:46.000000Z",
      currency: "ETB",
    },
    {
      id: 347,
      slug: "boa_bank",
      swift: "ABYSETAA",
      name: "Bank of Abyssinia",
      acct_length: 8,
      country_id: 1,
      is_mobilemoney: null,
      is_active: 1,
      is_rtgs: 0,
      active: 1,
      is_24hrs: 0,
      created_at: "2022-07-04T21:33:57.000000Z",
      updated_at: "2024-08-02T20:08:45.000000Z",
      currency: "ETB",
    },
    {
      id: 571,
      slug: "berhan_bank",
      swift: "BERHETAA",
      name: "Berhan Bank",
      acct_length: 13,
      country_id: 1,
      is_mobilemoney: null,
      is_active: 1,
      is_rtgs: 1,
      active: 1,
      is_24hrs: 1,
      created_at: "2024-08-12T04:21:18.000000Z",
      updated_at: "2024-08-12T04:21:18.000000Z",
      currency: "ETB",
    },
    {
      id: 128,
      slug: "cbebirr",
      swift: "CBETETAA",
      name: "CBEBirr",
      acct_length: 10,
      country_id: 1,
      is_mobilemoney: 1,
      is_active: 1,
      is_rtgs: null,
      active: 1,
      is_24hrs: 1,
      created_at: "2024-01-24T14:41:12.000000Z",
      updated_at: "2024-08-12T20:16:07.000000Z",
      currency: "ETB",
    },
    {
      id: 946,
      slug: "cbe_bank",
      swift: "CBETETAA",
      name: "Commercial Bank of Ethiopia (CBE)",
      acct_length: 13,
      country_id: 1,
      is_mobilemoney: null,
      is_active: 1,
      is_rtgs: null,
      active: 1,
      is_24hrs: 1,
      created_at: "2022-03-17T04:21:18.000000Z",
      updated_at: "2024-08-03T05:56:23.000000Z",
      currency: "ETB",
    },
    {
      id: 893,
      slug: "ebirr",
      swift: "CBORETA",
      name: "Coopay-Ebirr",
      acct_length: 10,
      country_id: 1,
      is_mobilemoney: 1,
      is_active: 1,
      is_rtgs: null,
      active: 1,
      is_24hrs: 1,
      created_at: "2023-08-15T08:00:11.000000Z",
      updated_at: "2024-08-10T14:30:16.000000Z",
      currency: "ETB",
    },
    {
      id: 880,
      slug: "dashen_bank",
      swift: "DASHETAA",
      name: "Dashen Bank",
      acct_length: 13,
      country_id: 1,
      is_mobilemoney: null,
      is_active: 1,
      is_rtgs: 0,
      active: 1,
      is_24hrs: 0,
      created_at: "2022-11-15T03:17:43.000000Z",
      updated_at: "2024-08-02T20:08:46.000000Z",
      currency: "ETB",
    },
    {
      id: 301,
      slug: "global_bank",
      swift: "DEGAETAA",
      name: "Global Bank Ethiopia",
      acct_length: 13,
      country_id: 1,
      is_mobilemoney: null,
      is_active: 1,
      is_rtgs: 1,
      active: 1,
      is_24hrs: 1,
      created_at: "2024-08-12T04:21:18.000000Z",
      updated_at: "2024-08-12T04:21:18.000000Z",
      currency: "ETB",
    },
    {
      id: 534,
      slug: "hibret_bank",
      swift: "UNTDETAA",
      name: "Hibret Bank",
      acct_length: 16,
      country_id: 1,
      is_mobilemoney: null,
      is_active: 1,
      is_rtgs: 0,
      active: 1,
      is_24hrs: 0,
      created_at: "2023-01-06T03:18:43.000000Z",
      updated_at: "2024-08-02T20:08:46.000000Z",
      currency: "ETB",
    },
    {
      id: 315,
      slug: "anbesa_bank",
      swift: "LIBSETAA",
      name: "Lion International Bank",
      acct_length: 9,
      country_id: 1,
      is_mobilemoney: null,
      is_active: 1,
      is_rtgs: 1,
      active: 1,
      is_24hrs: 1,
      created_at: "2024-08-12T04:21:18.000000Z",
      updated_at: "2024-08-12T04:21:18.000000Z",
      currency: "ETB",
    },
    {
      id: 266,
      slug: "mpesa",
      swift: "MPESA",
      name: "M-Pesa",
      acct_length: 10,
      country_id: 1,
      is_mobilemoney: 1,
      is_active: 1,
      is_rtgs: null,
      active: 1,
      is_24hrs: 1,
      created_at: "2024-01-18T14:41:12.000000Z",
      updated_at: "2024-08-02T20:08:57.000000Z",
      currency: "ETB",
    },
    {
      id: 979,
      slug: "nib_bank",
      swift: "NIBIETAA",
      name: "Nib International Bank",
      acct_length: 13,
      country_id: 1,
      is_mobilemoney: null,
      is_active: 1,
      is_rtgs: 1,
      active: 1,
      is_24hrs: 1,
      created_at: "2024-08-12T04:21:18.000000Z",
      updated_at: "2024-08-12T04:21:18.000000Z",
      currency: "ETB",
    },
    {
      id: 423,
      slug: "oromia_bank",
      swift: "ORIRETAA",
      name: "Oromia International Bank",
      acct_length: 12,
      country_id: 1,
      is_mobilemoney: null,
      is_active: 1,
      is_rtgs: 1,
      active: 1,
      is_24hrs: 1,
      created_at: "2024-08-12T04:21:18.000000Z",
      updated_at: "2024-08-12T04:21:18.000000Z",
      currency: "ETB",
    },
    {
      id: 855,
      slug: "telebirr",
      swift: "TELEBIRR",
      name: "telebirr",
      acct_length: 10,
      country_id: 1,
      is_mobilemoney: 1,
      is_active: 1,
      is_rtgs: null,
      active: 1,
      is_24hrs: 1,
      created_at: "2022-12-12T14:41:12.000000Z",
      updated_at: "2024-08-02T20:08:57.000000Z",
      currency: "ETB",
    },
    {
      id: 472,
      slug: "wegagen_bank",
      swift: "WEGAETAA",
      name: "Wegagen Bank",
      acct_length: 13,
      country_id: 1,
      is_mobilemoney: null,
      is_active: 1,
      is_rtgs: 1,
      active: 1,
      is_24hrs: 0,
      created_at: "2022-11-15T03:16:40.000000Z",
      updated_at: "2024-08-12T20:15:43.000000Z",
      currency: "ETB",
    },
    {
      id: 687,
      slug: "zemen_bank",
      swift: "ZEMEETAA",
      name: "Zemen Bank",
      acct_length: 16,
      country_id: 1,
      is_mobilemoney: null,
      is_active: 1,
      is_rtgs: 1,
      active: 1,
      is_24hrs: 0,
      created_at: "2022-09-30T12:56:53.000000Z",
      updated_at: "2024-08-12T20:14:40.000000Z",
      currency: "ETB",
    },
  ],
};
