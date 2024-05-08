require('dotenv').config();

const supabase = require("@supabase/supabase-js");
const fs = require("fs");
const client = supabase.createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// This script queries Supabase and updates the local file of
// the coins that is used on the webpage

const f = async function RunMe() {

    let ret = {};

    let { data: coins, error1 } = await client
        .from('Coins')
        .select('*');

    if (!error1) {

        let coinIds = coins.map(c => c.id);
        for (let i = 0; i < coinIds.length; i++) {

            let { data: coinCities, error2 } = await client
                .from('CoinCities')
                .select("*")

                // Filters
                .eq('coinid', coinIds[i]);

            if (!error2) {
                
                for (let j = 0; j < coinCities.length; j++) {

                    let { data: cities, error3 } = await client
                        .from('Cities')
                        .select("*")

                        // Filters
                        .eq('id', coinCities[j].cityid);

                    if (!error3){

                        let date = new Date(coinCities[j].date);
                        let identifier = coins.filter(c => c.id === coinIds[i])[0].identifier;
                        
                        if (j === 0){
                            ret[identifier] = [{
                                "lng": cities[0].lng,
                                "lat": cities[0].lat,
                                "dte": date.toDateString()
                            }];
                        } else {
                            ret[identifier].push({
                                "lng": cities[0].lng,
                                "lat": cities[0].lat,
                                "dte": date.toDateString()
                            });
                        }                        
                    }
                }
            }
        }
    }    

    fs.writeFileSync("./src/data/pins.json", JSON.stringify(ret));
    console.log("success writing pins.json file");
};

f();