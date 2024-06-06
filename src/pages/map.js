import "./map.css";
import Header from "./shared/header";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import pinsData from "../data/pins.json";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function Map() {
    const [disableMap, setDisableMap] = useState(false || mapboxgl.accessToken === null || typeof mapboxgl.accessToken === "undefined"); // Kill switch in case I need to turn off the map
    const mapContainer = useRef(null);
    const map = useRef(null);
    const allKey = useRef("-all-");
    const [lng, setLng] = useState(-92.47);
    const [lat, setLat] = useState(38.25);
    const [zoom, setZoom] = useState(3);
    const [coinNames, setCoinNames] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState("");
    const [markers, setMarkers] = useState([]);
    const [showCheckbox, setShowCheckbox] = useState(false);
    const [panningIndex, setPanningIndex] = useState(-1);
    const [coords, setCoords] = useState([]);

    useEffect(() => {
        if (disableMap || map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [lng, lat],
            zoom: zoom
        });

        // Pull names of coins from our data file
        map.current.on("load", () => {
            let coins = Object.keys(pinsData).sort();

            if (coins.length > 0) {
                coins = [allKey.current, ...coins];
            }

            setCoinNames(coins);
        });

        // If the user pans on the map, reset what marker they have focused on
        map.current.on("drag", () => {
            setPanningIndex(-1);
        });
    }, []);

    // Call this code when panningIndex is updated;
    // this code moves the camera to the selected pin
    useEffect(() => {

        if (markers.length > 0 && panningIndex >= 0) {
            let t = {
                center: [markers[panningIndex]._lngLat.lng, markers[panningIndex]._lngLat.lat],
                zoom: 15,
                pitch: 0,
                bearing: 0
            };
            map.current.flyTo({
                ...t,
                duration: 2000,
                essential: true
            });
        }
    }, [panningIndex]);

    useEffect(() => {
        if (showCheckbox) {

            if (selectedCoin === "") {
                if (typeof map.current.getLayer("route") !== "undefined") {
                    map.current.removeLayer("route");
                }
                if (typeof map.current.getSource("route") !== "undefined") {
                    map.current.removeSource("route");
                }
    
                let m = markers;
                for (let v = 0; v < m.length; v++) {
                    m[v].remove();
                }
    
                setMarkers([]);

                return;
            }

            // eventually do https://docs.mapbox.com/mapbox-gl-js/example/animate-point-along-route/


            let detailsToDraw = [];
            let offsets = [];
            let m = []; // markers
            let coordinates = (allKey.current !== selectedCoin) ? pinsData[selectedCoin] : pinsData;

            setCoords(coordinates);

            // remove existing markers            
            for (let v = 0; v < markers.length; v++) {
                markers[v].remove();
            }


            // When drawing all pins or some lines
            if (coordinates.constructor === Object) {

                let coinKeys = Object.keys(coordinates);
                for (let a = 0; a < coinKeys.length; a++) {

                    for (let i = 0; i < coordinates[coinKeys[a]].length; i++) {

                        detailsToDraw.push({
                            longitude: coordinates[coinKeys[a]][i].longitude,
                            latitude: coordinates[coinKeys[a]][i].latitude,
                            date: coordinates[coinKeys[a]][i].date
                        });

                        // check to see if subsequent coin passes are in the same city
                        for (let j = i + 1; j < coordinates[coinKeys[a]].length; j++) {

                            if (coordinates[coinKeys[a]][j].longitude === coordinates[coinKeys[a]][i].longitude &&
                                coordinates[coinKeys[a]][j].latitude === coordinates[coinKeys[a]][i].latitude) {

                                detailsToDraw.push({
                                    longitude: coordinates[coinKeys[a]][j].longitude,
                                    latitude: coordinates[coinKeys[a]][j].latitude,
                                    date: coordinates[coinKeys[a]][j].date
                                });
                            } else {
                                break;
                            }
                        }

                        let keys = Object.keys(offsets);

                        if (keys.indexOf(`${detailsToDraw[detailsToDraw.length - 1].longitude}|${detailsToDraw[detailsToDraw.length - 1].latitude}`) === -1) {
                            offsets[`${detailsToDraw[detailsToDraw.length - 1].longitude}|${detailsToDraw[detailsToDraw.length - 1].latitude}`] = 0; // 0 = no offsets
                        } else {
                            offsets[`${detailsToDraw[detailsToDraw.length - 1].longitude}|${detailsToDraw[detailsToDraw.length - 1].latitude}`]++;
                        }


                        let html = `Coin: ${coinKeys[a]}<br />`;

                        if (detailsToDraw.length === 1) {
                            html += `Person ${i + 1}: ${coordinates[coinKeys[a]][i].date}`;
                        } else {
                            html += `Persons ${i + 1}-${i + 1 + (detailsToDraw.length - 1)}: ${coordinates[coinKeys[a]][i].date} - ${detailsToDraw[detailsToDraw.length - 1].date}`;
                        }

                        html += `<br />${coordinates[coinKeys[a]][i].city}, ${coordinates[coinKeys[a]][i].state}`;

                        let offsetValue = 0.0005 * offsets[`${detailsToDraw[detailsToDraw.length - 1].longitude}|${detailsToDraw[detailsToDraw.length - 1].latitude}`];

                        let marker = new mapboxgl.Marker()
                            .setLngLat([coordinates[coinKeys[a]][i].longitude + offsetValue, coordinates[coinKeys[a]][i].latitude])
                            .setPopup(new mapboxgl.Popup().setHTML(html))
                            .addTo(map.current);

                        m = [...m, marker];

                        //lineToDraw.push([coordinates[coinKeys[a]][i].longitude + offsetValue, coordinates[coinKeys[a]][i].latitude]);

                        // We adjust i to account for if we are grouping multiple
                        // "passes" in a single pin on the map. 
                        if (detailsToDraw.length > 1) {
                            i += (detailsToDraw.length - 1); // We subtract 1 so i lands on the proper next element to process in the array
                        }

                        detailsToDraw = [];
                    }
                }

                setMarkers(m);

                // Remove any existing route if already on the map
                if (typeof map.current.getLayer("route") !== "undefined") {
                    map.current.removeLayer("route");
                }
                if (typeof map.current.getSource("route") !== "undefined") {
                    map.current.removeSource("route");
                }

            } else {
                let lineToDraw = [];

                for (let i = 0; i < coordinates.length; i++) {

                    detailsToDraw.push({
                        longitude: coordinates[i].longitude,
                        latitude: coordinates[i].latitude,
                        date: coordinates[i].date
                    });

                    // check to see if subsequent coin passes are in the same city
                    for (let j = i + 1; j < coordinates.length; j++) {

                        if (coordinates[j].longitude === coordinates[i].longitude &&
                            coordinates[j].latitude === coordinates[i].latitude) {

                            detailsToDraw.push({
                                longitude: coordinates[j].longitude,
                                latitude: coordinates[j].latitude,
                                date: coordinates[j].date
                            });
                        } else {
                            break;
                        }
                    }

                    let keys = Object.keys(offsets);

                    if (keys.indexOf(`${detailsToDraw[detailsToDraw.length - 1].longitude}|${detailsToDraw[detailsToDraw.length - 1].latitude}`) === -1) {
                        offsets[`${detailsToDraw[detailsToDraw.length - 1].longitude}|${detailsToDraw[detailsToDraw.length - 1].latitude}`] = 0; // 0 = no offsets
                    } else {
                        offsets[`${detailsToDraw[detailsToDraw.length - 1].longitude}|${detailsToDraw[detailsToDraw.length - 1].latitude}`]++;
                    }




                    let html;

                    if (detailsToDraw.length === 1) {
                        html = `Person ${i + 1}: ${coordinates[i].date}`;
                    } else {
                        html = `Persons ${i + 1}-${i + 1 + (detailsToDraw.length - 1)}: ${coordinates[i].date} - ${detailsToDraw[detailsToDraw.length - 1].date}`;
                    }

                    html += `<br />${coordinates[i].city}, ${coordinates[i].state}`;

                    let offsetValue = 0.0005 * offsets[`${detailsToDraw[detailsToDraw.length - 1].longitude}|${detailsToDraw[detailsToDraw.length - 1].latitude}`];

                    let marker = new mapboxgl.Marker()
                        .setLngLat([coordinates[i].longitude + offsetValue, coordinates[i].latitude])
                        .setPopup(new mapboxgl.Popup().setHTML(html))
                        .addTo(map.current);


                    marker.getElement().addEventListener("click", function (event) {
                        console.log(event);
                    });
                    // marker.getElement().addEventListener("click", (event) => {
                    //     console.log("event");
                    // });

                    m = [...m, marker];

                    lineToDraw.push([coordinates[i].longitude + offsetValue, coordinates[i].latitude]);

                    // We adjust i to account for if we are grouping multiple
                    // "passes" in a single pin on the map. 
                    if (detailsToDraw.length > 1) {
                        i += (detailsToDraw.length - 1); // We subtract 1 so i lands on the proper next element to process in the array
                    }

                    detailsToDraw = [];
                }

                setMarkers(m);

                let route = {
                    "type": "FeatureCollection",
                    "features": [
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "LineString",
                                "coordinates": lineToDraw
                            }
                        }
                    ]
                };

                // Remove any existing route if already on the map
                if (typeof map.current.getLayer("route") !== "undefined") {
                    map.current.removeLayer("route");
                }
                if (typeof map.current.getSource("route") !== "undefined") {
                    map.current.removeSource("route");
                }

                map.current.addSource("route", {
                    "type": "geojson",
                    "data": route
                });

                map.current.addLayer({
                    "id": "route",
                    "source": "route",
                    "type": "line",
                    "paint": {
                        "line-width": 2,
                        "line-color": "#007cbf"
                    }
                });
            }

        } else {

            if (typeof map.current.getLayer("route") !== "undefined") {
                map.current.removeLayer("route");
            }
            if (typeof map.current.getSource("route") !== "undefined") {
                map.current.removeSource("route");
            }

            let m = markers;
            for (let v = 0; v < m.length; v++) {
                m[v].remove();
            }

            setMarkers([]);
        }
    }, [selectedCoin, showCheckbox]);

    const onlyShowActiveMarker = function (indexToShow) {
        for (let i = 0; i < markers.length; i++) {
            const p = markers[i].getPopup();

            if (i !== indexToShow && p.isOpen()) {
                markers[i].togglePopup();
            } else if (i === indexToShow && !p.isOpen()) {
                markers[i].togglePopup();
            }
        }
    }

    // Start the navigation for a coin at the very beginning
    const start = (event) => {
        event.preventDefault();

        setPanningIndex(0);
        onlyShowActiveMarker(0);
    }

    // To navigate to the previous location a coin has been
    const previous = (event) => {
        event.preventDefault();

        if (panningIndex > 0) {
            setPanningIndex(panningIndex - 1);
            onlyShowActiveMarker(panningIndex - 1);
        }
    }

    // To navigate to the next location a coin has been
    const next = (event) => {
        event.preventDefault();

        if (panningIndex < coords.length) {
            setPanningIndex(panningIndex + 1);
            onlyShowActiveMarker(panningIndex + 1);
        }
    }

    const changeShow = (event) => {
        event.preventDefault();

        setShowCheckbox(event.target.checked);
    }

    // When we change the selected coin, store relevant
    // data for that coin
    const changeCoin = (event) => {
        event.preventDefault();

        let newCoin = event.target.value;

        setSelectedCoin(newCoin);
    }

    if (disableMap) {
        return (
            <div className="App">
                <Header page={"map"} />
                <div className="mt-4">
                    <div className="row">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-8 col-12">
                            <h1 className="display-1 header">We are sorry!</h1>
                            This project has no external funding and is limited to a certain number of map loads per month.
                            We have exceeded the allowed free limit of map loads and need to turn off the rendered map until month's end in order
                            to be able to keep this website live and operational.<br /><br />

                            Actions can still be submitted <a href="#/action">here</a>,
                            and submissions will be reflected on the <a href="#/stats">stats page</a> when website data is refreshed based on
                            the website update schedule defined on the <a href="#/faq">FAQ page</a>.
                        </div>
                        <div className="col-sm-2"></div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="App">
                <Header page={"map"} />
                <div ref={mapContainer} className="map-container" />
                <div className="map-overlay bottom text-black">
                    <div className="map-overlay-inner container">
                        <div className="row d-none d-sm-flex">
                            <div className="col">
                                <fieldset>
                                    <label style={{ alignSelf: "center" }}>Coin</label>
                                    <select id="lightPreset" name="lightPreset" className="form-select" style={{ minWidth: "128px" }} onChange={changeCoin}>
                                        {[<option key="-1" value="">Choose</option>, coinNames.map((cn, index) => {
                                            return <option key={index} value={cn}>{cn}</option>
                                        })]}
                                    </select>
                                </fieldset>
                            </div>
                            <div className="col" style={{ alignSelf: "center" }}>
                                <fieldset>
                                    <label>Show</label>
                                    <input type="checkbox" role="switch" className="form-check-input" id="showPlaceLabels" onChange={changeShow} disabled={selectedCoin === ""} checked={showCheckbox} />
                                </fieldset>
                            </div>
                            <div className="col">
                                <button className="btn btn-primary" onClick={start} disabled={!showCheckbox || selectedCoin === allKey.current}>Start</button>
                            </div>
                            <div className="col">
                                <button className="btn btn-primary" onClick={previous} disabled={(panningIndex <= 0 || (selectedCoin === allKey.current)) ? "disabled" : ""}>Previous</button>
                            </div>
                            <div className="col">
                                <button className="btn btn-primary" onClick={next} disabled={((panningIndex + 1 >= markers.length) || selectedCoin === allKey.current) ? "disabled" : ""}>Next</button>
                            </div>
                        </div>
                        <div className="row mb-2 d-flex d-sm-none">
                            <div className="col">
                                <fieldset>
                                    <label style={{ alignSelf: "center" }}>Coin</label>
                                    <select id="lightPreset" name="lightPreset" className="form-select" style={{ minWidth: "128px" }} onChange={changeCoin}>
                                        {[<option key="-1" value="">-choose-</option>, coinNames.map((cn, index) => {
                                            return <option key={index} value={cn}>{cn}</option>
                                        })]}
                                    </select>
                                </fieldset>
                            </div>
                            <div className="col" style={{ alignSelf: "center" }}>
                                <fieldset>
                                    <label>Show</label>
                                    <input type="checkbox" className="form-check-input" id="showPlaceLabels" onChange={changeShow} checked={showCheckbox} disabled={selectedCoin === ""} />
                                </fieldset>
                            </div>
                        </div>
                        <div className="row d-flex d-sm-none">
                            <div className="col">
                                <button className="btn btn-primary" onClick={start} disabled={showCheckbox === false}>Start</button>
                            </div>
                            <div className="col">
                                <button className="btn btn-primary" onClick={previous} disabled={panningIndex <= 0 ? "disabled" : ""}>Previous</button>
                            </div>
                            <div className="col">
                                <button className="btn btn-primary" onClick={next} disabled={panningIndex + 1 >= markers.length ? "disabled" : ""}>Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Map;
