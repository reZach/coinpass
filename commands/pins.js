require("dotenv").config();

const supabase = require("@supabase/supabase-js");
const fs = require("fs");
const client = supabase.createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

// This script queries Supabase and updates the local file of
// the coins that is used on the webpage

const f = async function RunMe() {

    let ret = {};

    let { data: coins, error1 } = await client
        .from("Coins")
        .select("*");

    if (!error1) {

        let coinIds = coins.map(c => c.id);
        for (let i = 0; i < coinIds.length; i++) {

            let { data: coinCities, error2 } = await client
                .from("CoinCities")
                .select("*")

                // Filters
                .eq("coinid", coinIds[i])
                .order("id", { ascending: true });

            if (!error2) {
                
                for (let j = 0; j < coinCities.length; j++) {

                    let { data: cities, error3 } = await client
                        .from("Cities")
                        .select("*")

                        // Filters
                        .eq("id", coinCities[j].cityid);

                    if (!error3){
                        
                        let date = new Date(coinCities[j].created_at);
                        let displayValue = coins.filter(c => c.id === coinIds[i])[0].display_value;
                        
                        if (j === 0){
                            ret[displayValue] = [{
                                "longitude": cities[0].lng,
                                "latitude": cities[0].lat,
                                "date": date.toDateString(),
                                "city": cities[0].cityascii,
                                "state": cities[0].adminname,
                                "country": cities[0].country
                            }];
                        } else {
                            ret[displayValue].push({
                                "longitude": cities[0].lng,
                                "latitude": cities[0].lat,
                                "date": date.toDateString(),
                                "city": cities[0].cityascii,
                                "state": cities[0].adminname,
                                "country": cities[0].country
                            });
                        }                        
                    }
                }
            }
        }
    }    

    fs.writeFileSync("./src/data/pins.json", JSON.stringify(ret));
    console.log("success writing pins.json file");

    fs.writeFileSync("./src/data/lastupdatetime.json", JSON.stringify({
        time: (new Date()).getTime()
    }));
    console.log("success writing lastupdatetime.json file");
};

f();