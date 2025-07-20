// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Basic Setup & Element Selection ---
    // Ensure movies.js data is available
    if (typeof movies === 'undefined' || typeof themes === 'undefined') {
        console.error('Error: movies.js not loaded or data is missing. Make sure <script src="data/movies.js"></script> is placed BEFORE <script src="script.js"></script> in your HTML.');
        return;
    }

    const body = document.body;
    const themeButtonsContainer = document.getElementById('theme-buttons-container');
    const featuredMoviesGrid = document.getElementById('featured-movies-grid');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const featuredSectionTitle = document.querySelector('.featured-movies h2'); // Used on index.html
    const themeDropdownToggle = document.getElementById('theme-dropdown-toggle');
    const themeButtonsWrapper = document.getElementById('theme-buttons-wrapper');
    const themePageTitle = document.getElementById('theme-page-title'); // Used on theme_page.html
    const themeMoviesGrid = document.getElementById('theme-movies-grid'); // Used on theme_page.html
    const videoModal = document.getElementById('video-modal');
    const closeVideoModalBtn = document.getElementById('close-video-modal');
    const moviePlayer = document.getElementById('movie-player');
    const modalMovieTitle = document.getElementById('modal-movie-title');
    const searchSuggestions = document.getElementById('search-suggestions');
    const categoryButtons = document.querySelectorAll('.category-button'); // New: Select all category buttons


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
        containerElement.innerHTML = ''; // Clear existing content
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
            // Remove existing listener to prevent duplicates if renderMovies is called multiple times
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

            videoModal.style.display = 'flex'; // Show modal
            body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            console.error(`Movie with ID ${movieId} not found.`);
            alert('Sorry, the selected movie could not be found.');
        }
    }

    function closeVideoModal() {
        if (videoModal && moviePlayer) {
            videoModal.style.display = 'none';
            body.style.overflow = ''; // Restore background scrolling
            moviePlayer.src = ''; // Clear the iframe's src to stop the video
            modalMovieTitle.textContent = ''; // Clear modal title
        }
    }

    // Attach event listeners for modal close button and outside click
    if (closeVideoModalBtn) {
        closeVideoModalBtn.addEventListener('click', closeVideoModal);
    }
    if (videoModal) {
        videoModal.addEventListener('click', (event) => {
            if (event.target === videoModal) { // Close if clicked outside modal content
                closeVideoModal();
            }
        });
    }
    // Close modal on Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && videoModal && videoModal.style.display === 'flex') {
            closeVideoModal();
        }
    });


    // --- 3. Page Initialization Logic (for index.html) ---
    // This block runs if we are on index.html (has themeButtonsContainer, featuredMoviesGrid, searchInput)
    if (featuredMoviesGrid && searchInput) { // Removed theme containers from this check as they are now optional for initial render

        // Populate Theme buttons (if the container exists)
        if (themeButtonsContainer) {
            themes.forEach(theme => {
                const themeButton = document.createElement('a');
                themeButton.href = `theme_page.html?theme=${encodeURIComponent(theme)}`;
                themeButton.classList.add('theme-button', 'violet-button');
                themeButton.textContent = theme;
                themeButtonsContainer.appendChild(themeButton);
            });
        }

        // "Explore by Theme" dropdown toggle functionality
        if (themeDropdownToggle && themeButtonsWrapper) {
            themeDropdownToggle.addEventListener('click', () => {
                if (themeButtonsWrapper.classList.contains('visible')) {
                    themeButtonsWrapper.classList.remove('visible');
                    // Use a timeout to allow transition to complete before setting display: none
                    setTimeout(() => {
                        themeButtonsWrapper.style.display = 'none';
                    }, 500); // Matches CSS transition duration
                } else {
                    themeButtonsWrapper.style.display = 'block';
                    // Force a reflow to ensure the 'display' change takes effect before 'max-height' transition
                    void themeButtonsWrapper.offsetWidth; // Trigger reflow
                    themeButtonsWrapper.classList.add('visible');
                    // Scroll to the theme section smoothly after expanding
                    themeButtonsWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }

        // --- Category Filtering Logic ---
        let currentFilter = 'All'; // Default filter
        const initialCategoryParam = new URLSearchParams(window.location.search).get('category');
        if (initialCategoryParam && ['Movie', 'Series', 'Anime', 'Meme', 'All'].includes(initialCategoryParam)) {
            currentFilter = initialCategoryParam;
        }

        const filterMoviesByCategory = (category) => {
            let filteredMovies;
            if (category === 'All') {
                filteredMovies = movies;
            } else {
                filteredMovies = movies.filter(movie => movie.type === category);
            }
            if (featuredSectionTitle) {
                featuredSectionTitle.textContent = `${category} Movies`;
                if (category === 'All') {
                    featuredSectionTitle.textContent = 'All Categories';
                }
            }
            renderMovies(filteredMovies, featuredMoviesGrid);

            // Update active state for category buttons
            categoryButtons.forEach(button => {
                button.classList.remove('active');
                if (button.dataset.category === category) {
                    button.classList.add('active');
                }
            });
        };

        // Attach listeners to category buttons
        if (categoryButtons.length > 0) {
            categoryButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const category = button.dataset.category;
                    filterMoviesByCategory(category);
                    // Update URL without reloading page
                    const url = new URL(window.location.href);
                    url.searchParams.set('category', category);
                    url.searchParams.delete('search'); // Clear search query if category is selected
                    history.pushState(null, '', url.toString());
                });
            });
        }

        // Initial rendering for the home page based on URL parameters (category takes precedence over initial search)
        const urlParams = new URLSearchParams(window.location.search);
        const initialSearchQuery = urlParams.get('search');
        const initialLoadCategory = urlParams.get('category');

        if (initialLoadCategory) {
            currentFilter = initialLoadCategory;
            filterMoviesByCategory(currentFilter);
        } else if (initialSearchQuery) {
            const homePageTitle = `Search Results for "${initialSearchQuery}"`;
            const moviesToRenderOnHome = movies.filter(movie =>
                movie.name.toLowerCase().includes(initialSearchQuery.toLowerCase()) ||
                movie.theme.toLowerCase().includes(initialSearchQuery.toLowerCase()) ||
                (movie.type && movie.type.toLowerCase().includes(initialSearchQuery.toLowerCase())) ||
                String(movie.year).includes(initialSearchQuery)
            );
            searchInput.value = initialSearchQuery; // Populate search input with query
            if (featuredSectionTitle) {
                featuredSectionTitle.textContent = homePageTitle;
            }
            renderMovies(moviesToRenderOnHome, featuredMoviesGrid);
        } else {
            // Default display if no specific filter or search (e.g., initial page load)
            filterMoviesByCategory(currentFilter); // This will default to 'All'
        }


        // Live Search / Autocomplete Logic
        if (searchInput && searchSuggestions) {
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase().trim();
                searchSuggestions.innerHTML = ''; // Clear previous suggestions

                if (searchTerm.length > 0) {
                    const matchingMovies = movies.filter(movie =>
                        movie.name.toLowerCase().includes(searchTerm)
                    );
                    matchingMovies.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
                    matchingMovies.slice(0, 10).forEach(movie => { // Limit to 10 suggestions
                        const suggestionDiv = document.createElement('div');
                        suggestionDiv.textContent = movie.name;
                        suggestionDiv.classList.add('search-suggestion-item');
                        suggestionDiv.addEventListener('click', () => {
                            searchInput.value = movie.name;
                            searchSuggestions.innerHTML = '';
                            searchSuggestions.style.display = 'none';
                            applySearchFilter(movie.name); // Apply filter on click
                        });
                        searchSuggestions.appendChild(suggestionDiv);
                    });

                    if (matchingMovies.length > 0) {
                        searchSuggestions.style.display = 'block'; // Show suggestions
                    } else {
                        searchSuggestions.style.display = 'none'; // Hide if no matches
                    }
                } else {
                    searchSuggestions.style.display = 'none'; // Hide if search term is empty
                }
            });

            // Hide suggestions when input loses focus (with a slight delay for click events)
            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    searchSuggestions.style.display = 'none';
                }, 150);
            });

            // Show suggestions again on focus if input has text
            searchInput.addEventListener('focus', () => {
                if (searchInput.value.length > 0 && searchSuggestions.children.length > 0) {
                    searchSuggestions.style.display = 'block';
                }
            });
        }

        // Function to apply search filter (used by button and suggestion click)
        const applySearchFilter = (searchTerm) => {
            const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
            let filteredMovies;
            if (lowerCaseSearchTerm) {
                filteredMovies = movies.filter(movie =>
                    movie.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                    movie.theme.toLowerCase().includes(lowerCaseSearchTerm) ||
                    (movie.type && movie.type.toLowerCase().includes(lowerCaseSearchTerm)) || // Check type as well
                    String(movie.year).includes(lowerCaseSearchTerm)
                );
                if (featuredSectionTitle) {
                    featuredSectionTitle.textContent = `Search Results for "${searchTerm}"`;
                }
            } else {
                // If search term is empty, revert to default category filter
                filterMoviesByCategory(currentFilter);
                // Clear search from URL
                const url = new URL(window.location.href);
                url.searchParams.delete('search');
                history.pushState(null, '', url.toString());
                return;
            }
            renderMovies(filteredMovies, featuredMoviesGrid);
            if (searchSuggestions) {
                searchSuggestions.style.display = 'none'; // Hide suggestions after search
            }
            // Update URL with search query
            const url = new URL(window.location.href);
            url.searchParams.set('search', searchTerm);
            url.searchParams.delete('category'); // Clear category if search is performed
            history.pushState(null, '', url.toString());
        };

        // Search button click and Enter key press
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

    // --- Page Initialization Logic (for theme_page.html) ---
    // This block specifically handles the theme_page.html (and will run if on that page)
    if (themePageTitle && themeMoviesGrid) {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedTheme = urlParams.get('theme');
        const searchTermFromHome = urlParams.get('search'); // Allow search from home to carry over

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
            themePageTitle.textContent = 'All Movies'; // Default if no theme or search specified
            moviesToDisplay = allMovies;
        }
        renderMovies(moviesToDisplay, themeMoviesGrid); // Render on theme_page.html
    }
}); // End of DOMContentLoaded
            
