import axios from 'axios';

async function fetchFAQPosts(lang: string, isStudent: boolean) {
    var url = 'https://api.yenehealth.com/faq_v2';
    var tag = "yenehealth"
    if (isStudent) {
        tag = "#tg_srh";
        url = 'https://api.yenehealth.com/faq_v2'
    }

    const params = {
        tags: tag,
        search: '',
        language: lang
    };

    try {
        const response = await axios.get(url, { params });
        // console.log('Data fetched successfully:', response.data);
        return response.data;  // You can return the data or do something else with it here
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;  // Handle errors appropriately
    }
}
export default fetchFAQPosts