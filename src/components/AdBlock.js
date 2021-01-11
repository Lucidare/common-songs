import React from 'react';
import {Adsense} from 'react-adsense';

export default function AdBlock(props) {
    const client = "";
    const slot = "";

    return (
        <Adsense
          client={client}
          slot={slot}
        />
    );
}
