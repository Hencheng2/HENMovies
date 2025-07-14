// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Check if movies and themes are loaded from data/movies.js
    if (typeof movies === 'undefined' || typeof themes === 'undefined') {
        console.error('Error: movies.js not loaded or data is missing.');
        return;
    }

    const mainContent = document.querySelector('main');
    const themeButtonsContainer = document.getElementById('theme-buttons-container');
    const featuredMoviesGrid = document.getElementById('featured-movies-grid');
    const movieRequestSection = document.getElementById('movie-request-section');
    const requestMovieBtn = document.getElementById('request-movie-btn');
    const closeRequestFormBtn = document.getElementById('close-request-form');
    const movieRequestForm = document.getElementById('movie-request-form');
    const movieRequestTextarea = document.getElementById('movie-request-text');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Video Modal Elements
    const videoModal = document.getElementById('video-modal');
    const closeVideoModalBtn = document.getElementById('close-video-modal');
    const moviePlayer = document.getElementById('movie-player');
    const modalMovieTitle = document.getElementById('modal-movie-title');

    // --- Helper Functions ---

    /**
     * Creates a movie card HTML element.
     * @param {Object} movie - The movie object from the 'movies' array.
     * @returns {HTMLElement} The created movie card div.
     */
    function createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.image}" alt="${movie.name}">
            <div class="movie-details-overlay">
                <h3>${movie.name}</h3>
                <p>Theme: ${movie.theme}</p>
                <p>Length: ${movie.length}</p>
                <p>Type: ${movie.type}</p>
                <p>Year: ${movie.year}</p>
                <button class="watch-now-button violet-button" data-movie-id="${movie.id}">Watch Now</button>
            </div>
        `;
        return movieCard;
    }

    /**
     * Renders a list of movies into a specified grid container.
     * @param {Array<Object>} moviesToRender - Array of movie objects.
     * @param {HTMLElement} containerElement - The DOM element to render movies into.
     */
    function renderMovies(moviesToRender, containerElement) {
        containerElement.innerHTML = ''; // Clear existing content
        if (moviesToRender.length === 0) {
            containerElement.innerHTML = '<p class="no-results-message">No movies found matching your criteria.</p>';
            return;
        }
        moviesToRender.forEach(movie => {
            const movieCard = createMovieCard(movie);
            containerElement.appendChild(movieCard);
        });
        attachWatchNowListeners(); // Attach listeners after rendering
    }

    /**
     * Attaches click listeners to all "Watch Now" buttons.
     */
    function attachWatchNowListeners() {
        const watchNowButtons = document.querySelectorAll('.watch-now-button');
        watchNowButtons.forEach(button => {
            button.removeEventListener('click', handleWatchNowClick); // Prevent duplicate listeners
            button.addEventListener('click', handleWatchNowClick);
        });
    }

    /**
     * Handles the click event for "Watch Now" buttons.
     * @param {Event} event
     */
    function handleWatchNowClick(event) {
        const movieId = event.target.dataset.movieId;
        const movie = movies.find(m => m.id === movieId);

        if (movie) {
            modalMovieTitle.textContent = movie.name;
            moviePlayer.src = movie.video;
            videoModal.style.display = 'flex'; // Show the modal
            moviePlayer.load(); // Load the video
            moviePlayer.play(); // Autoplay the video
        } else {
            alert('Movie not found!');
        }
    }

    // --- Event Listeners and Initial Load ---

    // Generate Theme Buttons for the Home Page
    if (themeButtonsContainer) {
        themes.forEach(theme => {
            const themeButton = document.createElement('a');
            themeButton.href = `theme_page.html?theme=${encodeURIComponent(theme)}`; // Pass theme as URL parameter
            themeButton.classList.add('theme-button', 'violet-button');
            themeButton.textContent = theme;
            themeButtonsContainer.appendChild(themeButton);
        });
    }

    // Populate Featured Movies on Home Page
    if (featuredMoviesGrid) {
        // For featured, let's just pick the first few or a random selection
        const featured = movies.slice(0, 6); // Display first 6 movies as featured
        renderMovies(featured, featuredMoviesGrid);
    }

    // Handle Theme Page Loading
    const themePageTitle = document.getElementById('theme-page-title');
    const themeMoviesGrid = document.getElementById('theme-movies-grid');
    if (themePageTitle && themeMoviesGrid) {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedTheme = urlParams.get('theme');

        if (selectedTheme) {
            themePageTitle.textContent = `${selectedTheme} Movies`;
            const filteredMovies = movies.filter(movie => movie.theme === selectedTheme);
            renderMovies(filteredMovies, themeMoviesGrid);
        } else {
            themePageTitle.textContent = 'All Movies';
            renderMovies(movies, themeMoviesGrid); // Show all movies if no theme specified
        }
    }

    // Search Functionality
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (window.location.pathname.includes('theme_page.html')) {
                // If on a theme page, redirect to home with search term
                window.location.href = `index.html?search=${encodeURIComponent(searchTerm)}`;
            } else {
                // If on home page, filter and render
                filterAndRenderMovies(searchTerm);
            }
        });

        // Allow search on Enter key press
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                searchButton.click();
            }
        });

        // Check for search query in URL on page load (e.g., from a theme page redirect)
        const urlParams = new URLSearchParams(window.location.search);
        const initialSearchTerm = urlParams.get('search');
        if (initialSearchTerm && mainContent.id !== 'theme-page') { // Only apply on home page
            searchInput.value = initialSearchTerm;
            filterAndRenderMovies(initialSearchTerm);
        }
    }

    function filterAndRenderMovies(searchTerm) {
        const allMoviesContainer = featuredMoviesGrid; // Use featuredMoviesGrid for displaying search results on home
        let filteredMovies;
        if (searchTerm) {
            filteredMovies = movies.filter(movie =>
                movie.name.toLowerCase().includes(searchTerm) ||
                movie.theme.toLowerCase().includes(searchTerm) ||
                String(movie.year).includes(searchTerm)
            );
        } else {
            // If search term is empty, show default featured movies or all movies
            filteredMovies = movies.slice(0, 6); // Or just movies for all.
        }
        renderMovies(filteredMovies, allMoviesContainer);
        // Change section title for search results
        const featuredSectionTitle = document.querySelector('.featured-movies h2');
        if (featuredSectionTitle) {
            featuredSectionTitle.textContent = searchTerm ? `Search Results for "${searchTerm}"` : 'Featured Movies';
        }
    }


    // Movie Request Form Toggle
    if (requestMovieBtn && movieRequestSection) {
        requestMovieBtn.addEventListener('click', () => {
            movieRequestSection.classList.remove('hidden');
            mainContent.scrollIntoView({ behavior: 'smooth', block: 'end' }); // Scroll to the form
        });
    }

    if (closeRequestFormBtn && movieRequestSection) {
        closeRequestFormBtn.addEventListener('click', () => {
            movieRequestSection.classList.add('hidden');
        });
    }

    if (movieRequestForm) {
        movieRequestForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission
            const requestText = movieRequestTextarea.value.trim();
            if (requestText !== '') {
                alert(`Your request for "${requestText}" has been submitted. Thank you! (In a real app, this would be saved to a database)`);
                movieRequestTextarea.value = ''; // Clear the textarea
                movieRequestSection.classList.add('hidden'); // Hide the form after submission
            } else {
                alert('Please enter your movie request.');
            }
        });
    }

    // --- Video Modal Logic ---
    if (closeVideoModalBtn && videoModal && moviePlayer) {
        closeVideoModalBtn.addEventListener('click', () => {
            videoModal.style.display = 'none';
            moviePlayer.pause(); // Pause video when closing modal
            moviePlayer.currentTime = 0; // Reset video to start
            moviePlayer.src = ''; // Clear video source
        });

        // Close modal when clicking outside the content area
        window.addEventListener('click', (event) => {
            if (event.target === videoModal) {
                videoModal.style.display = 'none';
                moviePlayer.pause();
                moviePlayer.currentTime = 0;
                moviePlayer.src = '';
            }
        });

        // Pause video if user presses Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && videoModal.style.display === 'flex') {
                videoModal.style.display = 'none';
                moviePlayer.pause();
                moviePlayer.currentTime = 0;
                moviePlayer.src = '';
            }
        });
    }
});
