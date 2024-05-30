require("dotenv").config();

const supabase = require("@supabase/supabase-js");
const groupBy = require("core-js/actual/array/group-by");
const fs = require("fs");
const client = supabase.createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

// This script updates the list of valid cities the webpage can use

const f = async function RunMe() {

    let ret = {};

    // Query DB to pull all city data
    let { data: cities, error3 } = await client
        .from("Cities")
        .select("*");

    // Turn query data into a [nice] array of objects
    let objectList = cities.map(c => ({
        id: c.id,
        name: c.cityascii,
        state: c.adminname,
        country: c.country,
        lat: c.lat,
        lng: c.lng
    }));

    // Get an ordered list of country names
    let countryNames = cities.map(c => c.country);
    countryNames = Array.from(new Set(countryNames)); // only get unique values
    countryNames.sort();

    for (let i = 0; i < countryNames.length; i++) {

        // Get a grouped list of cities by state/province for a given country
        let groupedByState = groupBy(objectList.filter(c1 => c1.country === countryNames[i]), ({ state }) => state);

        // Get a sorted list of state/province names within the country
        const stateProvinceNames = Object.keys(groupedByState).sort();

        for (let j = 0; j < stateProvinceNames.length; j++) {

            // Sort all cities in a given state/province
            groupedByState[stateProvinceNames[j]].sort((a, b) => {
                let e = a.name.localeCompare(b.name);
                return a.name.localeCompare(b.name);
            });

            // Build the return object;
            // first add a property (country) if it does not exist
            if (!ret.hasOwnProperty(countryNames[i])) {
                ret[countryNames[i]] = {};
            }

            /* Sample of full data file
            {                
                "United States": {
                    "Alabama": [
                        {
                            "id": 1840013756,
                            "name": "Alabaster",
                            "state": "Alabama",
                            "country": "United States",
                            "lat": 33.2198,
                            "lng": -86.8225
                        },
                        {
                            "id": 1840013599,
                            "name": "Albertville",
                            "state": "Alabama",
                            "country": "United States",
                            "lat": 34.2633,
                            "lng": -86.2108
                        },
                        ....
                    ]
                },
                "CountryB": {
                    ....
                }
            }
            */
            ret[countryNames[i]][stateProvinceNames[j]] = groupedByState[stateProvinceNames[j]]
        }
    }


    fs.writeFileSync("./src/data/cities.json", JSON.stringify(ret));
    console.log("success writing cities.json file");

    fs.writeFileSync("./src/data/countries.json", JSON.stringify({
        countries: countryNames
    }));
    console.log("success writing countries.json file");
};

f();