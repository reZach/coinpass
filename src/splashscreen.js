import './App.css';
import Header from "./header";
import React, { useRef, useEffect, useState } from 'react';

function Splashscreen() {

    return (
        <div className="App">
            <Header />
            <div>
                Do things for others
                see how it inspires the world
            </div>
        </div>
    );
}

export default Splashscreen;
