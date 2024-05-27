require("dotenv").config();

const supabase = require("@supabase/supabase-js");
const fs = require("fs");
const client = supabase.createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

// This script updates the list of valid cities the webpage can use

const f = async function RunMe() {

    let ret = {};

    let { data: cities, error3 } = await client
        .from("Cities")
        .select("*")

    ret.cities = cities.map(c => ({
        id: c.id,
        name: c.cityascii,
        state: c.adminname,
        country: c.country,
        lat: c.lat,
        lng: c.lng
    }));

    let countries = cities.map(c => c.country);
    countries = Array.from(new Set(countries)); // only get unique values
    countries.sort();

    fs.writeFileSync("./src/data/cities.json", JSON.stringify(ret));
    console.log("success writing cities.json file");

    fs.writeFileSync("./src/data/countries.json", JSON.stringify({
        countries: countries
    }));
    console.log("success writing countries.json file");
};

f();