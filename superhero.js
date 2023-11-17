const publicKey = '525e43e0eeb9d7e66968e648c9e53960';
const privateKey = 'c098c63f9c77e4366dda063b3149f9714b730957';

function generateHash(ts) {
    return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

function fetchSuperHero(id, callBack) {
    const ts = new Date().getTime().toString();
    const hash = generateHash(ts);

    let apiUrl = `https://gateway.marvel.com/v1/public/characters/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;


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
            callBack(data.data.results[0]);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        })
}

function displaySuperhero(superhero) {
    const heroInfo = document.querySelector(".hero-info");
    if (superhero.thumbnail && superhero.thumbnail.path) {
        console.log('Superhero Object:', superhero);
        console.log('Comics:', superhero.comics);
        console.log('Events:', superhero.events);
        console.log('Series:', superhero.series);
        console.log('Stories:', superhero.stories);
        heroInfo.innerHTML = `
    <img src="${superhero.thumbnail.path}.${superhero.thumbnail.extension}" alt="${superhero.name}">
       <div class="info">
       <h1>${superhero.name}</h1>
         <ul>
         
           <li class="uniq-info">
             <p>Bio -</p>
             <p>${superhero.description || 'No description available.'}</p>
           </li>
           <li class="uniq-info">
             <p>Comics -</p>
             <ul>
                ${renderList(superhero.comics)}
             </ul>
           </li>
           <li class="uniq-info">
             <p>Events -</p>
             <ul>
             ${renderList(superhero.events)}
          </ul>
           </li>
           <li class="uniq-info">
             <p>Series -</p>
             <ul>
             ${renderList(superhero.series)}
          </ul>
           </li>
           <li class="uniq-info">
             <p>Stories -</p>
             <ul>
             ${renderList(superhero.stories)}
          </ul>
           </li>
         </ul>
       </div>

    
       `
    }

}

function renderList(items) {
    if (items && items.items && Array.isArray(items.items)) {
        return items.items.map(item => `<li>${item.name}</li>`).join('');
    } else {
        return '';
    }
}

const urlParams = new URLSearchParams(window.location.search);
const superheroId = urlParams.get('id');

fetchSuperHero(superheroId, displaySuperhero);