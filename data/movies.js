// data/movies.js

const movies = [
    {
        id: 'horror_1',
        name: 'The Whispering Woods',
        theme: 'Horror',
        length: '1h 35m',
        type: 'Movie',
        year: 2021,
        image: 'movie_images/horror_1.jpg',
        video: 'movies/horror_1.mp4'
    },
    {
        id: 'horror_2',
        name: 'Midnight Echoes',
        theme: 'Horror',
        length: '1h 40m',
        type: 'Movie',
        year: 2023,
        image: 'movie_images/horror_2.jpg',
        video: 'movies/horror_2.mp4'
    },
    {
        id: 'drama_1',
        name: 'Echoes of Tomorrow',
        theme: 'Drama',
        length: '2h 05m',
        type: 'Movie',
        year: 2022,
        image: 'movie_images/drama_1.jpg',
        video: 'movies/drama_1.mp4'
    },
    {
        id: 'drama_2',
        name: 'The Silent Pact',
        theme: 'Drama',
        length: '1h 58m',
        type: 'Movie',
        year: 2024,
        image: 'movie_images/drama_2.jpg',
        video: 'movies/drama_2.mp4'
    },
    {
        id: 'action_1',
        name: 'Code Red Pursuit',
        theme: 'Action',
        length: '1h 55m',
        type: 'Movie',
        year: 2023,
        image: 'movie_images/action_1.jpg',
        video: 'movies/action_1.mp4'
    },
    {
        id: 'comedy_1',
        name: 'Laugh Riot Express',
        theme: 'Comedy',
        length: '1h 30m',
        type: 'Movie',
        year: 2022,
        image: 'movie_images/comedy_1.jpg',
        video: 'movies/comedy_1.mp4'
    },
    {
        id: 'scifi_1',
        name: 'Nebula Genesis',
        theme: 'Sci-Fi',
        length: '2h 10m',
        type: 'Movie',
        year: 2024,
        image: 'movie_images/scifi_1.jpg',
        video: 'movies/scifi_1.mp4'
    },
    {
        id: 'thriller_1',
        name: 'The Unseen Threat',
        theme: 'Thriller',
        length: '1h 48m',
        type: 'Movie',
        year: 2023,
        image: 'movie_images/thriller_1.jpg',
        video: 'movies/thriller_1.mp4'
    },
    {
        id: 'animation_1',
        name: 'Whimsical Wonders',
        theme: 'Animation',
        length: '1h 25m',
        type: 'Movie',
        year: 2022,
        image: 'movie_images/animation_1.jpg',
        video: 'movies/animation_1.mp4'
    },
    {
        id: 'fantasy_1',
        name: 'Chronicles of Eldoria',
        theme: 'Fantasy',
        length: '2h 15m',
        type: 'Movie',
        year: 2023,
        image: 'movie_images/fantasy_1.jpg',
        video: 'movies/fantasy_1.mp4'
    },
    {
        id: 'documentary_1',
        name: 'Wilderness Unveiled',
        theme: 'Documentary',
        length: '1h 10m',
        type: 'Movie',
        year: 2021,
        image: 'movie_images/documentary_1.jpg',
        video: 'movies/documentary_1.mp4'
    }
];

// Exporting themes for dynamic theme page generation
const themes = [...new Set(movies.map(movie => movie.theme))].sort();
