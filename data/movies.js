// data/movies.js
const movies = [
    {
        id: 'dave_kill_nod',
        name: 'Dave and the kill nod',
        theme: 'Comedy',
        length: '30 sec',
        type: 'Movie',
        year: 2023,
        image: 'dave_kill_nod.jpg',
        // IMPORTANT: Replace 'xUNIQUEID_FOR_ADVENTURE' with your actual Dailymotion Video ID
        video: 'k42u80yLZaxDZdDsv8a' // Example Dailymotion ID
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
