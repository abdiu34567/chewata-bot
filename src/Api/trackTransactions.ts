import axios from "axios";

async function recordTransactionsTOSheet({
  id,
  name,
  amount,
  type,
  bank,
  userBankAccount,
}: {
  id: number;
  name: string;
  amount: number;
  type: string;
  bank?: string;
  userBankAccount?: string;
}) {
  // Define the API endpoint
  const apiUrl = process.env.SHEET_URI!;

  // Set the data object containing the body parameters
  const config = {
    params: {
      id,
      name,
      amount,
      type,
      bank,
      userBankAccount,
    },
  };

  try {
    await axios.get(apiUrl, config);
    return console.log("Data sent successfully");
  } catch (err) {
    console.log(err);
  }
}

export default recordTransactionsTOSheet;
