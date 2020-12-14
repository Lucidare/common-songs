import axios from 'axios';

const baseURL = 'https://api.spotify.com/v1/'

const SpotifyAPI = {
    getMe: (token) => axios.get(baseURL + "me", { headers: { Authorization: 'Bearer ' + token } }),
    getPlaylists: (token) => axios.get(baseURL + "me/playlists", { headers: { Authorization: 'Bearer ' + token } }),
    // createContact: (contact) => axios.post(baseURL, contact),
    // getContact: (id) => axios.get(baseURL + "/" + id),
    // updateContact: (contact) => axios.put(baseURL + "/" + contact.id, contact),
    // deleteContact: (id) => axios.delete(baseURL + "/" + id)
}

export default SpotifyAPI;