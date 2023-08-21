require('dotenv').config()
const axios = require('axios');
const api_key = process.env.API_GIPHY;

async function giphyApi(monkey) {
    const urlRandom = `https://api.giphy.com/v1/gifs/random?api_key=${api_key}&tag=${monkey}&rating=g`
    try {
        const response = await axios.get(urlRandom);
        if (response.data.data.images) {
            const data = response.data.data.images.original; // Accede a la matriz de gifs en la respuesta
            const mp4Url = data.mp4.toString();
            console.log(mp4Url);
            const ismonkey = false
            return {mp4Url, ismonkey};
        } else {
            const urlRandom = `https://api.giphy.com/v1/gifs/random?api_key=${api_key}&tag=monkey&rating=g`
            const response = await axios.get(urlRandom);
            const data = response.data.data.images.original; // Accede a la matriz de gifs en la respuesta
            const mp4Url = data.mp4.toString()
            console.log(mp4Url);
            const ismonkey = true
            return {mp4Url, ismonkey};
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = { giphyApi }
