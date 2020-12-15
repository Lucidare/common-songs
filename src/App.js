import React, { useState, useEffect } from 'react';
import { Container, Row, Button } from 'reactstrap';
import User from './components/User';
import Playlists from './components/Playlists';
import API from './networking/SpotifyAPI';
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  const isLoggedIn = token != null;

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('access_token')
    document.title = "Common Songs"
    setToken(token);
    window.history.replaceState(null, null, window.location.pathname);

    if (token != null) {
      API.getMe(token).then((response) => {
        setUser(response.data);
      }).catch((error) => {
        console.log(error);
      });


      API.getPlaylists(token).then((response) => {
        setPlaylists(response.data.items);
      }).catch((error) => {
        console.log(error);
      });
    }
  }, []);

  function login() {
    window.location = window.location.href.includes('localhost')
      ? 'http://localhost:8888/login'
      : 'https://common-songs-auth.herokuapp.com/login'
  }

  function logout() {
    setToken(null);
    setUser(null);
    setPlaylists([]);
  }

  return (
    <Container className="container">
      <Row className="center">
        <h1 className="title">Common Songs</h1>
        <p className="subtitle">Find what songs you have in common</p>
        {user != null &&
          <User name={user.display_name} images={user.images}/>
        }
        {playlists.length > 0 &&
          <Playlists playlists={playlists}/>
        }
        {!isLoggedIn 
          ? <Button className="greenBtn" onClick={login}>LOG IN WITH SPOTIFY</Button>
          : <Button className="greenBtn" onClick={logout}>LOG OUT</Button>
        }
      </Row>
    </Container>
  );
}

export default App;
