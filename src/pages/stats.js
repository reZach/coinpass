import "./stats.css";
import Header from "./shared/header";
import Spreadsheet from "react-spreadsheet";
import React, { useRef, useEffect, useState } from "react";
import geoJson from "../data/pins.json";

function Stats() {

    const keys = Object.keys(geoJson).sort();

    const columns = [keys];
    const rows = [];
    let data = [];

    let depth = 0;
    let exit = false;

    while (keys.length > 0 && !exit) {
        for (let i = 0; i < keys.length; i++) {
            let arr = [];
            exit = true;

            if (geoJson[keys[i]].length > depth) {
                arr.push({
                    value: `(${geoJson[keys[i]][depth].date}) ${geoJson[keys[i]][depth].city}, ${geoJson[keys[i]][depth].state} ${geoJson[keys[i]][depth].country}`
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

        <div className="mt-4">
            <h1 className="display-1 header">Statistics</h1>
            View the stats of the coins.<br /><br />
            <em>Note: Please see the <a href="#/faq">FAQ page</a> regarding how soon submissions will be updated on the grid below.</em><br /><br />

            {Object.keys(data).length > 0 ?
                <Spreadsheet data={data} columnLabels={columns} />
                : <p>No data found</p>}
        </div>
    </div >;
}

export default Stats;
