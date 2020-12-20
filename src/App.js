import React, { useState, useEffect } from 'react';
import { Container, Row, Button } from 'reactstrap';
import User from './components/User';
import Playlists from './components/Playlists';
import SongList from './components/SongList';
import Input from './components/Input';
import Coffee from './components/BuyMeACoffee';
import Spotify from './networking/SpotifyAPI';
import spotify_logo from './imgs/spotify-icons-logos/logos/01_RGB/02_PNG/Spotify_Logo_RGB_White.png'
import './App.css';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-147243437-1');

var spotifyApi = new Spotify();

function App() {
  const [user, setUser] = useState(null);
  // const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  
  const [input, setInput] = useState("");

  const [searchUser, setSearchUser] = useState(null);
  const [searchUserPlaylists, setSearchUserPlaylists] = useState([]);

  const [playlistName, setPlaylistName] = useState("");
  const [common, setCommon] = useState([]);

  const firstSongsStates = {
    NOT_APPLICIABLE: "",
    LOADING: "Retrieving your liked songs...",
    FAILED: "Unable to get your liked songs, please log in again",
    COMPLETE: "Retrieved"
  }
  const [firstSongsState, setFirstSongsState]  = useState(firstSongsStates.NOT_APPLICIABLE);

  const otherSongsStates= {
    NOT_APPLICIABLE: "",
    INVALID: "INVALID INPUT",
    LOADING: "Getting Songs...",
    ERROR: "Unable to get playlists/songs, please try again later",
    NO_PLAYLIST: "No public playlists found",
    COMPARING: "Finding Common Songs...",
    COMPLETE: "Common Songs Found"
  }
  const [otherSongsState, setOtherSongsState] = useState(input.NOT_APPLICIABLE);

  const newPlaylistStates= {
    NOT_APPLICIABLE: "",
    CREATING: "Creating Playlist...",
    ADDING: "Adding Songs...",
    ERROR: "Internal Server Error, please try again later (Some songs may be missing from playlist)"
  }
  const [newPlaylistState, setNewPlaylistState] = useState(newPlaylistStates.NOT_APPLICIABLE);

  document.title = "Common Songs"

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token == null) {
      token = new URLSearchParams(window.location.search).get('access_token');
    }
    window.history.replaceState(null, null, window.location.pathname);

    if (token != null) {
      localStorage.setItem("token", token);

      spotifyApi.setToken(token);
      
      spotifyApi.getMe().then((response) => {
        setUser(response.data);
        spotifyApi.setUserId(response.data.id);
      }).catch((error) => {
        console.log(error);
      });

      // spotifyApi.getMyPlaylists().then((response) => {
      //   setPlaylists(response.data.items);
      // }).catch((error) => {
      //   console.log(error);
      // });

      const getLikedSongs = (offset = 0, songs = []) => {
        const NUM_SONGS  = 50;
        let newSongs = songs;
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
            setFirstSongsState(firstSongsStates.COMPLETE);
          }
        }).catch((error) => {
          setFirstSongsState(firstSongsStates.FAILED);
          localStorage.removeItem("token");
          console.log(error);
        });
      }
      setFirstSongsState(firstSongsStates.LOADING);
      getLikedSongs();
    }
  }, [firstSongsStates.FAILED, firstSongsStates.COMPLETE, firstSongsStates.LOADING]);

  function login() {
    window.location = window.location.href.includes('localhost')
      ? 'http://localhost:8888/login'
      : 'https://common-songs-auth.herokuapp.com/login'
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    // setPlaylists([]);
    setLikedSongs([]);
    setFirstSongsState(firstSongsStates.NOT_APPLICIABLE);
    setOtherSongsState(otherSongsStates.NOT_APPLICIABLE);
    setSearchUserPlaylists([]);
    setCommon([]);
    setNewPlaylistState(newPlaylistStates.NOT_APPLICIABLE);
  }

  function readInput() {
    let id = "";
    if (!input.includes(":") && !input.includes("/")) {
      id = input;
    } else {
      let split = input.trim().split(":");
      var isPlaylist = true;
      if (split.length !== 3) {
        split = input.trim().split("/");
        if (split.length === 5 && split[0] === "https:" && split[1] === "" && split[2] === "open.spotify.com") {
          if (split[3] === "playlist" || split[3] === "user") {
            split = split[4].split("?")
            isPlaylist = split[3] === "playlist"
            if (split.length > 0 && split.length <= 2) {
              id = split[0];
            } else {
              setOtherSongsState(otherSongsStates.INVALID);
            }
          } else {
            setOtherSongsState(otherSongsStates.INVALID);
          }
        } else {
          setOtherSongsState(otherSongsStates.INVALID);
        }
      } else {
        if (split[0] === "spotify") {
          if (split[1] === "playlist" || split[1] === "user") {
            isPlaylist = split[1] === "playlist"
            id = split[2]
          } else {
            setOtherSongsState(otherSongsStates.INVALID);
          }
        } else {
          setOtherSongsState(otherSongsStates.INVALID);
        }
      }
    }

    if (id !== "") {
      if (isPlaylist) {
        getSongsFromPlaylist(id);
      } else {
        setOtherSongsState(otherSongsStates.NOT_APPLICIABLE);
        getUsersPlaylists(id);
      }
    }

  }

  function getSongsFromPlaylist(id) {
    setCommon([]);
    setOtherSongsState(otherSongsStates.LOADING);

    getPlaylistSongs(id);
    getPlaylistName(id);
  }

  function getUsersPlaylists(id) {
    spotifyApi.getUser(id).then((response) => {
      setSearchUser(response.data);
    }).catch((error => {
      console.log(error);
    }));

    spotifyApi.getPlaylists(id).then((response) => {
      setSearchUserPlaylists(response.data.items);
      if (response.data.items.length === 0) {
        setOtherSongsState(otherSongsStates.NO_PLAYLIST);
      }
    }).catch((error => {
      setSearchUserPlaylists([]);
      setOtherSongsState(otherSongsStates.ERROR);
      setCommon([]);
      console.log(error);
    }));
  }

  function getPlaylistName(id) {
    spotifyApi.getPlaylistInfo(id).then((response) => {
      setPlaylistName(response.data.name);
    }).catch((error) => {
      console.log(error);
    });
  }

  function getPlaylistSongs(id, offset = 0, oldSongs = []) {
    const NUM_SONGS  = 100;
    spotifyApi.getPlaylistSongs(id, offset).then((response) => {
      const data = response.data;
      const items = response.data.items.map(obj => {
        return obj.track;
      }).filter(n => n);
      const newSongs = [...oldSongs, ...items]
      if (data.next != null) {
        getPlaylistSongs(id, offset + NUM_SONGS, newSongs);
      } else {
        setOtherSongsState(otherSongsStates.COMPARING)
        findCommonSongs(newSongs)
      }
    }).catch((error) => {
      setOtherSongsState(otherSongsStates.ERROR);
      console.log(error);
    });
  }

  function findCommonSongs(list) {
    let intersect = [...likedSongs].filter(song => contains(list, song));
    setCommon(intersect);
    setOtherSongsState(otherSongsStates.COMPLETE)
  }

  function contains(list, obj) {
    for (let i = 0; i < list.length; i++) {
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
    let i,j,chunk = 100;
    let uris = common.map(track => {
      return track.uri;
    })
    let numCallsNeeded = (uris.length/100)|0;
    let numCallsCompleted = 0;
    let numCallsFailed = 0;

    function success(needed, completed, failed, response) {
      if (completed === needed && failed === 0) {
        setNewPlaylistState("https://open.spotify.com/playlist/" + id);
      }
    }

    function fail(failed, error) {
      setNewPlaylistState(newPlaylistStates.ERROR + " https://open.spotify.com/playlist/" + id);
      console.log(error);
      failed += 1;
    }

    function final(completed) {
      completed += 1;
    }

    for (i=0,j=uris.length; i<j; i+=chunk) {
      spotifyApi.addToPlaylist(id, uris.slice(i,i+chunk)).then((response) => success(numCallsNeeded, numCallsCompleted, numCallsFailed, response))
      .catch((error) => fail(numCallsFailed, error))
      .finally(() => final());
    }
  }

  function fromImage(id) {
    if (id !== "") {
      getSongsFromPlaylist(id);
    } else {
      setPlaylistName(searchUser.display_name);
      getAllSongs();
    }
  }

  function getAllSongs() {
    setCommon([]);
    setOtherSongsState(otherSongsStates.LOADING);

    const playlistIds = searchUserPlaylists.map((playlist) => {
      return playlist.id
    });
    getPlaylistsSongs(playlistIds);
  }
  
  function getPlaylistsSongs(ids, offset = 0, oldSongs = [], currIdx = 0) {
    const NUM_SONGS  = 100;
    const id = ids[currIdx];
    
    spotifyApi.getPlaylistSongs(id, offset).then((response) => {
      const data = response.data;
      const items = response.data.items.map(obj => {
        return obj.track;
      }).filter(n => n);
      const newSongs = [...oldSongs, ...items]
      if (data.next !== null) {
        getPlaylistsSongs(ids, offset + NUM_SONGS, newSongs, currIdx);
      } else {
        if (currIdx === ids.length - 1) {
          setOtherSongsState(otherSongsStates.COMPARING)
          findCommonSongs(newSongs)
        } else {
          getPlaylistsSongs(ids, 0, newSongs, currIdx+1);
        }
      }
    }).catch((error) => {
      setOtherSongsState(otherSongsStates.ERROR);
      console.log(error);
    });
  }

  return (
    <Container className="container">
      <Row className="center">
        <h1 className="title">Common Songs</h1>
        <p className="subtitle">Find what songs you have in common</p>
        {user != null &&
          <User name={user.display_name} images={user.images}/>
        }
        {firstSongsState !== firstSongsStates.NOT_APPLICIABLE &&
          <p className="text">Liked Songs: {firstSongsState}</p>
        }
        {firstSongsState === firstSongsStates.COMPLETE && 
          <Input input={input} setInput={setInput} validateInput={readInput}/>
        }

        {searchUserPlaylists.length > 0 &&
          <Playlists onClick={fromImage} playlists={searchUserPlaylists}/>
        }

        <p className="subtitle">{otherSongsState}</p>
        {otherSongsState === otherSongsStates.COMPLETE &&
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
        <p className="text">© 2020 - common-songs.com - Brian Au </p>
        <Coffee/>
      </Row>
    </Container>
  );
}

export default App;
