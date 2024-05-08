import logo from './logo.svg';
import './App.css';
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

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on("load", () => {

      // eventually do https://docs.mapbox.com/mapbox-gl-js/example/animate-point-along-route/

      const coins = Object.keys(geoJson);
      //console.log(coins);
      coins.forEach(c => {

        const coords = geoJson[c];
        //console.log(coords);
        let lineToDraw = [];

        for (let i = 0; i < coords.length; i++) {
          let html = `<strong>${c}</strong><br />
          Person ${i + 1}: ${coords[i].dte}`;

          new mapboxgl.Marker()
            .setLngLat([coords[i].lng, coords[i].lat])
            .setPopup(new mapboxgl.Popup().setHTML(html))
            .addTo(map.current);

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
    });


  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>text</h2>
      </header>
      <div>
        <div ref={mapContainer} className="map-container" />
      </div>
    </div>
  );
}

export default App;
