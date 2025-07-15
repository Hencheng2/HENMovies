// data/movies.js
const movies = [
    {
        id: 'the_great_adventure', // Unique ID for this movie
        name: 'The Great Adventure', // Movie title displayed on the card
        theme: 'Action', // Theme for filtering
        length: '1h 30m',
        type: 'Movie',
        year: 2023,
        image: 'movie_images/adventure.jpg', // Path to your movie poster image
        // IMPORTANT: This is the YouTube Video ID you provided: hUfryCDaQW0
        video: 'hUfryCDaQW0'
    },
    {
        id: 'funny_cats_compilation', // Unique ID for this movie
        name: 'Funny Cats Compilation',
        theme: 'Comedy',
        length: '15m',
        type: 'Short',
        year: 2022,
        image: 'movie_images/cats.jpg', // Path to your movie poster image
        // IMPORTANT: Replace 'xvFZjo5PgG0' with the actual YouTube Video ID for *this* movie
        video: 'xvFZjo5PgG0' // Example ID. **YOU MUST REPLACE THIS FOR YOUR OWN VIDEOS**
    },
    // Add more movie objects here following the same structure.
    // For each new movie:
    // 1. Upload its video to YouTube and get its unique Video ID.
    // 2. Add a new object to this 'movies' array.
    // 3. Make sure 'id' is unique, 'name' is correct, 'image' points to your image,
    //    and 'video' contains ONLY the YouTube Video ID.

    // Example of another movie you might add:
    // {
    //     id: 'mystic_forest',
    //     name: 'Mystery of the Mystic Forest',
    //     theme: 'Fantasy',
    //     length: '1h 55m',
    //     type: 'Movie',
    //     year: 2021,
    //     image: 'movie_images/mystic_forest.jpg',
    //     video: 'ANOTHER_YOUTUBE_VIDEO_ID_HERE' // <--- REPLACE THIS WITH THE ACTUAL YOUTUBE ID
    // },
];

const themes = [
    'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Fantasy', 'Horror',
    'Adventure', 'Animation', 'Thriller', 'Romance', 'Mystery',
    'Documentary', 'Family', 'Musical', 'Crime', 'Western', 'War'
];
