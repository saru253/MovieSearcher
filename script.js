
/**
 * Movie Filter Tool
 * By Sarthak Shinde
 * Replace YOUR_TMDB_API_KEY with your TMDb API key.
 */
const API_KEY = 'YOUR_TMDB_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const REGION = 'IN';

const genreSelect = document.getElementById('genreSelect');
const platformSelect = document.getElementById('platformSelect');
const searchBtn = document.getElementById('searchBtn');
const resultsSection = document.getElementById('results');

async function fetchGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-IN`);
  const data = await res.json();
  data.genres.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g.id;
    opt.textContent = g.name;
    genreSelect.appendChild(opt);
  });
}

async function getActorId(name) {
  if (!name) return null;
  const res = await fetch(`${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(name)}&region=${REGION}`);
  const data = await res.json();
  return data.results && data.results.length ? data.results[0].id : null;
}

function movieCard(movie) {
  return `
    <div class="bg-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
      <img src="${movie.poster_path ? IMG_BASE + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}" alt="${movie.title}" class="w-full h-80 object-cover">
      <div class="p-4 flex-grow flex flex-col">
        <h2 class="text-lg font-bold mb-1">${movie.title}</h2>
        <p class="text-sm text-gray-400 mb-2">⭐ ${movie.vote_average}</p>
        <a href="https://www.justwatch.com/in/movie/${movie.id}" target="_blank"
           class="mt-auto bg-blue-600 hover:bg-blue-700 text-center py-1 rounded">Watch Options</a>
      </div>
    </div>
  `;
}

async function searchMovies() {
  resultsSection.innerHTML = '<p class="col-span-full text-center">Loading...</p>';
  const actorName = document.getElementById('actorInput').value.trim();
  const genreId = genreSelect.value;
  const year = document.getElementById('yearInput').value.trim();
  const platformId = platformSelect.value;

  let withCast = '';
  if (actorName) {
    const actorId = await getActorId(actorName);
    if (actorId) withCast = `&with_cast=${actorId}`;
  }

  const discoverURL = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-IN&region=${REGION}&sort_by=popularity.desc${genreId ? `&with_genres=${genreId}` : ''}${year ? `&primary_release_year=${year}` : ''}${platformId ? `&with_watch_providers=${platformId}&watch_region=${REGION}` : ''}${withCast}`;

  const res = await fetch(discoverURL);
  const data = await res.json();

  if (!data.results || !data.results.length) {
    resultsSection.innerHTML = '<p class="col-span-full text-center">No movies found. Try changing filters.</p>';
    return;
  }

  resultsSection.innerHTML = data.results.map(movieCard).join('');
}

searchBtn.addEventListener('click', searchMovies);
fetchGenres();
