import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';

export default function User(props) {
  return (
    <Row>
        <img src={props.img}></img>
        <p className="subtitle">Logged in as {props.name}</p>
    </Row>
  );
}

