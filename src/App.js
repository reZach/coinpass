import logo from './logo.svg';
import './App.css';
import Header from "./header";
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import geoJson from "./data/pins.json";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [coinNames, setCoinNames] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [markers, setMarkers] = useState([]);

  const show = (event) => {
    event.preventDefault();

    console.log(event.target.checked);

    if (event.target.checked) {
      // eventually do https://docs.mapbox.com/mapbox-gl-js/example/animate-point-along-route/



      //console.log(coins);
      coinNames
        .filter(c => c === selectedCoin)
        .forEach(c => {

          const coords = geoJson[c];
          //console.log(coords);
          let lineToDraw = [];

          for (let i = 0; i < coords.length; i++) {
            let html = `<strong>${c}</strong><br />
    Person ${i + 1}: ${coords[i].dte}`;

            let marker = new mapboxgl.Marker()
              .setLngLat([coords[i].lng, coords[i].lat])
              .setPopup(new mapboxgl.Popup().setHTML(html))
              .addTo(map.current);

            setMarkers(old => [...old, marker]);

            lineToDraw.push([coords[i].lng, coords[i].lat]);
          }

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
        });
    } else {
      map.current.removeLayer("route");
      map.current.removeSource("route");

      let m = markers;
      for (let v = 0; v < m.length; v++){
        m[v].remove();
      }

      setMarkers([]);
    }
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on("load", () => {

      const coins = Object.keys(geoJson).sort();

      setCoinNames(coins);
      setSelectedCoin(coins[0]);
    });


  }, []);

  return (
    <div className="App">
      <Header />
      <div>
        <div ref={mapContainer} className="map-container" />
        <div className="map-overlay top">
          <div className="map-overlay-inner">
            <fieldset className="select-fieldset">
              <select id="lightPreset" name="lightPreset">
                {coinNames.map((cn, index) => {
                  return <option key={index} value={cn}>{cn}</option>
                })}
              </select>
            </fieldset>
            <fieldset>
              <label for="showPlaceLabels">Show</label>
              <input type="checkbox" id="showPlaceLabels" onChange={show} />
            </fieldset>
            <div>
              <button className="btn">Start</button>
              <button className="btn">Previous</button>
              <button className="btn">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
