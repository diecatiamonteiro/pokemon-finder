// ************************************************************************* Variables

const allNames = document.querySelector(".all-names");
const input = document.getElementById("search");
const button = document.getElementById("button");
const cardDiv = document.querySelector(".card");
const spinner = document.getElementById("spinner");

let pokemonNames = [];

// ************************************************************************* Fetch Pokémon names

// Fetches and stores all Pokémon names for autocomplete.
function fetchAllPokemonNames() {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=1302")
    .then((response) => response.json())
    .then((data) => {
      pokemonNames = data.results.map((pokemon) => pokemon.name);
    })
    .catch((error) => console.error("Error fetching Pokémon names", error));
}

// ************************************************************************* Search autocomplete

// Shows suggestions as the user types and allows selection.
function autoComplete() {
  input.addEventListener("focus", function () {
    input.value = ""; // Clear the input value when focused
    allNames.innerHTML = ""; // Clear previous suggestions
    allNames.style.display = "none"; // Hide suggestions initially
  });

  input.addEventListener("input", function () {
    allNames.innerHTML = ""; // Clear previous suggestions

    const userInput = input.value.toLowerCase().trim();

    if (userInput.length === 0) {
      allNames.style.display = "none"; // Hide if no input
      return;
    }

    // Filter and sort Pokémon names based on input
    const filteredNames = pokemonNames
      .filter((name) => name.startsWith(userInput))
      .sort(); // alphabetically

    // Display all filtered names
    filteredNames.forEach((name) => {
      const suggestion = document.createElement("div");
      suggestion.textContent = name;
      suggestion.classList.add("suggestion");

      // Handle click to auto-fill the input
      suggestion.addEventListener("click", function () {
        input.value = name;
        allNames.style.display = "none"; // Hide suggestions when a name is clicked
      });

      allNames.appendChild(suggestion);
    });

    allNames.style.display = "block"; // Ensure suggestions are shown when input is provided
  });

  // Hide suggestions when clicking outside the input or suggestion list
  document.addEventListener("click", function (event) {
    if (!input.contains(event.target) && !allNames.contains(event.target)) {
      allNames.style.display = "none"; // Hide all names if clicking outside
    }
  });
}

// ************************************************************************* Search Pokémon

// Fetches and displays Pokémon details based on the input name.
function searchPokemon() {
  cardDiv.style.display = "none"; // Hide previous card
  const pokemonName = input.value.toLowerCase().trim();

  if (pokemonName === "") {
    alert("Please enter a Pokémon name.");
    return;
  }

  spinner.style.display = "block"; // Show the loading spinner

  // Fetch Pokémon data
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Pokémon not found.");
      }
      return response.json();
    })
    .then((data) => {
      // Call the displayCard function here to display the card
      displayCard(data);
      input.value = ""; // Clear input field
    })
    .catch((error) => {
      spinner.style.display = "none"; // Hide spinner
      setTimeout(() => {
        alert(error.message); // Show error message
      }, 100);
      input.value = ""; // Clear input field
    })
    .finally(() => {
      spinner.style.display = "none"; // Hide the spinner when done
    });
}

// ************************************************************************* Display card

// Updates the card with the Pokémon's name, image, stats, and abilities.
function displayCard(pokemon) {
  cardDiv.style.display = "block";

  // h2
  const h2 = document.querySelector("#name");
  const pokemonCardName = pokemon.name.toUpperCase();
  h2.textContent = pokemonCardName;

  // icon
  const icon = document.querySelector("#icon");
  icon.src = pokemon.sprites.front_default;

  // stats
  const statsListUl = document.getElementById("stats-list");
  statsListUl.innerHTML = ""; // clear previous stats

  pokemon.stats.forEach((stat) => {
    const statLi = document.createElement("li");
    statLi.textContent = stat.stat.name;

    const baseStatSpan = document.createElement("span");
    baseStatSpan.textContent = stat.base_stat;

    statLi.appendChild(baseStatSpan);
    statsListUl.appendChild(statLi);
  });

  // abilities
  const abilitiesListUl = document.getElementById("abilities-list");
  abilitiesListUl.innerHTML = ""; // clear previous abilities

  pokemon.abilities.forEach((ability) => {
    const abilityLi = document.createElement("li");
    abilityLi.textContent = ability.ability.name;
    abilitiesListUl.appendChild(abilityLi);
  });
}

// ************************************************************************* Event listeners

// Handles search on page load, button click, and Enter key press.

document.addEventListener("DOMContentLoaded", function () {
  fetchAllPokemonNames();
  autoComplete();
});

button.addEventListener("click", searchPokemon);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchPokemon();
  }
});
