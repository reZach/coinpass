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

    //console.log(geoCountries);

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
        //console.log(city);

        let arr = ["", ...privateMap[event.target.value]];
        setCity(arr);
        //console.log(city);
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
            <form className="row g-3 needs-validation" onSubmit={submit}>
                <div className="col-md-4">
                    <select onChange={changeCountry}>
                        {countries}
                    </select>
                </div>

                <div className="col-md-4">
                    <select onChange={changeCity}>
                        {city.map((c, index) => <option key={c.id} value={c.id}>{c.display}</option>)}
                    </select>
                </div>

                <div class="form-group">
                    <label for="exampleInputPassword1">code</label>
                    <input type="text" class="form-control" id="exampleInputPassword1" placeholder="code" value={code} onChange={changeCode} />
                </div>

                <div className="col-12">
                    <button className="btn btn-primary" type="submit">Submit form</button>
                </div>
            </form>
        </div>
    );
}

export default Input;
