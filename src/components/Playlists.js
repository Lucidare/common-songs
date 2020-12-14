import React from 'react';

export default function Playlists(props) {

  return (
    <ul className="playlist">
      <p className="subtitle"> Playlists</p>
      {props.playlists.map( playlist => {
        return (<p key={playlist.id} className="text">
          {playlist.name}
          </p>
        );
      })}
    </ul>
  );
}
