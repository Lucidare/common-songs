import React from 'react';
import Song from './Song';

export default function SongList(props) {
    return (
        <ul className="playlist">
            <p className="subtitle">{props.title}</p>
                {props.songs.map( song => {
                    return (
                        <Song key={song.id} song={song}/>
                    );
                })}
        </ul>
    );
}
