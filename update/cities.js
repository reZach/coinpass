require('dotenv').config();

const supabase = require("@supabase/supabase-js");
const fs = require("fs");
const client = supabase.createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const f = async function RunMe() {

    let ret = {};

    let { data: cities, error3 } = await client
        .from('Cities')
        .select("*")

    ret.cities = cities.map(c => ({
        name: c.city,
        state: c.adminname,
        country: c.country,
        lat: c.lat,
        lng: c.lng
    }));

    fs.writeFileSync("./src/data/cities.json", JSON.stringify(ret));
    console.log("success writing cities.json file");
};

f();