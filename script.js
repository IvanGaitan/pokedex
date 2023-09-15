const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const URL = "https://pokeapi.co/api/v2/pokemon/";
const Pokemon_number = 151;
const search = document.getElementById('search');
const form = document.getElementById("form");

// Función para buscar Pokémon por nombre
function buscarPokemonPorNombre() {
  const searchTerm = search.value.toLowerCase();
  listaPokemon.innerHTML = "";

  for (let i = 1; i <= Pokemon_number; i++) {
    fetch(URL + i)
      .then((response) => response.json())
      .then((data) => {
        const pokemonNombre = data.name.toLowerCase();
        if (pokemonNombre.includes(searchTerm)) {
          mostrarPokemon(data);
        }
      });
  }
}

// Agrega un evento al formulario para la búsqueda
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Evita que se recargue la página al enviar el formulario
  buscarPokemonPorNombre();
});

// Función para mostrar detalles en un modal y la información básica del Pokémon
function mostrarPokemon(poke) {
  let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
  tipos = tipos.join('');

  let pokeId = poke.id.toString();
  if (pokeId.length === 1) {
    pokeId = "00" + pokeId;
  } else if (pokeId.length === 2) {
    pokeId = "0" + pokeId;
  }

  const div = document.createElement("div");
  div.classList.add("pokemon");
  div.innerHTML = `
      <p class="pokemon-id-back">#${pokeId}</p>
      <div class="pokemon-images">
          <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
      </div>
      <div class="pokemon-info">
          <div class="nombre-contenedor">
              <p class="pokemon-id">#${pokeId}</p>
              <h2 class="pokemon-nombre">${poke.name}</h2>
          </div>
          <div class="pokemon-tipos">
              ${tipos}
          </div>
          <div class="pokemon-stats">
              <p class="stat">${poke.height}m</p>
              <p class="stat">${poke.weight}kg</p>
          </div>
          <button class="btn btn-primary" onclick="mostrarDetallesEnModal(${poke.id})">Ver detalles</button>
      </div>
  `;
  listaPokemon.appendChild(div);
}

// Función para mostrar detalles en un modal
function mostrarDetallesEnModal(pokemonId) {
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = "";

  fetch(URL + pokemonId)
    .then((response) => response.json())
    .then((data) => {
      // Agrega información adicional al modal (por ejemplo, peso, movimientos, etc.)
      modalBody.innerHTML += `<p>Peso: ${data.weight / 10} kg</p>`; // Divide por 10 para convertir a kg
      modalBody.innerHTML += "<p>Movimientos:</p>";
      const movimientos = data.moves.map((move) => move.move.name);
      for (const movimiento of movimientos) {
        modalBody.innerHTML += `<p>${movimiento}</p>`;
      }

      // Abre el modal utilizando Bootstrap
      const modal = new bootstrap.Modal(document.querySelector("#modalPokemon"));
      modal.show();
    });
}

// Agrega eventos a los botones en el encabezado para filtrar Pokémon por tipo
botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
  const botonId = event.currentTarget.id;
  listaPokemon.innerHTML = ""; // Limpia la lista de Pokémon

  for (let i = 1; i <= Pokemon_number; i++) {
    fetch(URL + i)
      .then((response) => response.json())
      .then(data => {
        if (botonId === "ver-todos") {
          mostrarPokemon(data);
        } else {
          const tipos = data.types.map(type => type.type.name);
          if (tipos.includes(botonId)) { // Comprueba si el tipo del Pokémon coincide con el botón
            mostrarPokemon(data);
          }
        }
      });
  }
}));
