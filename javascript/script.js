let allPokemons = [];
const pokemonContainer = document.querySelector("#pokeContainer");
const pokemonCount = 151;

const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
};

const mainTypes = Object.keys(colors);

async function fetchPokemons() {
    for (let i = 1; i <= pokemonCount; i++) {
        await getPokemon(i);
    }
    createTypeFilters();
}

async function getPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const data = await res.json();

    allPokemons.push(data);
    createPokemonCard(data);
}

function createPokemonCard(pokemon, searchValue = "") {
    const pokemonEl = document.createElement("div");
    pokemonEl.classList.add("pokemon");

    const pokemonTypes = pokemon.types.map(t => t.type.name);
    const type = mainTypes.find(t => pokemonTypes.includes(t));
    const color = colors[type];

    pokemonEl.style.backgroundColor = color;

    const name = highlightText(pokemon.name, searchValue);

    pokemonEl.innerHTML = `
        <div class="img-container">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        </div>
        <div class="info">
            <span class="number">#${pokemon.id}</span>
            <h3 class="name">${name}</h3>
            <small class="type">Type: ${pokemonTypes.join(", ")}</small>
        </div>
    `;

    pokemonContainer.appendChild(pokemonEl);
}

/* ================== BUSCA ================== */

const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");
const typeFiltersContainer = document.getElementById("typeFilters");

let selectedType = "";

function createTypeFilters() {
    const types = new Set();

    allPokemons.forEach(poke => {
        poke.types.forEach(t => types.add(t.type.name));
    });

    typeFiltersContainer.innerHTML = "";

    const allButton = document.createElement("button");
    allButton.textContent = "Todos";
    allButton.onclick = () => {
        selectedType = "";
        filterPokemons();
    };
    typeFiltersContainer.appendChild(allButton);

    types.forEach(type => {
        const btn = document.createElement("button");
        btn.textContent = type;
        btn.onclick = () => {
            selectedType = type;
            filterPokemons();
        };
        typeFiltersContainer.appendChild(btn);
    });
}

function highlightText(text, search) {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
}

function filterPokemons() {
    const searchValue = searchInput.value.toLowerCase();
    pokemonContainer.innerHTML = "";

    const filtered = allPokemons.filter(poke => {
        const name = poke.name.toLowerCase();
        const id = poke.id.toString();
        const types = poke.types.map(t => t.type.name);

        const matchesSearch =
            name.includes(searchValue) ||
            id.includes(searchValue) ||
            types.some(type => type.includes(searchValue));

        const matchesType =
            selectedType === "" ||
            types.includes(selectedType);

        return matchesSearch && matchesType;
    });

    if (filtered.length === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }

    filtered.forEach(poke => createPokemonCard(poke, searchValue));
}

searchInput.addEventListener("input", filterPokemons);

fetchPokemons();