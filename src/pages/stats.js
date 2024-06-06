import "./stats.css";
import Header from "./shared/header";
import Spreadsheet from "react-spreadsheet";
import React, { useRef, useEffect, useState } from "react";
import geoJson from "../data/pins.json";

function Stats() {
    
    const keys = Object.keys(geoJson).sort();

    const columns = [...keys];
    let rows = [];
    let spreadsheet = [];

    let largestKey = -1;
    let largestKeyIndex = -1;
    for (let a = 0; a < keys.length; a++) {
        if (geoJson[keys[a]].length > largestKey) {
            largestKey = geoJson[keys[a]].length;
            largestKeyIndex = a;
        }
    }

    for (let depth = 0; depth < largestKey; depth++) {
        rows.push(`Person ${depth + 1}`);
        let arrayOfData = [];

        for (let i = 0; i < keys.length; i++) {
            let parentArray = geoJson[keys[i]];

            if (parentArray.length <= depth) {
                arrayOfData.push({
                    value: ""
                });                
            } else {
                let element = parentArray[depth];

                arrayOfData.push({
                    value: `(${element.date}) ${element.city}, ${element.state} ${element.country}`
                });
            }
        }

        spreadsheet.push([...arrayOfData]);
    }

    // set everything to readonly
    for (let i = 0; i < spreadsheet.length; i++) {
        for (let j = 0; j < spreadsheet[i].length; j++) {
            spreadsheet[i][j].readOnly = true;
        }
    }

    return <div className="App">
        <Header page={"stats"} />

        <div className="mt-4">
            <h1 className="display-1 header">Statistics</h1>
            View the stats of the coins.<br /><br />
            <em>Note: Please see the <a href="#/faq">FAQ page</a> regarding how soon submissions will be updated on the grid below.</em><br /><br />

            {Object.keys(spreadsheet).length > 0 ?
                <Spreadsheet data={spreadsheet} columnLabels={columns} rowLabels={rows} />
                : <p>No data found</p>}
        </div>
    </div >;
}

export default Stats;
