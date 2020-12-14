import React, { Component, useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import User from './components/user';
import api from './networking/spotifyAPI';
import './App.css';

function App() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [playlists, setPlaylists] = useState([])

  const isLoggedIn = token != null;

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('access_token')
    setToken(token);
    window.history.replaceState(null, null, window.location.pathname);

    if (token != null) {
      console.log(token);
      api.getMe(token).then((response) => {
        console.log(response.data);
        setUser(response.data);
      }).catch((error) => {
        console.log(error);
      });


      api.getPlaylists(token).then((response) => {
        // console.log(response);
        setPlaylists(response.data);
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
    setPlaylists(null);
  }

  return (
    <Container className="container">
      <Row className="center">
        <h1 className="title">Common Songs</h1>
        <p className="subtitle">Find what songs you have in common</p>
        {user != null && 
          <User name={user.display_name} img={user.images[0].url}></User>
          // <img src={user.images[0].url}></img>
          // <p className="subtitle">Logged in as {user.display_name}</p>
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
