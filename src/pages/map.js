import './map.css';
import Header from "./shared/header";
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import geoJson from "../data/pins.json";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);
    const [coinNames, setCoinNames] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState("");
    const [markers, setMarkers] = useState([]);
    const [showCheckbox, setShowCheckbox] = useState(false);
    const [panningIndex, setPanningIndex] = useState(-1);
    const [coords, setCoords] = useState([]);

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

    const onlyShowActiveMarker = function(indexToShow){
        for (let i = 0; i < markers.length; i++){
            const p = markers[i].getPopup();
            
            if (i !== indexToShow && p.isOpen()){
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

    // When we change the selected coin, store relevant
    // data for that coin
    const changeCoin = (event) => {
        event.preventDefault();

        let newCoin = event.target.value;

        if (newCoin === "") {

            // clear anything out
            setSelectedCoin("");
            setCoords([]);
        } else {
            setSelectedCoin(newCoin);
            setCoords(geoJson[newCoin]);
        }
    }

    const show = (event) => {
        setShowCheckbox(event.target.checked);

        if (event.target.checked) {
            // eventually do https://docs.mapbox.com/mapbox-gl-js/example/animate-point-along-route/

            let lineToDraw = [];
            let detailsToDraw = [];
            let offsets = [];
            let m = []; // markers

            for (let i = 0; i < coords.length; i++) {

                detailsToDraw.push({
                    lng: coords[i].lng,
                    lat: coords[i].lat,
                    dte: coords[i].dte
                });

                // check to see if subsequent coin passes are in the same city
                for (let j = i + 1; j < coords.length; j++) {

                    if (coords[j].lng === coords[i].lng &&
                        coords[j].lat === coords[i].lat) {

                        detailsToDraw.push({
                            lng: coords[j].lng,
                            lat: coords[j].lat,
                            dte: coords[j].dte
                        });
                    } else {
                        break;
                    }
                }

                let keys = Object.keys(offsets);

                if (keys.indexOf(`${detailsToDraw[detailsToDraw.length - 1].lng}|${detailsToDraw[detailsToDraw.length - 1].lat}`) === -1) {
                    offsets[`${detailsToDraw[detailsToDraw.length - 1].lng}|${detailsToDraw[detailsToDraw.length - 1].lat}`] = 0; // 0 = no offsets
                } else {
                    offsets[`${detailsToDraw[detailsToDraw.length - 1].lng}|${detailsToDraw[detailsToDraw.length - 1].lat}`]++;
                }




                let html;

                if (detailsToDraw.length === 1) {
                    html = `Person ${i + 1}: ${coords[i].dte}`;
                } else {
                    html = `Persons ${i + 1}-${i + 1 + (detailsToDraw.length - 1)}: ${coords[i].dte} - ${detailsToDraw[detailsToDraw.length - 1].dte}`;
                }

                let offsetValue = 0.0005 * offsets[`${detailsToDraw[detailsToDraw.length - 1].lng}|${detailsToDraw[detailsToDraw.length - 1].lat}`];

                let marker = new mapboxgl.Marker()
                    .setLngLat([coords[i].lng + offsetValue, coords[i].lat])
                    .setPopup(new mapboxgl.Popup().setHTML(html))
                    .addTo(map.current);

                m = [...m, marker];
                //setMarkers(old => [...old, marker]);

                lineToDraw.push([coords[i].lng + offsetValue, coords[i].lat]);

                if (detailsToDraw.length > 1) {
                    i += (detailsToDraw.length - 1); // we - 1 because i++ adds 1 in the for loop
                }

                detailsToDraw = [];
            }

            setMarkers(m);

            let route = {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': lineToDraw
                        }
                    }
                ]
            };

            map.current.addSource('route', {
                'type': 'geojson',
                'data': route
            });

            map.current.addLayer({
                'id': 'route',
                'source': 'route',
                'type': 'line',
                'paint': {
                    'line-width': 2,
                    'line-color': '#007cbf'
                }
            });
        } else {
            map.current.removeLayer("route");
            map.current.removeSource("route");

            let m = markers;
            for (let v = 0; v < m.length; v++) {
                m[v].remove();
            }

            setMarkers([]);
        }
    }

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [lng, lat],
            zoom: zoom
        });

        // Pull names of coins from our data file
        map.current.on("load", () => {
            const coins = Object.keys(geoJson).sort();

            setCoinNames(coins);
        });

        // If the user pans on the map, reset what marker they have focused on
        map.current.on("drag", () => {
            setPanningIndex(-1);
        });
    }, []);

    return (
        <div className="App text-white">
            <Header page={"coinpass"} />
            <div>
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
                                    <input type="checkbox" className="form-check-input" id="showPlaceLabels" onChange={show} value={showCheckbox} />
                                </fieldset>
                            </div>
                            <div className="col">
                                <button className="btn btn-primary" onClick={start}>Start</button>
                            </div>
                            <div className="col">
                                <button className="btn btn-primary" onClick={previous} disabled={panningIndex <= 0 ? "disabled" : ""}>Previous</button>
                            </div>
                            <div className="col">
                                <button className="btn btn-primary" onClick={next} disabled={panningIndex + 1 >= markers.length ? "disabled" : ""}>Next</button>
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
                                    <input type="checkbox" className="form-check-input" id="showPlaceLabels" onChange={show} value={showCheckbox} disabled={selectedCoin === ""} />
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
        </div>
    );
}

export default Map;
