import axios from 'axios';

async function fetchPostCategories() {
    const url = 'https://api.yenehealth.com/post-category';


    try {
        const response = await axios.get(url);
        // console.log('Data fetched successfully:', response.data);
        return response.data;  // You can return the data or do something else with it here
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;  // Handle errors appropriately
    }
}
// fetchPosts()
export default fetchPostCategories