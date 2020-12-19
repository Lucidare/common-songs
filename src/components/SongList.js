import React from 'react';
import Song from './Song';
import { Button } from 'reactstrap';

export default function SongList(props) {
    return (
        <div>
        <ul className="playlist">
            <p className="subtitle">{props.title}</p>
                {props.songs.map( song => {
                    return (
                        <Song key={song.id} song={song}/>
                    );
                })}
        </ul>
        <p>
            <Button className="greenBtn" onClick={props.makeNewPlaylist}>Add these songs to playlist</Button>
        </p>
        </div>
    );
}
