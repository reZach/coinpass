import './App.css';
import "./splashscreen.css";
import Header from "./header";
import React, { useRef, useEffect, useState } from 'react';

function Splashscreen() {

    return (
        <div className="App">
            <Header />
            <h1 className="copy-text">Welcome to Our Website</h1>
            <h2 className="sub-header">Explore and Discover</h2>
            <div className="cta-buttons">
                <button className="cta-button">Button 1</button>
                <button className="cta-button">Button 2</button>
                <button className="cta-button">Button 3</button>
            </div>
        </div>
    );
}

export default Splashscreen;
