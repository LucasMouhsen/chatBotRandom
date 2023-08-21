const axios = require('axios');


async function traerPokemon() {
    try {
        const random = Math.floor(Math.random() * (151 - 1 + 1) + 1);
        const urlApi = `https://pokeapi.co/api/v2/pokemon/${random}`

        const response = await axios.get(urlApi);
        const data = response.data;
        const nombre = data.name;
        const url = data.sprites.other.home.front_default;
        console.log(url);
        return { nombre, url };
    } catch (error) {
        console.error("Error al obtener los datos del Pokemon:", error);
    }
}



module.exports = { traerPokemon };
