import axios from "axios";
export interface UserData {
  _id?: string;
  tgId?: number;
  credits?: number;
  dateJoined?: string;
  invitedBy?: string;
  isVerified?: boolean;
  korkis?: number;
  language?: string;
  name?: string;
  phone?: string;
  playCount?: number;
  referralCount?: number;
}

async function recordDataToSheet(obj: any) {
  // Define the API endpoint
  const apiUrl = process.env.SHEET_URI!;

  // Set the data object containing the body parameters
  const data = {
    // authKey: process.env.SHEET_AUTH_KEY,
    tgId: obj.tgId,
    userData: [
      obj.tgId,
      obj.credits,
      obj.dateJoined,
      obj.invitedBy || "",
      obj.isVerified,
      obj.korkis,
      obj.language || "en",
      obj.name,
      obj.phone || "",
      obj.playCount,
      obj.referralCount,
    ],
  };

  console.log("Data:", data);

  // Make a POST request
  try {
    await axios.post(apiUrl, data);
    return console.log("Data sent successfully");
  } catch (err) {
    console.log(err);
  }
}

export default recordDataToSheet;
