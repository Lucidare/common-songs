import React, { useState, useEffect } from 'react';
import { Container, Row, Button } from 'reactstrap';
import User from './components/User';
import Playlists from './components/Playlists';
import SongList from './components/SongList';
import Input from './components/Input';
import Coffee from './components/BuyMeACoffee';
import Spotify from './networking/SpotifyAPI';
import spotify_logo from './spotify-icons-logos/logos/01_RGB/02_PNG/Spotify_Logo_RGB_White.png'
import './App.css';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-147243437-1');

var spotifyApi = new Spotify();

function App() {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  
  const [input, setInput] = useState("");

  const [userPlaylists, setUserPlaylists] = useState([]);

  const [playlistName, setPlaylistName] = useState("");
  const [common, setCommon] = useState([]);
  const likedSongsStates = {
    NOT_APPLICIABLE: "",
    LOADING: "Retrieving your liked songs...",
    FAILED: "Unable to get your liked songs, please log in again",
    COMPLETE: "Retrieved"
  }
  const [likedSongsState, setLikedSongState]  = useState(likedSongsStates.NOT_APPLICIABLE);

  const otherSongsState= {
    NOT_APPLICIABLE: "",
    INVALID: "INVALID INPUT",
    LOADING: "Getting Songs...",
    ERROR: "Unable to get songs, please try again later",
    COMPARING: "Finding Common Songs...",
    COMPLETE: "Common Songs Found"
  }
  const [songsState, setSongsState] = useState(input.NOT_APPLICIABLE);
  const newPlaylistStates= {
    NOT_APPLICIABLE: "",
    CREATING: "Creating Playlist...",
    ADDING: "Adding Songs...",
    ERROR: "Internal Server Error, please try again later (Some songs may be missing from playlist)"
  }
  const [newPlaylistState, setNewPlaylistState] = useState(newPlaylistStates.NOT_APPLICIABLE);

  document.title = "Common Songs"

  useEffect(() => {
    var token = localStorage.getItem("token");
    if (token == null) {
      token = new URLSearchParams(window.location.search).get('access_token');
      window.history.replaceState(null, null, window.location.pathname);
    }

    if (token != null) {
      localStorage.setItem("token", token);

      spotifyApi.setToken(token);
      
      spotifyApi.getMe().then((response) => {
        setUser(response.data);
        spotifyApi.setUserId(response.data.id);
      }).catch((error) => {
        console.log(error);
      });

      spotifyApi.getPlaylists().then((response) => {
        setPlaylists(response.data.items);
      }).catch((error) => {
        console.log(error);
      });

      const getLikedSongs = (offset = 0, songs = []) => {
        const NUM_SONGS  = 50;
        var newSongs = songs;
        spotifyApi.getLikedSongs(offset, NUM_SONGS).then((response) => {
          const data = response.data;
          
          const items = response.data.items.map(obj => {
            return obj.track;
          });

          newSongs = [...newSongs, ...items];
          if (data.next != null) {
            getLikedSongs(offset + NUM_SONGS, newSongs);
          } else {
            setLikedSongs(newSongs);
            setLikedSongState(likedSongsStates.COMPLETE);
          }
        }).catch((error) => {
          setLikedSongState(likedSongsStates.FAILED);
          localStorage.removeItem("token");
          console.log(error);
        });
      }
      setLikedSongState(likedSongsStates.LOADING);
      getLikedSongs();
    }
  }, [likedSongsStates.FAILED, likedSongsStates.COMPLETE, likedSongsStates.LOADING]);

  function login() {
    window.location = window.location.href.includes('localhost')
      ? 'http://localhost:8888/login'
      : 'https://common-songs-auth.herokuapp.com/login'
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    setPlaylists([]);
    setLikedSongs([]);
    setLikedSongState(likedSongsStates.NOT_APPLICIABLE);
    setSongsState(otherSongsState.NOT_APPLICIABLE);
    setCommon([]);
    setNewPlaylistState(newPlaylistStates.NOT_APPLICIABLE);
  }

  function readInput() {
    var split = input.trim().split(":");
    var isPlaylist = true;
    var id = "";
    if (split.length !== 3) {
      split = input.trim().split("/");
      if (split.length === 5 && split[0] === "https:" && split[1] === "" && split[2] === "open.spotify.com") {
        if (split[3] === "playlist" || split[3] === "user") {
          split = split[4].split("?")
          isPlaylist = split[3] === "playlist"
          if (split.length > 0 && split.length <= 2) {
            id = split[0];
          } else {
            setSongsState(otherSongsState.INVALID);
          }
        } else {
          setSongsState(otherSongsState.INVALID);
        }
      } else {
        setSongsState(otherSongsState.INVALID);
      }
    } else {
      if (split[0] === "spotify") {
        if (split[1] === "playlist" || split[1] === "user") {
          isPlaylist = split[1] === "playlist"
          id = split[2]
        } else {
          setSongsState(otherSongsState.INVALID);
        }
      } else {
        setSongsState(otherSongsState.INVALID);
      }
    }

    if (id !== "") {
      if (isPlaylist) {
        getSongsFromPlaylist(id);
      } else {
        // getUsersPlaylists(id);
      }
    }

  }

  function getSongsFromPlaylist(id) {
    setCommon([]);
    setSongsState(otherSongsState.LOADING);

    getPlaylistSongs(id);
    getPlaylist(id);
  }

  function getPlaylist(id) {
    spotifyApi.getPlaylist(id).then((response) => {
      setPlaylistName(response.data.name);
    }).catch((error) =>{
      console.log(error);
    });
  }

  function getPlaylistSongs(id, offset = 0, oldSongs = []) {
    const NUM_SONGS  = 100;
    spotifyApi.getPlaylistSongs(id, offset).then((response) => {
      const data = response.data;
      const items = response.data.items.map(obj => {
        return obj.track;
      });
      const newSongs = [...oldSongs, ...items]
      if (data.next != null) {
        getPlaylistSongs(id, offset + NUM_SONGS, newSongs);
      } else {
        setSongsState(otherSongsState.COMPARING)
        findCommonSongs(newSongs)
      }
    }).catch((error) => {
      setSongsState(otherSongsState.ERROR);
      console.log(error);
    });
  }

  function findCommonSongs(list) {
    let intersect = [...likedSongs].filter(song => contains(list, song));
    setCommon(intersect);
    setSongsState(otherSongsState.COMPLETE)
  }

  function contains(list, obj) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === obj.id) {
        return true;
      }
    }
    return false;
  }

  function makeNewPlaylist() {
    setNewPlaylistState(newPlaylistStates.CREATING);
    spotifyApi.createPlaylist(playlistName).then((response) => {
      const data = response.data;
      const id = data.id;
      setNewPlaylistState(newPlaylistStates.ADDING);
      addAllSongsToNewPlaylist(id);
    }).catch((error) => {
      console.log(error);
    });
  }

  function addAllSongsToNewPlaylist(id) {
    var i,j,chunk = 100;
    var uris = common.map(track => {
      return track.uri;
    })
    var numCallsNeeded = (uris.length/100)|0;
    var numCallsCompleted = 0;
    var numCallsFailed = 0;
    for (i=0,j=uris.length; i<j; i+=chunk) {
      spotifyApi.addToPlaylist(id, uris.slice(i,i+chunk)).then((response) => {
        if (numCallsCompleted === numCallsNeeded && numCallsFailed === 0) {
          setNewPlaylistState("https://open.spotify.com/playlist/" + id);
        }
      }).catch((error) => {
        setNewPlaylistState(newPlaylistStates.ERROR + " https://open.spotify.com/playlist/" + id);
        console.log(error);
        numCallsFailed += 1;
      }).finally(() => {
        numCallsCompleted += 1;
      });
    }
  }

  return (
    <Container className="container">
      <Row className="center">
        <h1 className="title">Common Songs</h1>
        <p className="subtitle">Find what songs you have in common</p>
        {user != null &&
          <User name={user.display_name} images={user.images}/>
        }
        {likedSongsState !== likedSongsStates.NOT_APPLICIABLE &&
          <p className="text">Liked Songs: {likedSongsState}</p>
        }
        {likedSongsState === likedSongsStates.COMPLETE && 
          <Input input={input} setInput={setInput} validateInput={readInput}/>
        }

        {userPlaylists.length > 0 &&
          <div>User playlists</div>
        }

        <p className="subtitle">{songsState}</p>
        {songsState === otherSongsState.COMPLETE &&
          <p className="text">Total: {common.length ?? 0}</p>
        }
        
        {common.length > 0 &&
          <SongList makeNewPlaylist={makeNewPlaylist} songs={common}/>
        }

        {newPlaylistState !== newPlaylistStates.NOT_APPLICIABLE &&
          <p className="text">{newPlaylistState}</p>
        }

        <div>
          {localStorage.getItem("token") == null 
            ? <Button className="greenBtn" onClick={login}>
                <img className="spotifyLogo" alt="spotify_logo" src={spotify_logo}/>
              </Button>
            : <Button className="greenBtn" onClick={logout}>LOG OUT</Button>
          }
        </div>
        <p className="text">© Brian Au 2020</p>
        <Coffee/>
      </Row>
    </Container>
  );
}

export default App;
