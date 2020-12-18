import React from 'react';

export default function Song(props) {
    return (
        <div>
            <p className="text">
                {props.song.name}
            </p>
            {/* {console.log(props.song.track)} */}
        </div>
    );
}
