import axios from 'axios';

const baseURL = 'https://api.spotify.com/v1/'

var Spotify = (function () {
    var _token = null;
    var _userId = null;

    this.setToken = (token) => {
        _token = token;
    };

    this.setUserId = (id) => {
        _userId = id;
    };

    this.getMe = () => {
        return axios.get(baseURL + "me", { headers: { Authorization: 'Bearer ' + _token } });
    }

    this.getMyPlaylists = () => {
        return axios.get(baseURL + "me/playlists?market=from_token", { headers: { Authorization: 'Bearer ' + _token } });
    }

    this.getLikedSongs = (offset = 0, limit = 20) => {
        return axios.get(baseURL + "me/tracks?market=from_token&offset=" + offset + "&limit=" + limit, { headers: { Authorization: 'Bearer ' + _token } });
    }

    this.getPlaylistSongs = (id, offset = 0, limit = 100) => {
        return axios.get(baseURL + "playlists/" + id + "/tracks?market=from_token&offset=" + offset + "&limit=" + limit, { headers: { Authorization: 'Bearer ' + _token } });
    }
    
    this.getPlaylistInfo = (id) => {
        return axios.get(baseURL + "playlists/" + id, { headers: { Authorization: 'Bearer ' + _token } });
    }

    this.getUser = (id) => {
        return axios.get(baseURL + "users/" + id, { headers: { Authorization: 'Bearer ' + _token } });
    }

    this.getPlaylists = (id, offset = 0, limit = 20) => {
        return axios.get(baseURL + "users/" + id + "/playlists?offset=" + offset + "&limit=" + limit, { headers: { Authorization: 'Bearer ' + _token } });
    }

    this.createPlaylist = (name) => {
        return axios.post(baseURL + "users/" + _userId + "/playlists", {
            name: "Common Songs - " + name,
            description: "Created by https://common-songs.com"
        } ,{
            headers: {
                Authorization: 'Bearer ' + _token,
                Accept: 'application.json'
            },
            
        });
    }

    this.addToPlaylist = (id, songs) => {
        return axios.post(baseURL + "playlists/" + id + "/tracks", {
            uris: songs
        } ,{
            headers: {
                Authorization: 'Bearer ' + _token,
                Accept: 'application.json'
            },
            
        });
    }
})

export default Spotify;