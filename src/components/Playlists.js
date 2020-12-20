import React from 'react';
import { Row, Button } from 'reactstrap'

export default function Playlists(props) {

  var list = []
  props.playlists.map( playlist => {
    if (list.includes(playlist.id)) {
      console.log(playlist.id);
    }
    list.push(playlist.id);
  });


  return (
    <ul className="playlist">
      <p className="subtitle">Public Playlists Found</p>
      {props.playlists.map( playlist => {
        return (
          <Button onClick={props.onClick(playlist.id)}>
            <Row className="spaced">
              {playlist.images.length > 0  &&
                <img className="playlistImage" src={playlist.images[0].url} alt="playlist"/>
              }
              <p key={playlist.id} className="text">
                {playlist.name}
              </p>  
            </Row>
          </Button>
        );
      })}
    </ul>
  );
}
