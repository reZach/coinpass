
import Header from "./shared/header";
import Spreadsheet from "react-spreadsheet";
import React, { useRef, useEffect, useState } from 'react';
import geoJson from "../data/pins.json";

function Stats() {

    const keys = Object.keys(geoJson).sort();

    const columns = [keys];
    const rows = [];
    let data = [];    

    let depth = 0;
    let exit = false;

    while (!exit) {
        for (let i = 0; i < keys.length; i++) {
            let arr = [];
            exit = true;

            if (geoJson[keys[i]].length > depth) {
                arr.push({
                    value: `(${geoJson[keys[i]][depth].dte}) ${geoJson[keys[i]][depth].cty}, ${geoJson[keys[i]][depth].adm} ${geoJson[keys[i]][depth].cou}`
                });
                exit = false;
            } else {
                arr.push({
                    value: ""
                });
            }

            data.push(arr);
        }

        depth++;
    }



    // set everything to readonly
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            data[i][j].readOnly = true;
        }
    }

    return <div className="App">
        <Header page={"stats"} />

        <Spreadsheet data={data} columnLabels={columns} />
    </div >;
}

export default Stats;
