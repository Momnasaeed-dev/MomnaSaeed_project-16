// ================================
// Select Elements
// ================================

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const error = document.getElementById("error");

const movieContainer = document.getElementById("movieContainer");
const bookmarkContainer = document.getElementById("bookmarkContainer");

const bookmarkSearch = document.getElementById("bookmarkSearch");
const clearAllBtn = document.getElementById("clearAllBtn");

// ================================
// Local Storage
// ================================

let bookmarks =
JSON.parse(localStorage.getItem("bookmarks")) || [];

// ================================
// Search Form
// ================================

searchForm.addEventListener("submit", function(e){

e.preventDefault();

const query = searchInput.value.trim();

if(query===""){

error.style.display="block";
return;

}

error.style.display="none";

fetchMovies(query);

});

// ================================
// Fetch Movies
// ================================

async function fetchMovies(query){

movieContainer.innerHTML=`

<div class="loading">

<div class="spinner"></div>

<p>Searching Movies...</p>

</div>

`;

try{

const response = await fetch(

`https://api.tvmaze.com/search/shows?q=${query}`

);

if(!response.ok){

throw new Error("Network Error");

}

const data = await response.json();

displayMovies(data);

}

catch(error){

movieContainer.innerHTML=`

<div class="empty">

<h2>Something went wrong!</h2>

</div>

`;

console.log(error);

}

}

// ================================
// Display Movies
// ================================

function displayMovies(data){

if(data.length===0){

movieContainer.innerHTML=`

<div class="empty">

<h2>No Movies Found 😔</h2>

</div>

`;

return;

}

const html = data

.filter(movie=>movie.show.image)

.map(movie=>`

<div class="card">

<img src="${movie.show.image.medium}">

<div class="card-content">

<h3>${movie.show.name}</h3>

<p><b>Language:</b> ${movie.show.language}</p>

<p><b>Type:</b> ${movie.show.type}</p>

<p><b>Rating:</b> ${movie.show.rating.average || "N/A"}</p>

<button onclick='addBookmark(${JSON.stringify(movie.show)})'>

⭐ Bookmark

</button>

</div>

</div>

`).join("");

movieContainer.innerHTML = html;

}

// ================================
// Add Bookmark
// ================================

function addBookmark(movie){

const exists = bookmarks.find(item=>item.id===movie.id);

if(exists){

alert("Movie already bookmarked!");

return;

}

bookmarks.push(movie);

localStorage.setItem(

"bookmarks",

JSON.stringify(bookmarks)

);

displayBookmarks();

alert("Movie added successfully!");

}// ================================
// Display Bookmarks
// ================================

function displayBookmarks(list = bookmarks) {

    if (list.length === 0) {

        bookmarkContainer.innerHTML = `

        <div class="empty">

            <h2>No Bookmarks Yet ⭐</h2>

            <p>Bookmark your favorite movies to see them here.</p>

        </div>

        `;

        return;
    }

    const html = list.map(movie => `

        <div class="card">

            <img src="${movie.image.medium}" alt="${movie.name}">

            <div class="card-content">

                <h3>${movie.name}</h3>

                <p><b>Language:</b> ${movie.language}</p>

                <p><b>Type:</b> ${movie.type}</p>

                <p><b>Rating:</b> ${movie.rating.average || "N/A"}</p>

                <button onclick="removeBookmark(${movie.id})">

                    ❌ Remove

                </button>

            </div>

        </div>

    `).join("");

    bookmarkContainer.innerHTML = html;

}

// ================================
// Remove Bookmark
// ================================

function removeBookmark(id) {

    bookmarks = bookmarks.filter(movie => movie.id !== id);

    localStorage.setItem(

        "bookmarks",

        JSON.stringify(bookmarks)

    );

    displayBookmarks();

}

// ================================
// Clear All Bookmarks
// ================================

clearAllBtn.addEventListener("click", () => {

    if (bookmarks.length === 0) {

        alert("No bookmarks available!");

        return;

    }

    const confirmDelete = confirm(

        "Are you sure you want to remove all bookmarks?"

    );

    if (!confirmDelete) return;

    bookmarks = [];

    localStorage.removeItem("bookmarks");

    displayBookmarks();

});

// ================================
// Live Bookmark Search
// ================================

bookmarkSearch.addEventListener("input", function () {

    const keyword = this.value.toLowerCase().trim();

    const filtered = bookmarks.filter(movie =>

        movie.name.toLowerCase().includes(keyword)

    );

    displayBookmarks(filtered);

});

// ================================
// Load Bookmarks Automatically
// ================================

window.addEventListener("DOMContentLoaded", () => {

    displayBookmarks();

});