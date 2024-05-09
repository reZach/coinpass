import './App.css';
import Header from "./header";
import React, { useRef, useEffect, useState } from 'react';
import geoCities from "./data/cities.json";
import geoCountries from "./data/countries.json";

function Input() {

    const [city, setCity] = useState([]);

    //console.log(geoCountries);

    let countries = [];
    for (let i = 0; i < geoCountries.countries.length; i++) {
        countries.push(<option key={geoCountries.countries[i]} value={geoCountries.countries[i]}>{geoCountries.countries[i]}</option>);
    }

    let privateMap = {};

    let options = [];
    for (let i = 0; i < geoCities.cities.length; i++) {
        if (!privateMap.hasOwnProperty(geoCities.cities[i].country)) {
            privateMap[geoCities.cities[i].country] = [];
        }

        privateMap[geoCities.cities[i].country].push({
            id: geoCities.cities[i].id,
            display: `${geoCities.cities[i].name}, ${geoCities.cities[i].state}`
        });        

        //options.push(<option key={geoCities.cities[i].id} value={geoCities.cities[i].id}>{`${geoCities.cities[i].name}, ${geoCities.cities[i].country}`}</option>);
    }

    let keys = Object.keys(privateMap);
    for (let i = 0; i < keys.length; i++) {
        privateMap[keys[i]].sort((a, b) => {
            return a.display.localeCompare(b.display);
        });
    }   

    //console.log(privateMap);

    //console.log(options);

    const submit = (event) => {
        event.preventDefault();
    }

    const changeCountry = (event) => {
        //console.log(city);
        
        setCity(privateMap[event.target.value]);
        //console.log(city);
    }

    console.log(city);

    return (
        <div className="App">
            <Header />
            <form className="row g-3 needs-validation">
                <div className="col-md-4">
                    <select onChange={changeCountry}>
                        {countries}
                    </select>
                </div>
                <div className="col-md-4">
                    <select>
                        {city.map((c, index) => <option key={c.id} value={c.id}>{c.display}</option>)}
                    </select>
                </div>

                <div className="col-12">
                    <button className="btn btn-primary" type="submit">Submit form</button>
                </div>
            </form>
        </div>
    );
}

export default Input;
