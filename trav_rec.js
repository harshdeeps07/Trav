const searchButton = document.getElementById('searchButton');
const resetButton = document.getElementById('resetButton');
const clearButton = document.getElementById('clearButton');
const searchInput = document.getElementById('search');
const searchResults = document.getElementById('search-results');

searchButton.addEventListener('click', searchFunction);
resetButton.addEventListener('click', resetFunction);
clearButton.addEventListener('click', clearResults);

async function fetchData() {
    const response = await fetch('trav_rec_api.json');
    const data = await response.json();
    return data;
}

function searchFunction() {
    const searchTerm = searchInput.value.toLowerCase();
    searchResults.innerHTML = '';

    fetchData().then(data => {
        let results = [];

        // Handle category-specific searches
        if (searchTerm === 'country' || searchTerm === 'countries') {
            data.countries.forEach(country => {
                results = results.concat(country.cities);
            });
        } else if (searchTerm === 'temple' || searchTerm === 'temples') {
            results = data.temples;
        } else if (searchTerm === 'beach' || searchTerm === 'beaches') {
            results = data.beaches;
        } else {
            // General search within names and descriptions
            data.countries.forEach(country => {
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(searchTerm) || city.description.toLowerCase().includes(searchTerm)) {
                        results.push(city);
                    }
                });
            });

            data.temples.forEach(temple => {
                if (temple.name.toLowerCase().includes(searchTerm) || temple.description.toLowerCase().includes(searchTerm)) {
                    results.push(temple);
                }
            });

            data.beaches.forEach(beach => {
                if (beach.name.toLowerCase().includes(searchTerm) || beach.description.toLowerCase().includes(searchTerm)) {
                    results.push(beach);
                }
            });
        }

        displayResults(results);
    });
}

function resetFunction() {
    searchInput.value = '';
}

function clearResults() {
    searchResults.innerHTML = ''; // Clear the search results
}

function displayResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach(result => {
        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';

        const img = document.createElement('img');
        img.src = result.imageUrl;
        img.alt = result.name;

        const name = document.createElement('h3');
        name.textContent = result.name;

        const description = document.createElement('p');
        description.textContent = result.description;

        resultCard.appendChild(img);
        resultCard.appendChild(name);
        resultCard.appendChild(description);

        searchResults.appendChild(resultCard);
    });
}
