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

function recordDataToSheet(obj: any) {
  // Define the API endpoint
  const apiUrl = process.env.SHEET_URI!;

  // Set the data object containing the body parameters
  const data = {
    // authKey: process.env.SHEET_AUTH_KEY,
    tgId: obj.tgId,
    userData: [
      obj._id,
      obj.tgId,
      obj.credits,
      obj.dateJoined,
      obj.invitedBy,
      obj.isVerified,
      obj.korkis,
      obj.language,
      obj.name,
      obj.phone,
      obj.playCount,
      obj.referralCount,
    ],
  };

  // Make a POST request
  axios
    .post(apiUrl, data)
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export default recordDataToSheet;
