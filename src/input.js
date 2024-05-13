import './App.css';
import Header from "./header";
import React, { useRef, useEffect, useState } from 'react';
import geoCities from "./data/cities.json";
import geoCountries from "./data/countries.json";

const supabase = require("@supabase/supabase-js");
const client = supabase.createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

function Input() {

    const [city, setCity] = useState([]);
    const [userCity, setUserCity] = useState(0);
    const [code, setCode] = useState("");    

    let countries = [<option key={0} value={0}></option>];
    for (let i = 0; i < geoCountries.countries.length; i++) {
        countries.push(<option key={geoCountries.countries[i]} value={geoCountries.countries[i]}>{geoCountries.countries[i]}</option>);
    }

    let privateMap = {
        "_": [{
            id: 0,
            display: ""
        }]
    };

    for (let i = 0; i < geoCities.cities.length; i++) {
        if (!privateMap.hasOwnProperty(geoCities.cities[i].country)) {
            privateMap[geoCities.cities[i].country] = [];
        }

        privateMap[geoCities.cities[i].country].push({
            id: geoCities.cities[i].id,
            display: `${geoCities.cities[i].name}, ${geoCities.cities[i].state}`
        });        
    }

    let keys = Object.keys(privateMap);
    for (let i = 0; i < keys.length; i++) {
        privateMap[keys[i]].sort((a, b) => {
            return a.display.localeCompare(b.display);
        });
    }    

    const submit = async (event) => {
        event.preventDefault();

        let { data: coins, error } = await client
            .from('Coins')
            .select('*')
            .eq("identifier", code);


        if (coins.length > 0) {

            // insert record
            const { data, error } = await client
                .from('CoinCities')
                .insert([
                    { coinid: coins[0].id, cityid: userCity },
                ])
                .select();
        }
    }

    const changeCountry = (event) => {
        let arr = ["", ...privateMap[event.target.value]];
        setCity(arr);
    }

    const changeCity = (event) => {
        setUserCity(event.target.value);
    }

    const changeCode = (event) => {
        setCode(event.target.value);
    }



    return (
        <div className="App">
            <Header page={"input"} />
            <div className="container text-white">
                <div className="row mb-4">
                    <div className="col-3"></div>
                    <div className="col-6">
                        Enter in <em>where</em> you did something for others, starting with the country,
                        and followed by the city. Don't forget to enter in the code on the coin!
                    </div>
                    <div className="col-3"></div>
                </div>
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <form className="needs-validation" onSubmit={submit}>
                            <div className="form-group row mb-2">
                                <label for="inputEmail3" className="col-sm-2 col-form-label">Country</label>
                                <div className="col-sm-10">
                                    <select className="form-control" onChange={changeCountry} required>
                                        {countries}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-2">
                                <label for="inputEmail3" className="col-sm-2 col-form-label">City</label>
                                <div className="col-sm-10">
                                    <select className="form-control" onChange={changeCity} disabled={city.length === 0} placeholder={(city.length === 0 ? "Disabled" : "")} required>
                                        {city.map((c, index) => <option key={c.id} value={c.id}>{c.display}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-2">
                                <label for="inputEmail3" className="col-sm-2 col-form-label">Code</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" placeholder="The code on your coin" value={code} onChange={changeCode} required />
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary" type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                    <div className="col-3"></div>
                </div>

            </div>

        </div>
    );
}

export default Input;
