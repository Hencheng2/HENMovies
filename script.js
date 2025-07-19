// script.js
console.log('--- Script.js is definitely running ---'); // Basic check for file loading

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Basic Setup & Element Selection ---
    if (typeof movies === 'undefined' || typeof themes === 'undefined') {
        console.error('Error: movies.js not loaded or data is missing.');
        alert('Critical Error: Movie data not loaded. Please contact site admin.');
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
    // Reference to the container div for TikTok embeds
    const tiktokPlayerContainer = document.getElementById('tiktok-player-container'); 
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

    // *** MODIFIED handleWatchNowClick for TikTok Blockquote Embed ***
    function handleWatchNowClick(event) {
        if (!videoModal || !tiktokPlayerContainer || !modalMovieTitle) {
            console.error('Video modal elements or TikTok player container are missing from the DOM.');
            alert('Error: Missing modal components. Please contact site admin.');
            return;
        }

        const movieId = event.target.dataset.movieId;
        const movie = movies.find(m => m.id === movieId);

        if (movie) {
            modalMovieTitle.textContent = movie.name;

            // Clear any previous content in the container
            tiktokPlayerContainer.innerHTML = ''; 

            // movie.video must now be the TikTok VIDEO ID only (e.g., '7525859123427085575')
            const tiktokVideoId = movie.video; 
            // The 'cite' URL is a link back to the full video page
            const tiktokCiteUrl = `https://www.tiktok.com/video/${tiktokVideoId}`;

            const tiktokEmbedHtml = `
                <blockquote class="tiktok-embed" cite="${tiktokCiteUrl}" data-video-id="${tiktokVideoId}" data-embed-from="embed_page" style="max-width:605px; min-width:325px;">
                    <section>
                        <a target="_blank" href="${tiktokCiteUrl}">Watch this video on TikTok</a>
                    </section>
                </blockquote>
            `;
            tiktokPlayerContainer.innerHTML = tiktokEmbedHtml;

            videoModal.style.display = 'flex';
            body.style.overflow = 'hidden';

            // Crucial step: Tell TikTok's embed.js to process the new blockquote.
            // This function is typically exposed globally by the embed.js script.
            if (window.tiktok && window.tiktok.embed && typeof window.tiktok.embed.init === 'function') {
                window.tiktok.embed.init();
                console.log('*** DEBUG: TikTok embed.js init() called.');
            } else if (window.tiktok && window.tiktok.embed && typeof window.tiktok.embed.loadAll === 'function') {
                 window.tiktok.embed.loadAll(); // Alternative for re-rendering
                 console.log('*** DEBUG: TikTok embed.js loadAll() called.');
            } else {
                console.warn('TikTok embed.js re-initialization function not found or not ready. Video might not load properly.');
            }

        } else {
            console.error(`Movie with ID ${movieId} not found.`);
            alert('Sorry, the selected movie could not be found.');
        }
    }

    // *** MODIFIED closeVideoModal for TikTok Blockquote Embed ***
    function closeVideoModal() {
        if (videoModal && tiktokPlayerContainer) {
            videoModal.style.display = 'none';
            body.style.overflow = '';

            // Clear the container's HTML to remove the TikTok player
            tiktokPlayerContainer.innerHTML = ''; 
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
    // (This part remains the same as previous versions)
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
                if (themeButtonsWrapper.classList.contains('hidden')) {
                    themeButtonsWrapper.classList.remove('hidden');
                    setTimeout(() => themeButtonsWrapper.classList.add('visible'), 10); 
                    themeButtonsWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    themeButtonsWrapper.classList.remove('visible');
                    setTimeout(() => {
                        themeButtonsWrapper.classList.add('hidden');
                    }, 500); 
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
            
