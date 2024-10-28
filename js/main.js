const API_KEY = '68e85f17f4d33111d01abbdbd653c6d4'; // Replace with your TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';

// Function to fetch movies from TMDB
async function fetchMovies(genreId = '') {
    try {
        const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;
        const response = await fetch(url);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

// Function to search movies by title
async function searchMovies(query) {
    try {
        const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        displayMovies(data.results); // Display the searched movies
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

// Function to display movies on movie.html
function displayMovies(movies) {
    const movieCardsContainer = document.getElementById('movie-cards');
    movieCardsContainer.innerHTML = ''; // Clear previous content

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('col-md-4', 'mb-4');

        movieCard.innerHTML = `
            <div class="card">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <button class="btn btn-primary" onclick="viewDetails(${movie.id})">View Details</button>
                </div>
            </div>
        `;
        movieCardsContainer.appendChild(movieCard);
    });
}

// Function to filter movies by genre
function filterMoviesByGenre(genreId) {
    fetchMovies(genreId);
}

// Function to view movie details
function viewDetails(movieId) {
    localStorage.setItem('selectedMovieId', movieId);
    window.location.href = 'movieDetail.html'; // Redirect to movie detail page
}

// Function to load movies on page load
window.onload = function() {
    // Fetch all movies on initial load
    fetchMovies();

    // Add event listeners for genre buttons
    const genreButtons = document.querySelectorAll('.btn-group button');
    genreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const genreId = this.getAttribute('data-genre-id');
            filterMoviesByGenre(genreId);
        });
    });
};

// Function to load movie details on movieDetail.html
async function loadMovieDetails() {
    const movieId = localStorage.getItem('selectedMovieId');
    if (!movieId) return;

    try {
        const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`;
        const response = await fetch(url);
        const movie = await response.json();
        displayMovieDetails(movie);
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Function to display movie details on movieDetail.html
function displayMovieDetails(movie) {
    document.getElementById('movie-title').innerText = movie.title;
    document.getElementById('movie-genre').innerText = movie.genres.map(g => g.name).join(', ');
    document.getElementById('movie-description').innerText = movie.overview;
    document.getElementById('movie-poster').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    // Load cast images in a Bootstrap grid
    const castImagesContainer = document.getElementById('cast-images');
    castImagesContainer.innerHTML = ''; // Clear previous content

    const row = document.createElement('div');
    row.classList.add('row');

    movie.credits.cast.forEach(cast => {
        const col = document.createElement('div');
        col.classList.add('col-3', 'mb-3'); // Bootstrap column
        const castImage = document.createElement('img');
        castImage.src = `https://image.tmdb.org/t/p/w500${cast.profile_path}`;
        castImage.alt = cast.name;
        castImage.classList.add('img-fluid', 'rounded');
        col.appendChild(castImage);
        row.appendChild(col);
    });

    castImagesContainer.appendChild(row); // Append the row with cast images
}

// Load movie details when the page loads
if (document.title.includes("Movie Detail")) {
    window.onload = loadMovieDetails;
}

document.addEventListener('DOMContentLoaded', () => {
    // Get the search input element
    const searchInput = document.getElementById('search-input');

    // Ensure the element exists before adding an event listener
    if (searchInput) {
        // Add an event listener to capture input changes
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            if (searchTerm) {
                searchMovies(searchTerm); // Call the search function
            } else {
                // Optionally clear the movie list if the search input is empty
                displayMovies([]); // Clear displayed movies
            }
        });
    }
});
