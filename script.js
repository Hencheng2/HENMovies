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
    // mainContent is not directly used for modal visibility, but kept for context.
    // const mainContent = document.querySelector('main');

    // Home page specific elements (check if they exist before using them)
    const themeButtonsContainer = document.getElementById('theme-buttons-container');
    const featuredMoviesGrid = document.getElementById('featured-movies-grid');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const requestMovieBtn = document.getElementById('request-movie-btn');
    const movieRequestSection = document.getElementById('movie-request-section');
    const closeRequestFormBtn = document.getElementById('close-request-form');
    const movieRequestForm = document.getElementById('movie-request-form');
    const movieRequestTextarea = document.getElementById('movie-request-text');
    const featuredSectionTitle = document.querySelector('.featured-movies h2'); // Added for dynamic title

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

        // Populate Featured Movies (initially, show first 6 movies as featured)
        // Adjust slice(0, 6) to show more or less featured movies as desired.
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
                // If search term is empty, revert to initial featured movies
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

        // Movie Request Form Toggle Logic
        if (requestMovieBtn && movieRequestSection) {
            requestMovieBtn.addEventListener('click', () => {
                movieRequestSection.classList.toggle('hidden'); // Toggle visibility
                if (!movieRequestSection.classList.contains('hidden')) {
                    // Scroll into view only if it's now visible
                    movieRequestSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    movieRequestTextarea.focus(); // Focus on the textarea for immediate input
                }
            });
        }

        if (closeRequestFormBtn && movieRequestSection) {
            closeRequestFormBtn.addEventListener('click', () => {
                movieRequestSection.classList.add('hidden'); // Hide it
                movieRequestTextarea.value = ''; // Clear textarea on close
            });
        }

        if (movieRequestForm) {
            movieRequestForm.addEventListener('submit', (event) => {
                event.preventDefault(); // Stop default form submission (prevents page reload)
                const requestText = movieRequestTextarea.value.trim();
                if (requestText) {
                    // In a real application, you'd send this data to a server (e.g., via fetch API)
                    alert(`Your request for "${requestText}" has been submitted. Thank you! (This is a demo message, no data is saved)`);
                    movieRequestTextarea.value = ''; // Clear the input field
                    movieRequestSection.classList.add('hidden'); // Hide the form
                } else {
                    alert('Please enter your movie request before submitting.');
                }
            });
        }
    }


    // Initialize Theme Page (theme_page.html) specific elements and logic
    // We check for elements unique to theme_page.html to know we are on that page
    if (themePageTitle && themeMoviesGrid) {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedTheme = urlParams.get('theme');
        const searchTermFromHome = urlParams.get('search'); // Check if redirected from home search

        let moviesToDisplay = [];

        if (selectedTheme) {
            // Display movies for a specific theme
            themePageTitle.textContent = `${selectedTheme} Movies`;
            moviesToDisplay = movies.filter(movie => movie.theme === selectedTheme);
        } else if (searchTermFromHome) {
            // If redirected here with a search term, display search results on this page.
            // Note: For a primary search, redirecting to index.html is often better
            // as it has the search bar. This handles showing results if theme_page is
            // accessed with a search parameter directly.
            themePageTitle.textContent = `Search Results for "${searchTermFromHome}"`;
            moviesToDisplay = movies.filter(movie =>
                movie.name.toLowerCase().includes(searchTermFromHome.toLowerCase()) ||
                movie.theme.toLowerCase().includes(searchTermFromHome.toLowerCase()) ||
                String(movie.year).includes(searchTermFromHome)
            );
        } else {
            // Default: show all movies if no theme or search term specified in URL
            themePageTitle.textContent = 'All Movies';
            moviesToDisplay = movies;
        }

        renderMovies(moviesToDisplay, themeMoviesGrid);
    }

}); // End of DOMContentLoaded
                
