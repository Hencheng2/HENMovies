// script.js

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
    const themePageTitle = document.getElementById('theme-page-title'); // This ID is also used on theme_page.html
    const themeMoviesGrid = document.getElementById('theme-movies-grid'); // This ID is also used on theme_page.html
    const videoModal = document.getElementById('video-modal');
    const closeVideoModalBtn = document.getElementById('close-video-modal');
    const moviePlayer = document.getElementById('movie-player');
    const modalMovieTitle = document.getElementById('modal-movie-title');
    const searchSuggestions = document.getElementById('search-suggestions');


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
            const dailymotionEmbedUrl = `https://geo.dailymotion.com/player.html?video=${movie.video}&autoplay=1`;
            moviePlayer.src = dailymotionEmbedUrl;

            videoModal.style.display = 'flex';
            body.style.overflow = 'hidden';

        } else {
            console.error(`Movie with ID ${movieId} not found.`);
            alert('Sorry, the selected movie could not be found.');
        }
    }

    function closeVideoModal() {
        if (videoModal && moviePlayer) {
            videoModal.style.display = 'none';
            body.style.overflow = '';
            moviePlayer.src = ''; // Clear the iframe's src to stop the video
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
    // This block runs for index.html (and parts also for theme_page.html depending on element presence)
    if (themeButtonsContainer && featuredMoviesGrid && searchInput) {
        themes.forEach(theme => {
            const themeButton = document.createElement('a');
            themeButton.href = `theme_page.html?theme=${encodeURIComponent(theme)}`;
            themeButton.classList.add('theme-button', 'violet-button');
            themeButton.textContent = theme;
            themeButtonsContainer.appendChild(themeButton);
        });

        // This is the "Explore by Theme" button toggle logic
        if (themeDropdownToggle && themeButtonsWrapper) {
            themeDropdownToggle.addEventListener('click', () => {
                if (themeButtonsWrapper.classList.contains('visible')) {
                    themeButtonsWrapper.classList.remove('visible');
                    setTimeout(() => {
                        themeButtonsWrapper.style.display = 'none';
                    }, 500); // Give time for transition
                } else {
                    themeButtonsWrapper.style.display = 'block';
                    // Force a reflow to ensure the 'display' change takes effect before 'max-height' transition
                    void themeButtonsWrapper.offsetWidth;
                    themeButtonsWrapper.classList.add('visible');
                    themeButtonsWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }

        // Logic for initial home page rendering (including category & search filters)
        const urlParams = new URLSearchParams(window.location.search);
        const initialSearchQuery = urlParams.get('search');
        const initialCategoryFilter = urlParams.get('type'); // Get 'type' parameter for category buttons

        // Debugging logs (you can remove these after confirming it works)
        console.log('*** Debugging Category Filter ***');
        console.log('URL Parameter (type):', initialCategoryFilter);

        let moviesToRenderOnHome = [];
        let homePageTitle = 'Featured Movies';

        if (initialCategoryFilter) {
            homePageTitle = `${initialCategoryFilter} Videos`;
            moviesToRenderOnHome = movies.filter(movie => {
                const isMatch = movie.type && movie.type.toLowerCase() === initialCategoryFilter.toLowerCase();
                console.log(`Checking movie: ${movie.name}, Type: ${movie.type}, Match: ${isMatch}`);
                return isMatch;
            });
            console.log('Filtered movies count:', moviesToRenderOnHome.length);
        } else if (initialSearchQuery) {
            homePageTitle = `Search Results for "${initialSearchQuery}"`;
            moviesToRenderOnHome = movies.filter(movie =>
                movie.name.toLowerCase().includes(initialSearchQuery.toLowerCase()) ||
                movie.theme.toLowerCase().includes(initialSearchQuery.toLowerCase()) ||
                (movie.type && movie.type.toLowerCase().includes(initialSearchQuery.toLowerCase())) ||
                String(movie.year).includes(initialSearchQuery)
            );
            searchInput.value = initialSearchQuery;
        } else {
            // Default display for homepage if no specific category or search filter
            moviesToRenderOnHome = movies.slice(0, 6); // Show first 6 movies as default featured
        }

        if (featuredSectionTitle) {
            featuredSectionTitle.textContent = homePageTitle;
        }
        renderMovies(moviesToRenderOnHome, featuredMoviesGrid);


        // Live Search / Autocomplete Logic
        if (searchInput && searchSuggestions) {
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase().trim();
                searchSuggestions.innerHTML = '';

                if (searchTerm.length > 0) {
                    const matchingMovies = movies.filter(movie =>
                        movie.name.toLowerCase().includes(searchTerm)
                    );
                    matchingMovies.sort((a, b) => a.name.localeCompare(b.name));
                    matchingMovies.slice(0, 10).forEach(movie => {
                        const suggestionDiv = document.createElement('div');
                        suggestionDiv.textContent = movie.name;
                        suggestionDiv.classList.add('search-suggestion-item');
                        suggestionDiv.addEventListener('click', () => {
                            searchInput.value = movie.name;
                            searchSuggestions.innerHTML = '';
                            searchSuggestions.style.display = 'none';
                            applySearchFilter(movie.name);
                        });
                        searchSuggestions.appendChild(suggestionDiv);
                    });

                    if (matchingMovies.length > 0) {
                        searchSuggestions.style.display = 'block';
                    } else {
                        searchSuggestions.style.display = 'none';
                    }
                } else {
                    searchSuggestions.style.display = 'none';
                }
            });

            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    searchSuggestions.style.display = 'none';
                }, 150);
            });

            searchInput.addEventListener('focus', () => {
                if (searchInput.value.length > 0 && searchSuggestions.children.length > 0) {
                    searchSuggestions.style.display = 'block';
                }
            });
        }

        const applySearchFilter = (searchTerm) => {
            const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
            let filteredMovies;
            if (lowerCaseSearchTerm) {
                filteredMovies = movies.filter(movie =>
                    movie.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                    movie.theme.toLowerCase().includes(lowerCaseSearchTerm) ||
                    (movie.type && movie.type.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    String(movie.year).includes(lowerCaseSearchTerm)
                );
                if (featuredSectionTitle) {
                    featuredSectionTitle.textContent = `Search Results for "${searchTerm}"`;
                }
            } else {
                const currentUrlParams = new URLSearchParams(window.location.search);
                const currentCategoryFilter = currentUrlParams.get('type');
                if (currentCategoryFilter) {
                    window.location.href = `index.html?type=${currentCategoryFilter}`;
                    return;
                } else {
                    window.location.href = `index.html`;
                    return;
                }
            }
            renderMovies(filteredMovies, featuredMoviesGrid);
            if (searchSuggestions) {
                searchSuggestions.style.display = 'none';
            }
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
        }
    }

    // This block specifically handles the theme_page.html (and will run if on that page)
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
                (movie.type && movie.type.toLowerCase().includes(searchTermFromHome.toLowerCase())) ||
                String(movie.year).includes(searchTermFromHome)
            );
        } else {
            themePageTitle.textContent = 'All Movies';
            moviesToDisplay = allMovies;
        }
        renderMovies(moviesToDisplay, themeMoviesGrid);
    }
}); // End of DOMContentLoaded
                        
