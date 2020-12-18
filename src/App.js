import React, { useState, useEffect } from 'react';
import { Container, Row, Button } from 'reactstrap';
import User from './components/User';
import Playlists from './components/Playlists';
import SongList from './components/SongList';
import Input from './components/Input'; 
import Spotify from './networking/SpotifyAPI';
import './App.css';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-147243437-1');

var spotifyApi = new Spotify();

function App() {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [songs, setSongs] = useState([]);
  const [input, setInput] = useState("");
  const [common, setCommon] = useState([]);
  const likedSongsStates = {
    NOT_APPLICIABLE: "",
    LOADING: "Retrieving your liked songs...",
    FAILED: "Unable to get your liked songs, please try again later",
    COMPLETE: "Completed"
  }
  const [likedSongsState, setLikedSongState]  = useState(likedSongsStates.NOT_APPLICIABLE);
  const otherSongsState= {
    NOT_APPLICIABLE: "",
    INVALID: "INVALID INPUT",
    LOADING: "Getting Songs...",
    COMPARING: "Finding Common Songs...",
    COMPLETE: "Common Songs Found"
  }
  const [songsState, setSongsState] = useState(input.NOT_APPLICIABLE);
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
    setLikedSongState(likedSongsStates.NOT_APPLICIABLE)
    setSongs([]);
    setSongsState(otherSongsState.NOT_APPLICIABLE)
  }

  function validateInput() {
    const split = input.split(":");
    if (split.length !== 3) {
      setSongsState(otherSongsState.INVALID)
    } else {
      if (split[0] === "spotify" && split[1] === "playlist") {
        getPlaylist(split[2]);
        setSongsState(otherSongsState.COMPLETE)
      } else {
        setSongsState(otherSongsState.INVALID)
      }
      
    }
  }

  function getPlaylist(id, offset = 0, oldSongs = []) {
    const NUM_SONGS  = 100;
    spotifyApi.getPlaylist(id, offset).then((response) => {
      const data = response.data;
      const items = response.data.items.map(obj => {
        return obj.track;
      });  
      const newSongs = [...oldSongs, ...items]
      if (data.next != null) {
        getPlaylist(id, offset + NUM_SONGS, newSongs);
      } else {
        setSongs(newSongs);
        setSongsState(otherSongsState.COMPARING)
        findCommonSongs(newSongs)
      }
    })
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

  return (
    <Container className="container">
      <Row className="center">
        <h1 className="title">Common Songs</h1>
        <p className="subtitle">Find what songs you have in common</p>
        {user != null &&
          <User name={user.display_name} images={user.images}/>
        }
        {/* {playlists.length > 0 &&
          <Playlists playlists={playlists}/>
        } */}
        {likedSongsState !== likedSongsStates.NOT_APPLICIABLE &&
          <p className="text">Liked Songs: {likedSongsState}</p>
        }
        {likedSongsState === likedSongsStates.COMPLETE && 
          <Input input={input} setInput={setInput} validateInput={validateInput}/>
        }
        <p className="subtitle">{songsState}</p>
        {songsState === otherSongsState.COMPLETE &&
          <p className="text">Total: {common.length ?? 0}</p>
        }
        
        {common.length > 0 &&
          <SongList title="" songs={common}/>
        }

        <div>
          {localStorage.getItem("token") == null 
            ? ( <Button className="greenBtn" onClick={login}>LOG IN WITH SPOTIFY</Button> )
            : (
              <Button className="greenBtn" onClick={logout}>LOG OUT</Button>
            )
          }
        </div>
      </Row>
    </Container>
  );
}

export default App;
