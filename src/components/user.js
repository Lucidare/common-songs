import React from 'react';

export default function User(props) {
  return (
    <div className="row">
      <img className="profileImage" src={props.img} alt="user's icon"></img>
      <p className="text">Logged in as {props.name}</p>
    </div>
  );
}

