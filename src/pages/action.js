import Header from "./shared/header";
import React, { useRef, useEffect, useState } from "react";
import Swal from "sweetalert2";
import geoCities from "../data/cities.json";
import geoCountries from "../data/countries.json";

const supabase = require("@supabase/supabase-js");
const client = supabase.createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

function Action() {

    function generateCountries() {

        // todo - prioritize country based on ip
        let usaIndex = geoCountries.countries.indexOf("United States");

        let countries = [<option key={0} value=""></option>];
        countries.push(<option key={geoCountries.countries[usaIndex]} value={geoCountries.countries[usaIndex]}>{geoCountries.countries[usaIndex]}</option>);
        for (let i = 0; i < geoCountries.countries.length; i++) {

            if (i !== usaIndex) {
                countries.push(<option key={geoCountries.countries[i]} value={geoCountries.countries[i]}>{geoCountries.countries[i]}</option>);
            }
        }

        return countries;
    }

    // Select options
    const [countries, setCountries] = useState(() => generateCountries());
    const [stateProvinces, setStateProvinces] = useState([]);
    const [cities, setCities] = useState([]);

    // User selection
    const [userCountry, setUserCountry] = useState("");
    const [userStateProvince, setUserStateProvince] = useState("");
    const [userCity, setUserCity] = useState("");
    const [code, setCode] = useState("");
    const [captcha, setCaptcha] = useState("");

    const initialized = useRef(false);
    const captchaValue = useRef(undefined);

    useEffect(() => {
        async function init() {
            if (!initialized.current) {
                initialized.current = true;

                if ("geolocation" in navigator) {
                    /* geolocation is available */

                    // Attempt to automatically set the closest city to our
                    navigator.geolocation.getCurrentPosition((position) => {
                        let closest = {};

                        const countries = Object.keys(geoCities);

                        for (let i = 0; i < countries.length; i++) {
                            const statesProvinces = Object.keys(geoCities[countries[i]]);

                            for (let j = 0; j < statesProvinces.length; j++) {

                                const cities = Object.keys(geoCities[countries[i]][statesProvinces[j]]);

                                for (let k = 0; k < cities.length; k++) {

                                    let distance = Math.sqrt(Math.pow(position.coords.longitude - geoCities[countries[i]][statesProvinces[j]][k].lng, 2) + Math.pow(position.coords.latitude - geoCities[countries[i]][statesProvinces[j]][k].lat, 2));

                                    // For the first city we encounter in the loop
                                    if (Object.keys(closest).length === 0) {
                                        closest = {
                                            country: countries[i],
                                            stateProvince: statesProvinces[j],
                                            city: geoCities[countries[i]][statesProvinces[j]][k].id,
                                            lat: geoCities[countries[i]][statesProvinces[j]][k].lat,
                                            lng: geoCities[countries[i]][statesProvinces[j]][k].lng,
                                            distance: distance
                                        }
                                    } else {

                                        // Save the city that is closer to us
                                        if (distance < closest.distance) {
                                            closest = {
                                                country: countries[i],
                                                stateProvince: statesProvinces[j],
                                                city: geoCities[countries[i]][statesProvinces[j]][k].id,
                                                lat: geoCities[countries[i]][statesProvinces[j]][k].lat,
                                                lng: geoCities[countries[i]][statesProvinces[j]][k].lng,
                                                distance: distance
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // Update the controls to reflect the closest city to our location
                        changeCountry({
                            target: {
                                value: closest.country
                            }
                        });
                        changeStateProvince({
                            target: {
                                value: closest.stateProvince
                            },
                            hack_country: closest.country
                        });
                        changeCity({
                            target: {
                                value: closest.city
                            }
                        });
                    });
                } else {
                    /* geolocation IS NOT available */
                }
            }

            captchaValue.current = await generateCaptcha();
        }
        init();
    }, []);

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

        const canvas = document.getElementById("js-canvas");
        const context = canvas.getContext("2d");
        const center = canvas.width / 2;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#000000";
        context.font = "32px \"Lato-Regular\"";
        context.textAlign = "center";
        context.fillText(ChangeCaptcha, center, 50);

        return ChangeCaptcha;
    }

    const refreshPage = (event) => {
        window.location.reload(); // eslint-disable-line no-use-before-define
    }


    const submit = async (event) => {
        event.preventDefault();

        if (userCountry === "") {
            Swal.fire({
                title: "Invalid",
                text: "Country not selected",
                icon: "error"
            });
            return;
        } else if (userStateProvince === "") {
            Swal.fire({
                title: "Invalid",
                text: "State/province not selected",
                icon: "error"
            });
            return;
        } else if (userCity === "") {
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

            setUserCountry("");
            setUserStateProvince("");
            setUserCity("");
            setCode("");

            captchaValue.current = undefined; // Needed to set to regenerate the captcha value [with the line below]
            captchaValue.current = await generateCaptcha();
            setCaptcha(""); // Force user to re-enter the new value            

            Swal.fire({
                title: "Good job!",
                text: "Thanks for doing something good for another person!",
                icon: "success"
            });
        } else {

            // prevent spamming the DB  
            captchaValue.current = undefined; // Needed to set to regenerate the captcha value [with the line below]
            captchaValue.current = await generateCaptcha();
            setCaptcha(""); // Force user to re-enter the new value

            Swal.fire({
                title: "Invalid",
                text: "We were unable to submit your action, please try again",
                icon: "error"
            });
            return;
        }
    }

    const changeCountry = (event) => {
        const newValue = event.target.value;

        setUserStateProvince(""); // reset
        setUserCountry(newValue);

        let arr = [<option key={0} value={""}></option>];

        if (newValue !== "") {
            const keys = Object.keys(geoCities[newValue]);

            for (let i = 0; i < keys.length; i++) {
                arr.push(<option key={keys[i]} value={keys[i]}>{keys[i]}</option>);
            }
        }

        setStateProvinces(arr);
    }

    const changeStateProvince = (event) => {
        const newValue = event.target.value;

        setUserCity(""); // reset
        setUserStateProvince(newValue);

        let arr = [<option key={0} value={""}></option>];

        if (newValue !== "") {

            let cities;

            // Hack; pull from a custom property when we call this method
            // from page init when pulling user geolocation details. We do this
            // because calling changeStateProvince when we pull geolocation details
            // doesn't properly update the state of 'userCountry' in time and
            // I don't know of a nice way to daisy-chain waiting for 'userCountry'
            // to populate
            if (userCountry === "") {
                cities = geoCities[event.hack_country][newValue];
            } else {
                cities = geoCities[userCountry][newValue];
            }

            for (let i = 0; i < cities.length; i++) {
                arr.push(<option key={cities[i].id} value={cities[i].id}>{cities[i].name}</option>);
            }
        }

        setCities(arr);
    }

    const changeCity = (event) => {
        setUserCity(event.target.value);
    }

    const changeCode = (event) => {
        setCode(event.target.value.toUpperCase());
    }

    const changeCaptcha = (event) => {
        setCaptcha(event.target.value.toUpperCase());
    }

    return (
        <div className="App">
            <Header page={"action"} />
            <div className="container">
                <div className="row mt-4 mb-4">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8 col-12">
                        <h1 className="display-1 header">Submit your good deed</h1>
                        In the form below, enter <em>in what city</em> you did something good for others.<br />
                        (Allowing location services for this website will allow you to auto-fill the options below with your location. This is provided as a convenience and is not required to be enabled for you to submit the information below.)<br /><br />

                        <em>Note: Please see the <a href="#/faq">FAQ page</a> regarding how soon submissions will be updated on the map.</em>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8 col-12">
                        <form className="needs-validation mb-2" onSubmit={submit}>
                            <div className="form-group row mb-2">
                                <label className="col-sm-2 col-form-label text-start text-md-center">Country</label>
                                <div className="col-sm-10">
                                    <select className="form-control" onChange={changeCountry} value={userCountry} required>
                                        {countries}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-2">
                                <label className="col-sm-2 col-form-label text-start text-md-center">State/Province</label>
                                <div className="col-sm-10">
                                    <select className="form-control" onChange={changeStateProvince} value={userStateProvince} disabled={userCountry === ""} required>
                                        {stateProvinces}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-2">
                                <label className="col-sm-2 col-form-label text-start text-md-center">City</label>
                                <div className="col-sm-10">
                                    <select className="form-control" onChange={changeCity} value={userCity} disabled={userCountry === "" || userStateProvince === ""} required>
                                        {cities}
                                    </select>
                                </div>
                                {userCountry !== "" && userStateProvince !== "" ?
                                    <p className="mt-4 text-start text-md-center">
                                        Is your city not in this list? Head on over to <a href="/#addcity">this page</a> to get it added
                                    </p> : null}
                            </div>
                            <div className="form-group row mb-2">
                                <label className="col-sm-2 col-form-label text-start text-md-center">Code</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" placeholder="This value will begin with two letters" value={code} onChange={changeCode} required />
                                </div>
                            </div>
                            <div className="form-group row mb-2">
                                <label className="col-sm-2 col-form-label text-start text-md-center">Captcha</label>
                                <div className="col-sm-10">
                                    <canvas id="js-canvas" className="text-white" width="300" height="100"></canvas>
                                    <input type="text" className="form-control" placeholder="Enter captcha value above" value={captcha} onChange={changeCaptcha} required />
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary" type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                    <div className="col-sm-2"></div>
                </div>

            </div>

        </div>
    );
}
export default Action;
