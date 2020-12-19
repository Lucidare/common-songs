import React from 'react';

export default function Song(props) {

    return (
        <div>
            <div className="text">
                {props.song.name} - {props.song.artists.map(artist => {
                    return artist.name
                }).join(", ")}
            </div>
        </div>
    );
}
