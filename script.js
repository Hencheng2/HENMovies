// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Basic Setup & Element Selection ---
    // IMPORTANT: Ensure movies.js is loaded BEFORE script.js in your HTML.
    // Example: <script src="data/movies.js"></script> <script src="script.js"></script>
    if (typeof movies === 'undefined' || typeof themes === 'undefined') {
        console.error('Error: movies.js not loaded or data is missing. Make sure <script src="data/movies.js"></script> is placed BEFORE <script src="script.js"></script> in your HTML.');
        // Prevent further execution if critical data is missing
        return;
    }

    // Select core DOM elements
    const body = document.body; // Reference to the body for overflow control

    // Home page specific elements (check if they exist before using them)
    const themeButtonsContainer = document.getElementById('theme-buttons-container');
    const featuredMoviesGrid = document.getElementById('featured-movies-grid');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const featuredSectionTitle = document.querySelector('.featured-movies h2'); // Added for dynamic title

    // NEW ELEMENTS FOR DROPDOWN
    const themeDropdownToggle = document.getElementById('theme-dropdown-toggle');
    const themeButtonsWrapper = document.getElementById('theme-buttons-wrapper');


    // Theme page specific elements (check if they exist before using them)
    const themePageTitle = document.getElementById('theme-page-title');
    const themeMoviesGrid = document.getElementById('theme-movies-grid');

    // Video Modal Elements (check if they exist on the page)
    const videoModal = document.getElementById('video-modal');
    const closeVideoModalBtn = document.getElementById('close-video-modal');
    const moviePlayer = document.getElementById('movie-player');
    const modalMovieTitle = document.getElementById('modal-movie-title');


    // --- 2. Helper Functions for Dynamic Content & Modal Control ---

    /**
     * Creates a single movie card HTML element.
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
     * Attaches "Watch Now" listeners to newly created buttons.
     * @param {Array<Object>} moviesToRender - Array of movie objects.
     * @param {HTMLElement} containerElement - The DOM element to render movies into.
     */
    function renderMovies(moviesToRender, containerElement) {
        if (!containerElement) return; // Exit if the container element doesn't exist on the current page

        containerElement.innerHTML = ''; // Clear existing content
        if (moviesToRender.length === 0) {
            containerElement.innerHTML = '<p class="no-results-message">No movies found matching your criteria.</p>';
            return;
        }
        moviesToRender.forEach(movie => {
            const movieCard = createMovieCard(movie);
            containerElement.appendChild(movieCard);
        });
        // Important: Attach listeners *after* elements are added to the DOM
        attachWatchNowListeners();
    }

    /**
     * Attaches click listeners to all "Watch Now" buttons.
     * This function should be called every time new movie cards are rendered.
     */
    function attachWatchNowListeners() {
        // Select all current 'Watch Now' buttons on the page
        const watchNowButtons = document.querySelectorAll('.watch-now-button');

        // Iterate over them and attach the click handler
        watchNowButtons.forEach(button => {
            // Remove existing listener first to prevent duplicates if renderMovies is called multiple times
            button.removeEventListener('click', handleWatchNowClick);
            // Add the new listener
            button.addEventListener('click', handleWatchNowClick);
        });
    }

    /**
     * Handles the click event for "Watch Now" buttons.
     * Displays the video modal and plays the selected movie.
     * @param {Event} event - The click event object.
     */
    function handleWatchNowClick(event) {
        // Ensure modal elements exist before trying to use them
        if (!videoModal || !moviePlayer || !modalMovieTitle) {
            console.error('Video modal elements are missing from the DOM.');
            return;
        }

        const movieId = event.target.dataset.movieId; // Get the movie ID from the button's data attribute
        const movie = movies.find(m => m.id === movieId); // Find the movie object in our data

        if (movie) {
            modalMovieTitle.textContent = movie.name; // Set the title in the modal
            moviePlayer.src = movie.video; // Set the video source
            videoModal.style.display = 'flex'; // <<--- THIS IS THE ONLY LINE THAT SHOULD MAKE THE MODAL VISIBLE
            body.style.overflow = 'hidden'; // Prevent background scrolling when modal is open
            moviePlayer.load(); // Load the video (prepares it for playback)
            moviePlayer.play(); // Start playing the video automatically
        } else {
            console.error(`Movie with ID ${movieId} not found.`);
            alert('Sorry, the selected movie could not be found.');
        }
    }

    /**
     * Closes the video modal and pauses/resets the video player.
     */
    function closeVideoModal() {
        if (videoModal && moviePlayer) {
            videoModal.style.display = 'none'; // Hide the modal
            body.style.overflow = ''; // Restore background scrolling
            moviePlayer.pause(); // Pause the video
            moviePlayer.currentTime = 0; // Reset video playback to the beginning
            moviePlayer.src = ''; // Clear the video source (good for memory/performance)
            modalMovieTitle.textContent = ''; // Clear modal title
        }
    }

    // Attach listeners for closing the modal (these should always be active if modal exists)
    if (closeVideoModalBtn) {
        closeVideoModalBtn.addEventListener('click', closeVideoModal);
    }
    // Close modal when clicking outside the content area
    if (videoModal) {
        videoModal.addEventListener('click', (event) => {
            if (event.target === videoModal) { // Ensure click was directly on the overlay, not content inside
                closeVideoModal();
            }
        });
    }
    // Close modal on Escape key press
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && videoModal && videoModal.style.display === 'flex') {
            closeVideoModal();
        }
    });


    // --- 3. Page Initialization Logic ---

    // Initialize Home Page (index.html) specific elements and logic
    // We check for elements unique to index.html to know we are on that page
    if (themeButtonsContainer && featuredMoviesGrid && searchInput) {
        // Generate Theme Buttons
        themes.forEach(theme => {
            const themeButton = document.createElement('a');
            themeButton.href = `theme_page.html?theme=${encodeURIComponent(theme)}`; // Pass theme as URL parameter
            themeButton.classList.add('theme-button', 'violet-button');
            themeButton.textContent = theme;
            themeButtonsContainer.appendChild(themeButton);
        });

        // DROPDOWN TOGGLE LOGIC
        if (themeDropdownToggle && themeButtonsWrapper) {
            themeDropdownToggle.addEventListener('click', () => {
                if (themeButtonsWrapper.classList.contains('hidden')) {
                    // If currently hidden (display: none), remove hidden instantly
                    // then add visible for the animation
                    themeButtonsWrapper.classList.remove('hidden');
                    // Force reflow for transition to apply (important when changing display property)
                    void themeButtonsWrapper.offsetWidth; // Trigger reflow
                    themeButtonsWrapper.classList.add('visible');
                } else {
                    // If currently visible, remove visible for animation
                    themeButtonsWrapper.classList.remove('visible');
                    // Add hidden after transition completes
                    // The transition duration is 0.5s from style.css
                    themeButtonsWrapper.addEventListener('transitionend', function handler() {
                        if (!themeButtonsWrapper.classList.contains('visible')) {
                            themeButtonsWrapper.classList.add('hidden');
                        }
                        // Remove the event listener after it's fired once to prevent memory leaks
                        themeButtonsWrapper.removeEventListener('transitionend', handler);
                    });
                }

                // Scroll to the section if it opens off-screen
                if (themeButtonsWrapper.classList.contains('visible')) {
                    themeButtonsWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }

        // Populate Featured Movies (initially, show first 6 movies)
        const initialFeaturedMovies = movies.slice(0, 6);
        renderMovies(initialFeaturedMovies, featuredMoviesGrid);


        // Search Functionality for Home Page
        const applySearchFilter = (searchTerm) => {
            const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
            let filteredMovies;

            if (lowerCaseSearchTerm) {
                filteredMovies = movies.filter(movie =>
                    movie.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                    movie.theme.toLowerCase().includes(lowerCaseSearchTerm) ||
                    String(movie.year).includes(lowerCaseSearchTerm)
                );
                if (featuredSectionTitle) {
                    featuredSectionTitle.textContent = `Search Results for "${searchTerm}"`;
                }
            } else {
                // If search term is empty, revert to initial featured movies (first 6 from the full list)
                filteredMovies = movies.slice(0, 6);
                if (featuredSectionTitle) {
                    featuredSectionTitle.textContent = 'Featured Movies';
                }
            }
            renderMovies(filteredMovies, featuredMoviesGrid);
        };

        if (searchButton && searchInput) {
            searchButton.addEventListener('click', () => {
                applySearchFilter(searchInput.value);
            });

            // Allow search on Enter key press in the input field
            searchInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    applySearchFilter(searchInput.value);
                }
            });

            // Handle incoming search query from URL (e.g., if redirected from theme_page.html)
            const urlParams = new URLSearchParams(window.location.search);
            const initialSearchQuery = urlParams.get('search');
            if (initialSearchQuery) {
                searchInput.value = initialSearchQuery; // Pre-fill search input
                applySearchFilter(initialSearchQuery); // Apply the filter
                // Scroll to the search results section for better UX
                if (featuredMoviesGrid) {
                    featuredMoviesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    }


    // Initialize Theme Page (theme_page.html) specific elements and logic
    // We check for elements unique to theme_page.html to know we are on that page
    if (themePageTitle && themeMoviesGrid) {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedTheme = urlParams.get('theme');
        const searchTermFromHome = urlParams.get('search'); // Check if redirected from home search

        const allMovies = movies; // Reverted: Now works with all movies.

        let moviesToDisplay = [];

        if (selectedTheme) {
            // Display movies for a specific theme (all of them)
            themePageTitle.textContent = `${selectedTheme} Movies`;
            moviesToDisplay = allMovies.filter(movie => movie.theme === selectedTheme);
        } else if (searchTermFromHome) {
            // If redirected here with a search term, display search results on this page (all movies).
            themePageTitle.textContent = `Search Results for "${searchTermFromHome}"`;
            moviesToDisplay = allMovies.filter(movie =>
                movie.name.toLowerCase().includes(searchTermFromHome.toLowerCase()) ||
                movie.theme.toLowerCase().includes(searchTermFromHome.toLowerCase()) ||
                String(movie.year).includes(searchTermFromHome)
            );
        } else {
            // Default: show all movies if no theme or search term specified in URL
            themePageTitle.textContent = 'All Movies';
            moviesToDisplay = allMovies;
        }

        renderMovies(moviesToDisplay, themeMoviesGrid);
    }

}); // End of DOMContentLoaded
