// data/movies.js
const movies = [
    {
       id: 'dave_and_the_kill_nod',
       name: 'Dave and the Kill Nod',
       theme: 'Comedy',
       length: '30 sec',
       type: 'Meme', // <-- ENSURE THIS IS 'Movie', 'Series', 'Anime', or 'Meme' as appropriate
       year: 2023,
       image: 'movie_images/dave_kill_nod.jpg',
       video: 'k2FqgVQHYZlAZiDsv8a'
    },
    {
        id: 'action_movie_title',
        name: 'The Great Escape',
        theme: 'Action',
        length: '1h 45m',
        type: 'Movie', // <-- Example of a 'Movie'
        year: 2024,
        image: 'movie_images/great_escape.jpg',
        video: 'xACTIONID'
    },
    {
        id: 'anime_series_ep1',
        name: 'Dragon Ball Z - Ep 1',
        theme: 'Action',
        length: '24m',
        type: 'Anime', // <-- Example of an 'Anime'
        year: 1990,
        image: 'movie_images/dbz_ep1.jpg',
        video: 'xANIMEID'
    },
    {
        id: 'sitcom_episode_s1e1',
        name: 'Friends - The Pilot',
        theme: 'Comedy',
        length: '22m',
        type: 'Series', // <-- Example of a 'Series'
        year: 1994,
        image: 'movie_images/friends_s1e1.jpg',
        video: 'xSERIESID'
    },
    // ... add more movies with correct 'type' values
];

const themes = [
    // ... your existing themes
];
