import axios from 'axios';


function recordDataToSheet(id?: number, language?: string, isStudent?: string, gender?: string, university?: string, collegeYear?: string, ageRange?: string, liveDorm?: string) {

    // Define the API endpoint
    const apiUrl = process.env.SHEET_URL!;

    // Set the data object containing the body parameters
    const data = {
        authKey: process.env.SHEET_AUTH_KEY,
        id,
        language,
        isStudent,
        gender,
        university,
        collegeYear,
        ageRange,
        liveDorm
    };

    console.log(data)

    // Make a POST request
    axios.post(apiUrl, data)
        .then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

export default recordDataToSheet