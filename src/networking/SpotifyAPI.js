import axios from 'axios';

const baseURL = 'https://api.spotify.com/v1/'

var Spotify = (function () {
    var _token = null;
    var _market = "";

    this.setToken = (token) => {
        _token = token;
    };

    this.setMarket = (market) => {
        _market = market
    }

    this.getMe = () => {
        return axios.get(baseURL + "me", { headers: { Authorization: 'Bearer ' + _token } });
    }

    this.getPlaylists = () => {
        return axios.get(baseURL + "me/playlists?market=from_token", { headers: { Authorization: 'Bearer ' + _token } });
    }

    this.getLikedSongs = (offset = 0, limit = 20) => {
        return axios.get(baseURL + "me/tracks?market=from_token&offset=" + offset + "&limit=" + limit, { headers: { Authorization: 'Bearer ' + _token } });
    }

    this.getPlaylist = (id, offset = 0, limit = 100) => {
        return axios.get(baseURL + "playlists/" + id + "/tracks?market=from_token&offset=" + offset + "&limit=" + limit, { headers: { Authorization: 'Bearer ' + _token } });
    }
})

export default Spotify;