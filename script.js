// script.js

// Removed: let youtubePlayer; and all onYouTubeIframeAPIReady, onPlayerReady, onPlayerStateChange functions

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Basic Setup & Element Selection ---
    if (typeof movies === 'undefined' || typeof themes === 'undefined') {
        console.error('Error: movies.js not loaded or data is missing. Make sure <script src="data/movies.js"></script> is placed BEFORE <script src="script.js"></script> in your HTML.');
        return;
    }

    const body = document.body;
    const themeButtonsContainer = document.getElementById('theme-buttons-container');
    const featuredMoviesGrid = document.getElementById('featured-movies-grid');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const featuredSectionTitle = document.querySelector('.featured-movies h2');
    const themeDropdownToggle = document.getElementById('theme-dropdown-toggle');
    const themeButtonsWrapper = document.getElementById('theme-buttons-wrapper');
    const themePageTitle = document.getElementById('theme-page-title');
    const themeMoviesGrid = document.getElementById('theme-movies-grid');
    const videoModal = document.getElementById('video-modal');
    const closeVideoModalBtn = document.getElementById('close-video-modal');
    // Removed: const moviePlayer = document.getElementById('movie-player'); // No longer directly accessed
    const modalMovieTitle = document.getElementById('modal-movie-title');

    // To store the Dailymotion player object instance
    let dailymotionPlayerInstance; 

    // --- 2. Helper Functions ---
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

    function renderMovies(moviesToRender, containerElement) {
        if (!containerElement) return;
        containerElement.innerHTML = '';
        if (moviesToRender.length === 0) {
            containerElement.innerHTML = '<p class="no-results-message">No movies found matching your criteria.</p>';
            return;
        }
        moviesToRender.forEach(movie => {
            const movieCard = createMovieCard(movie);
            containerElement.appendChild(movieCard);
        });
        attachWatchNowListeners();
    }

    function attachWatchNowListeners() {
        const watchNowButtons = document.querySelectorAll('.watch-now-button');
        watchNowButtons.forEach(button => {
            button.removeEventListener('click', handleWatchNowClick);
            button.addEventListener('click', handleWatchNowClick);
        });
    }

    // *** MODIFIED handleWatchNowClick for Dailymotion API control and ended event ***
    function handleWatchNowClick(event) {
        if (!videoModal || !modalMovieTitle) { // moviePlayer is no longer directly accessed here
            console.error('Video modal elements are missing from the DOM.');
            return;
        }

        const movieId = event.target.dataset.movieId;
        const movie = movies.find(m => m.id === movieId);

        if (movie) {
            modalMovieTitle.textContent = movie.name;

            // Important: Clear any previous player and its container before creating a new one
            const playerContainer = document.getElementById('movie-player-container');
            if (playerContainer) {
                playerContainer.innerHTML = ''; // Clear old iframe

                // Create a new div where the Dailymotion player will be inserted
                const newPlayerDiv = document.createElement('div');
                newPlayerDiv.id = 'dailymotion-player-div'; // Give it a unique ID for the API
                playerContainer.appendChild(newPlayerDiv);

                // Initialize Dailymotion Player via API
                dailymotionPlayerInstance = DM.player(newPlayerDiv, {
                    video: movie.video, // This is your Dailymotion video ID from movies.js
                    width: '100%',
                    height: '450',
                    params: {
                        autoplay: true,
                        mute: false, // Set to true if you want to auto-mute on load
                        endscreen: false, // To prevent playing next related video
                        controls: true, // Ensure controls are visible
                        'ui-highlight': '8a2be2' // Optional: Change highlight color (e.g., your violet)
                    },
                });

                // Listen for the 'ended' event
                dailymotionPlayerInstance.on('ended', function() {
                    console.log('Video ended, closing modal...');
                    closeVideoModal();
                });

                videoModal.style.display = 'flex';
                body.style.overflow = 'hidden';

            } else {
                console.error('Player container not found in HTML.');
            }

        } else {
            console.error(`Movie with ID ${movieId} not found in movies.js.`);
            alert('Sorry, the selected movie could not be found.');
        }
    }

    // *** MODIFIED closeVideoModal for Dailymotion API control ***
    function closeVideoModal() {
        if (videoModal) {
            videoModal.style.display = 'none';
            body.style.overflow = '';

            // Destroy the Dailymotion player instance
            if (dailymotionPlayerInstance) {
                dailymotionPlayerInstance.destroy();
                dailymotionPlayerInstance = null; // Clear the reference
            }
            
            // Clear the innerHTML of the player container to remove the old iframe
            const playerContainer = document.getElementById('movie-player-container');
            if (playerContainer) {
                playerContainer.innerHTML = '';
            }

            modalMovieTitle.textContent = '';
        }
    }

    if (closeVideoModalBtn) {
        closeVideoModalBtn.addEventListener('click', closeVideoModal);
    }
    if (videoModal) {
        videoModal.addEventListener('click', (event) => {
            if (event.target === videoModal) {
                closeVideoModal();
            }
        });
    }
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && videoModal && videoModal.style.display === 'flex') {
            closeVideoModal();
        }
    });


    // --- 3. Page Initialization Logic ---
    if (themeButtonsContainer && featuredMoviesGrid && searchInput) {
        themes.forEach(theme => {
            const themeButton = document.createElement('a');
            themeButton.href = `theme_page.html?theme=${encodeURIComponent(theme)}`;
            themeButton.classList.add('theme-button', 'violet-button');
            themeButton.textContent = theme;
            themeButtonsContainer.appendChild(themeButton);
        });

        if (themeDropdownToggle && themeButtonsWrapper) {
            themeDropdownToggle.addEventListener('click', () => {
                if (themeButtonsWrapper.classList.contains('visible')) {
                    themeButtonsWrapper.classList.remove('visible');
                    setTimeout(() => {
                        themeButtonsWrapper.style.display = 'none';
                    }, 500);
                } else {
                    themeButtonsWrapper.style.display = 'block';
                    void themeButtonsWrapper.offsetWidth;
                    themeButtonsWrapper.classList.add('visible');
                    themeButtonsWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }

        const initialFeaturedMovies = movies.slice(0, 6);
        renderMovies(initialFeaturedMovies, featuredMoviesGrid);

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
            searchInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    applySearchFilter(searchInput.value);
                }
            });
            const urlParams = new URLSearchParams(window.location.search);
            const initialSearchQuery = urlParams.get('search');
            if (initialSearchQuery) {
                searchInput.value = initialSearchQuery;
                applySearchFilter(initialSearchQuery);
                if (featuredMoviesGrid) {
                    featuredMoviesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    }

    if (themePageTitle && themeMoviesGrid) {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedTheme = urlParams.get('theme');
        const searchTermFromHome = urlParams.get('search');
        const allMovies = movies;
        let moviesToDisplay = [];

        if (selectedTheme) {
            themePageTitle.textContent = `${selectedTheme} Movies`;
            moviesToDisplay = allMovies.filter(movie => movie.theme === selectedTheme);
        } else if (searchTermFromHome) {
            themePageTitle.textContent = `Search Results for "${searchTermFromHome}"`;
            moviesToDisplay = allMovies.filter(movie =>
                movie.name.toLowerCase().includes(searchTermFromHome.toLowerCase()) ||
                movie.theme.toLowerCase().includes(searchTermFromHome.toLowerCase()) ||
                String(movie.year).includes(searchTermFromHome)
            );
        } else {
            themePageTitle.textContent = 'All Movies';
            moviesToDisplay = allMovies;
        }
        renderMovies(moviesToDisplay, themeMoviesGrid);
    }
}); // End of DOMContentLoaded
    
