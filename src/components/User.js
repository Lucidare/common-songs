import React from 'react';

export default function User(props) {
  const images = props.images;
  return (
    <div className="row">
      {images.length > 0 &&
        <img className="profileImage" src={images[0].url} alt="user's icon"></img>
      }
      <p className="text">Logged in as {props.name}</p>
    </div>
  );
}

