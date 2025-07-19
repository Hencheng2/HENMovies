// script.js
console.log('--- Script.js is definitely running ---'); // Basic check for file loading

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Basic Setup & Element Selection ---
    if (typeof movies === 'undefined' || typeof themes === 'undefined') {
        console.error('Error: movies.js not loaded or data is missing. Make sure <script src="data/movies.js"></script> is placed BEFORE <script src="script.js"></script> in your HTML.');
        // Don't alert here as it might be too intrusive if it's a minor timing issue,
        // but the console error is important for debugging.
        return;
    }

    const body = document.body;
    const themeButtonsContainer = document.getElementById('theme-buttons-container');
    const featuredMoviesGrid = document.getElementById('featured-movies-grid');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    // Get the new search suggestions container
    const searchSuggestions = document.getElementById('search-suggestions'); 
    const featuredSectionTitle = document.querySelector('.featured-movies h2');
    const themeDropdownToggle = document.getElementById('theme-dropdown-toggle');
    const themeButtonsWrapper = document.getElementById('theme-buttons-wrapper');
    const themePageTitle = document.getElementById('theme-page-title');
    const themeMoviesGrid = document.getElementById('theme-movies-grid');
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
        if (!containerElement) {
            console.error('Error: Target container for rendering movies not found.');
            return;
        }
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

            // Set the iframe's src directly with the Dailymotion embed URL
            // Ensure movie.video contains the full Dailymotion embed URL like 'https://www.dailymotion.com/embed/video/YOUR_ID?autoplay=1'
            moviePlayer.src = movie.video; 

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

            // Clear the iframe's src to stop the video and prevent background audio
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
                    void themeButtonsWrapper.offsetWidth; // Trigger reflow to apply display:block before adding 'visible'
                    themeButtonsWrapper.classList.add('visible');
                    themeButtonsWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }

        const initialFeaturedMovies = movies.slice(0, 6);
        renderMovies(initialFeaturedMovies, featuredMoviesGrid);

        // --- Live Search / Autocomplete Logic ---
        if (searchInput && searchSuggestions) {
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase().trim();
                searchSuggestions.innerHTML = ''; // Clear previous suggestions

                if (searchTerm.length > 0) {
                    const matchingMovies = movies.filter(movie =>
                        movie.name.toLowerCase().includes(searchTerm)
                    );

                    // Sort suggestions alphabetically by name
                    matchingMovies.sort((a, b) => a.name.localeCompare(b.name));

                    // Display up to 10 suggestions
                    matchingMovies.slice(0, 10).forEach(movie => {
                        const suggestionDiv = document.createElement('div');
                        suggestionDiv.textContent = movie.name;
                        suggestionDiv.classList.add('search-suggestion-item'); // Add a class for styling
                        
                        // When a suggestion is clicked, fill the search input and hide suggestions
                        suggestionDiv.addEventListener('click', () => {
                            searchInput.value = movie.name;
                            searchSuggestions.innerHTML = ''; // Clear suggestions
                            searchSuggestions.style.display = 'none'; // Hide the container
                            applySearchFilter(movie.name); // Optionally trigger search immediately
                        });
                        searchSuggestions.appendChild(suggestionDiv);
                    });

                    if (matchingMovies.length > 0) {
                        searchSuggestions.style.display = 'block'; // Show the suggestion box
                    } else {
                        searchSuggestions.style.display = 'none'; // Hide if no matches
                    }
                } else {
                    searchSuggestions.style.display = 'none'; // Hide if search input is empty
                }
            });

            // Hide suggestions when search input loses focus (with a slight delay)
            // The delay allows clicks on suggestions to register before the box hides
            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    searchSuggestions.style.display = 'none';
                }, 150); 
            });

            // Show suggestions again if user focuses and there's text
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
            // Hide suggestions after a manual search
            searchSuggestions.style.display = 'none'; 
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
            
