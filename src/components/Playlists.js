import React from 'react';
import { Row } from 'reactstrap'
import logo from '../imgs/logo512.png'

export default function Playlists(props) {

  return (
    <ul className="playlist">
      <p className="subtitle">Public Playlists Found</p>
      {props.playlists.map( playlist => {
        return (
          <Row className="spaced">
            {playlist.images.length > 0
              ? <img className="playlistImage" src={playlist.images[0].url} alt="playlist" onClick={() => props.onClick(playlist.id)}/>
              : <img className="playlistImage" src={logo} alt="all playlists" onClick={() => props.onClick("")}/>
            }
            <p key={playlist.id} className="text">
              {playlist.name}
            </p>
          </Row>
        );
      })}
      <Row className="spaced">
        <img className="playlistImage" src={logo} alt="all playlists" onClick={() => props.onClick("")}/>
        <p className="text">
          All Playlists
        </p>
      </Row>
    </ul>
  );
}
