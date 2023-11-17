const searchBtn = document.querySelector(".search-btn");

const publicKey = '525e43e0eeb9d7e66968e648c9e53960';
const privateKey = 'c098c63f9c77e4366dda063b3149f9714b730957';

function generateHash(ts) {
    return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

function fetchSuperHero(name, callBack) {
    const ts = new Date().getTime().toString();
    const hash = generateHash(ts);

    let apiUrl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    if (name) {
        apiUrl += `&nameStartsWith=${name}`;
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API response:', data);
            const result = data.data.results;
            console.log(result);
            callBack(data.data.results);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        })
}

function displayResults(results) {
    const heroList = document.querySelector(".grid");
    heroList.innerHTML = "";

    results.forEach(hero => {
        const gridItem = document.createElement("div");
        gridItem.className = "grid-item";
        gridItem.innerHTML = `
        <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}">
        <p class="name">${hero.name}</p>
        <a href="superhero.html?id=${hero.id}" target="_blank">Details</a>
        <button class="fav-btn" onclick="addToFavorites(${JSON.stringify(hero)})">F</button>
        `
        heroList.appendChild(gridItem);
    })
}

function loadDefaultHeros() {
    fetchSuperHero('', displayResults);
}

loadDefaultHeros();

function searchSuperhero() {
    const heroName = document.querySelector("#heroName").value.trim();
    if (!heroName) {
        loadDefaultHeros();
    } else {
        fetchSuperHero(heroName, displayResults);
    }
}

searchBtn.addEventListener('click', searchSuperhero);



// add to favorite

// Add this function to your existing code



