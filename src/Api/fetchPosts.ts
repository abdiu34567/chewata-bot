import axios from 'axios';

async function fetchPosts(page: number, lang: string, category: string, isStudent: boolean, cbkData: string) {
    const urlAndTags = getUrlAndTags(isStudent, cbkData);
    if (isStudent) { category = '' }//manual selection
    const url = `${urlAndTags.url}${category}`;
    const params = {
        post_type: 'article',
        page,
        page_size: 4,
        language: lang,
        tags: urlAndTags.tags
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

function getUrlAndTags(isStudent: boolean, cbkData: string) {
    var tags;
    if (!isStudent) {
        return { url: `https://api.yenehealth.com/post/category/`, tags: '' }
    }

    if (cbkData === "USRH") {
        return { url: `https://api.yenehealth.com/post/category/sexual-and-reproductive-health/`, tags: '' }
    }

    if (cbkData === "CP") tags = 'contraception';
    if (cbkData === "MH") tags = 'menstrualhealth';
    if (cbkData === "STI") tags = 'sexuallytransmittedinfections'

    if (cbkData === "MHS") tags = "mentalhealthandsrh"


    return { url: `https://api.yenehealth.com/posts/tagged`, tags }

}

// fetchPosts()
export default fetchPosts
