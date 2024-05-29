import Header from "./shared/header";
import React, { useRef, useEffect, useState } from "react";
import Swal from "sweetalert2";
import geoCities from "../data/cities.json";
import geoCountries from "../data/countries.json";

const supabase = require("@supabase/supabase-js");
const client = supabase.createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

function Action() {

    const [city, setCity] = useState([]);
    const [userCity, setUserCity] = useState(0);
    const [code, setCode] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [submitAnother, setSubmitAnother] = useState(false);

    const initialized = useRef(false);
    const captchaValue = useRef(undefined);

    useEffect(() => {
        async function init() {
            if (!initialized.current) {
                initialized.current = true;
            }

            captchaValue.current = await generateCaptcha();
        }
        init();
    }, []);

    // todo - prioritize country based on ip
    let usaIndex = geoCountries.countries.indexOf("United States");
    
    let countries = [<option key={0} value={0}></option>];
    countries.push(<option key={geoCountries.countries[usaIndex]} value={geoCountries.countries[usaIndex]}>{geoCountries.countries[usaIndex]}</option>);
    for (let i = 0; i < geoCountries.countries.length; i++) {

        if (i !== usaIndex) {
            countries.push(<option key={geoCountries.countries[i]} value={geoCountries.countries[i]}>{geoCountries.countries[i]}</option>);
        }
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

    const generateCaptcha = async function () {
        if (captchaValue.current !== undefined) {
            return;
        }

        var chars = "234679ACDEFGHJKLMNPQRTUVWXYZ";
        // You can include special characters by adding them to the string above, for eg: chars += "@#?<>";

        var string_length = 6; // This is the length of the Captcha    
        var ChangeCaptcha = "";
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            ChangeCaptcha += chars.substring(rnum, rnum + 1);
        }

        await document.fonts.ready;

        const contex = document.getElementById("js-canvas").getContext("2d");
        contex.fillStyle = "#000000";
        contex.font = "32px \"Lato-Regular\"";
        contex.fillText(ChangeCaptcha, 0, 50);

        return ChangeCaptcha;
    }

    const refreshPage = (event) => {
        window.location.reload(); // eslint-disable-line no-use-before-define
    }


    const submit = async (event) => {
        event.preventDefault();

        if (userCity === 0) {
            Swal.fire({
                title: "Invalid",
                text: "City not selected",
                icon: "error"
            });
            return;
        } else if (code === "") {
            Swal.fire({
                title: "Invalid",
                text: "Coin value not found",
                icon: "error"
            });
            return;
        } else if (captcha !== captchaValue.current) {
            Swal.fire({
                title: "Invalid",
                text: "Invalid captcha",
                icon: "error"
            });
            return;
        }

        let { data: coins, error } = await client
            .from("Coins")
            .select("*")
            .eq("code", code);

        if (coins.length > 0) {

            // insert record
            const { data, error } = await client
                .from("CoinCities")
                .insert([
                    { coinid: coins[0].id, cityid: userCity },
                ])
                .select();

            setUserCity("");
            setCode("");
            captchaValue.current = await generateCaptcha();
            setCaptcha("");
            setSubmitAnother(true);

            Swal.fire({
                title: "Good job!",
                text: "Thanks for doing something good for another person!",
                icon: "success"
            });
        } else {

            // prevent spamming the DB            
            captchaValue.current = await generateCaptcha();
            setCaptcha("");

            Swal.fire({
                title: "Invalid",
                text: "We were unable to submit your details",
                icon: "error"
            });
            return;
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

    const changeCaptcha = (event) => {
        setCaptcha(event.target.value);
    }

    return (
        <div className="App">
            <Header page={"action"} />
            <div className="container">
                <div className="row mt-4 mb-4">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8 col-12">
                        Enter in <em>where</em> you did something for others, starting with the country,
                        and followed by the city. Don't forget to enter in the code on the coin!<br /><br />

                        <em>Note: Please see the FAQ page regarding how soon submissions will be updated on the map.</em>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8 col-12">
                        <form className="needs-validation mb-2" onSubmit={submit}>
                            <div className="form-group row mb-2">
                                <label className="col-sm-2 col-form-label">Country</label>
                                <div className="col-sm-10">
                                    <select className="form-control" onChange={changeCountry} required>
                                        {countries}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-2">
                                <label className="col-sm-2 col-form-label">City</label>
                                <div className="col-sm-10">
                                    <select className="form-control" onChange={changeCity} value={userCity} disabled={city.length === 0} placeholder={(city.length === 0 ? "Disabled" : "")} required>
                                        {city.map((c, index) => <option key={c.id} value={c.id}>{c.display}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-2">
                                <label className="col-sm-2 col-form-label">Code</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" placeholder="The code on your coin" value={code} onChange={changeCode} required />
                                </div>
                            </div>
                            <div className="form-group row mb-2">
                                <label className="col-sm-2 col-form-label">Captcha</label>
                                <div className="col-sm-10">
                                    <canvas id="js-canvas" className="text-white" width="300" height="100"></canvas>
                                    <input type="text" className="form-control" placeholder="Enter captcha value above" value={captcha} onChange={changeCaptcha} required />
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary" type="submit" disabled={submitAnother ? "disabled" : ""}>Submit</button>
                            </div>
                        </form>
                        <div className="row mb-2" style={{ display: submitAnother ? "flex" : "none" }}>
                            <button className="btn btn-primary" type="button" onClick={refreshPage}>Click here to submit another</button>
                        </div>
                    </div>
                    <div className="col-sm-2"></div>
                </div>

            </div>

        </div>
    );
}
export default Action;
