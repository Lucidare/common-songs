import React from 'react';

export default function BuyMeACoffee() {

    // let action = <script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="lucidare" data-color="#1db954" data-emoji="☕"  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#FFDD00" ></script>
    return ( 
        <a href="https://www.buymeacoffee.com/lucidare" target="_blank">
            <img src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me A Coffee" className="coffee"/>
        </a>
    );
}
