import axios from "axios";
import { generateSecureToken } from "../utils";

export interface WithdrawalRequest {
  account_name: string;
  account_number: string;
  amount: string;
  currency: string;
  bank_code: number;
}

export async function initiateWithdrawal(
  withdrawalData: WithdrawalRequest
): Promise<any> {
  try {
    const reference = generateSecureToken();
    const apiUrl = "https://api.chapa.co/v1/transfers";
    const headers = {
      Authorization: `Bearer ${process.env.CHAPA_TEST}`,
      "Content-Type": "application/json",
    };

    const requestBody = {
      ...withdrawalData,
      reference,
    };

    const response = await axios.post(apiUrl, requestBody, { headers });
    return response.data;
  } catch (error: any) {
    console.error("Error initiating withdrawal:", error.response.data);
    // throw error;
  }
}
