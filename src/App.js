import React, { Component, useState } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import './App.css';

function App() {
  // const [state, setstate] = useState(initialState)

  return (
    <Container className="container">
      <Row className="center">
        <h1 className="title">Common Songs</h1>
        <p className="subtitle">Find what songs you have in common</p>
        <Button className="logInBtn" onClick={() => console.log("button clicked")} color="">LOG IN WITH SPOTIFY</Button>
      </Row>
    </Container>
  );
}

export default App;
