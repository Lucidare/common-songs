import axios from 'axios';

const baseURL = 'https://api.spotify.com/v1/'

const SpotifyAPI = {
    getMe: (token) => axios.get(baseURL + "me", { headers: { Authorization: 'Bearer ' + token } }),
    getPlaylists: (token) => axios.get(baseURL + "me/playlists", { headers: { Authorization: 'Bearer ' + token } }),
    getLikedSongs: (token, offset = 0, limit = 20) => axios.get(baseURL + "me/tracks?offset=" + offset + "&limit=" + limit, { headers: { Authorization: 'Bearer ' + token } }),
}

export default SpotifyAPI;