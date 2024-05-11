import './App.css';
import "./splashscreen.css";
import Header from "./header";
import React, { useRef, useEffect, useState } from 'react';

function Splashscreen() {

    const navigate = function(url){
        window.location.href = url;
    }

    return (
        <div className="App text-white">
            <Header page={"start"}/>
            <h1 className="display-1 bold">[working title]</h1>
            <h4 style={{marginBottom:"80px"}}>A project meant to inspire you by showing that even one small act of love<br /> can have rippling effects across the world.</h4>
            <h1>How does it work?</h1>
            <p>
                If you have landed on this page, you have been given a coin.<br /> Your task is to do something you would not normally do, to love or care for another person.<br /> Once you have done this, give them the coin and tell them do to the same.<br /> Log <em>where</em> you did this act of service on <a href="/input">this page</a>. You can view how far the coin has traveled on <a href="/coinpass">this page</a>.
            </p>
            <div className="cta-buttons">
                <button className="cta-button bold" onClick={() => navigate("/input")}>Log your action</button>
                <button className="cta-button bold" onClick={() => navigate("/coinpass")}>View the map</button>
            </div>
        </div >
    );
}

export default Splashscreen;
