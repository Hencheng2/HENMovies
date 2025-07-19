// data/movies.js
const movies = [
    {
       id: 'dave_and_the_kill_nod', // Must be unique and consistent
       name: 'Dave and the Kill Nod', // This is what shows on the card
       theme: 'Comedy', // Must exactly match a theme in your `themes` array
       length: '0h 48m', // From your Dailymotion screenshot
       type: 'Short', // Or 'Movie' if it's considered a full movie
       year: 2025, // From your Dailymotion screenshot
       image: 'movie_images/dave_kill_nod.jpg', // Make sure this path is correct and the image file exists
       video: 'k2FqgVQHYZlAZiDsv8a' // Your Dailymotion video ID
    },

    {
        id: 'funny_cats_compilation',
        name: 'Funny Cats Compilation',
        theme: 'Comedy',
        length: '15m',
        type: 'Short',
        year: 2022,
        image: 'movie_images/cats.jpg',
        // IMPORTANT: Replace 'xUNIQUEID_FOR_CATS' with your actual Dailymotion Video ID
        video: 'xUNIQUEID_FOR_CATS' // Example Dailymotion ID
    },

    {
        id: 'henrys-tiktok-video', // Give it a unique ID
        name: 'Henry\'s BeautyTok Video', // A name for your movie
        image: 'lucky.jpg', // Replace with a path to an image for this video
        theme: 'TikTok', // Or a relevant theme
        length: '0 min 30 sec', // Estimate the video length
        type: 'Short Clip',
        year: 2024, // Year of the video
        video: '7515310667314777400' // <--- THIS IS THE TIKTOK VIDEO ID
    },
    // Add more movie objects here following the same structure.
    // Make sure 'id' is unique, 'name' is correct, 'image' points to your image,
    // and 'video' contains ONLY the Dailymotion Video ID.

    // Example of another movie you might add:
    // {
    //     id: 'mystic_forest',
    //     name: 'Mystery of the Mystic Forest',
    //     theme: 'Fantasy',
    //     length: '1h 55m',
    //     type: 'Movie',
    //     year: 2021,
    //     image: 'movie_images/mystic_forest.jpg',
    //     video: 'xUNIQUEID_FOR_MYSTIC_FOREST' // <--- REPLACE THIS WITH THE ACTUAL DAILYMOTION ID
    // },
];

const themes = [
    'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Fantasy', 'Horror',
    'Adventure', 'Animation', 'Thriller', 'Romance', 'Mystery',
    'Documentary', 'Family', 'Musical', 'Crime', 'Western', 'War'
];
