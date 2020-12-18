import React from 'react';
import { Button } from 'reactstrap';

export default function Input(props) {
    const input = props.input;
    const setInput = props.setInput;
    const validateInput = props.validateInput;
    return (  
        <div>
        <p className="text">Enter a playlistURI</p>
        <input name="input" value={input} onChange={e => setInput(e.target.value)}/>
        <div className="spaced">
          <Button className="greenBtn" onClick={validateInput}>Find Common Songs</Button>
        </div>
      </div>
    );
}
