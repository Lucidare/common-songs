import React, { Component, useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import './App.css';

function App() {
  // const [state, setstate] = useState(initialState)

  useEffect(() => {
    let token = new URLSearchParams(window.location.search).get('access_token')
    console.log(token);
  }, []);

  return (
    <Container className="container">
      <Row className="center">
        <h1 className="title">Common Songs</h1>
        <p className="subtitle">Find what songs you have in common</p>
        <Button className="logInBtn" onClick={() => window.location = 'http://localhost:8888/login'} color="">LOG IN WITH SPOTIFY</Button>
      </Row>
    </Container>
  );
}

export default App;
