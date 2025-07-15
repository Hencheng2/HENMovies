// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Basic Setup & Element Selection ---
    // IMPORTANT: Ensure movies.js is loaded BEFORE script.js in your HTML.
    if (typeof movies === 'undefined' || typeof themes === 'undefined') {
        console.error('Error: movies.js not loaded or data is missing. Make sure <script src="data/movies.js"></script> is placed BEFORE <script src="script.js"></script> in your HTML.');
        return;
    }

    // Select core DOM elements
    const body = document.body;

    // Home page specific elements
    const themeButtonsContainer = document.getElementById('theme-buttons-container');
    const featuredMoviesGrid = document.getElementById('featured-movies-grid');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const featuredSectionTitle = document.querySelector('.featured-movies h2');

    // DROPDOWN ELEMENTS
    const themeDropdownToggle = document.getElementById('theme-dropdown-toggle');
    const themeButtonsWrapper = document.getElementById('theme-buttons-wrapper'); // This is the wrapper div for theme buttons

    // Theme page specific elements
    const themePageTitle = document.getElementById('theme-page-title');
    const themeMoviesGrid = document.getElementById('theme-movies-grid');

    // Video Modal Elements
    const videoModal = document.getElementById('video-modal');
    const closeVideoModalBtn = document.getElementById('close-video-modal');
    const moviePlayer = document.getElementById('movie-player');
    const modalMovieTitle = document.getElementById('modal-movie-title');


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

    function handleWatchNowClick(event) {
        if (!videoModal || !moviePlayer || !modalMovieTitle) {
            console.error('Video modal elements are missing from the DOM.');
            return;
        }
        const movieId = event.target.dataset.movieId;
        const movie = movies.find(m => m.id === movieId);
        if (movie) {
            modalMovieTitle.textContent = movie.name;
            moviePlayer.src = movie.video;
            videoModal.style.display = 'flex';
            body.style.overflow = 'hidden';
            moviePlayer.load();
            moviePlayer.play();
        } else {
            console.error(`Movie with ID ${movieId} not found.`);
            alert('Sorry, the selected movie could not be found.');
        }
    }

    function closeVideoModal() {
        if (videoModal && moviePlayer) {
            videoModal.style.display = 'none';
            body.style.overflow = '';
            moviePlayer.pause();
            moviePlayer.currentTime = 0;
            moviePlayer.src = '';
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

    // Home Page (index.html) specific elements and logic
    if (themeButtonsContainer && featuredMoviesGrid && searchInput) {
        // Generate Theme Buttons
        themes.forEach(theme => {
            const themeButton = document.createElement('a');
            themeButton.href = `theme_page.html?theme=${encodeURIComponent(theme)}`;
            themeButton.classList.add('theme-button', 'violet-button');
            themeButton.textContent = theme;
            themeButtonsContainer.appendChild(themeButton);
        });

        // REVISED DROPDOWN TOGGLE LOGIC
        if (themeDropdownToggle && themeButtonsWrapper) {
            themeDropdownToggle.addEventListener('click', () => {
                if (themeButtonsWrapper.classList.contains('visible')) {
                    // Currently visible, so hide it
                    themeButtonsWrapper.classList.remove('visible');
                    // Set display: none AFTER transition completes
                    setTimeout(() => {
                        themeButtonsWrapper.style.display = 'none';
                    }, 500); // Match this duration with your CSS transition (0.5s)
                } else {
                    // Currently hidden, so show it
                    themeButtonsWrapper.style.display = 'block'; // Make it visible (but collapsed) instantly
                    // Force reflow/repaint to ensure display:block applies before transition starts
                    void themeButtonsWrapper.offsetWidth;
                    themeButtonsWrapper.classList.add('visible'); // Add 'visible' to trigger transition

                    // Scroll to the section if it opens off-screen
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


    // Theme Page (theme_page.html) specific elements and logic
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
