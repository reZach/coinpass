import logo from './logo.svg';
import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import geoJson from "./pins.json";

mapboxgl.accessToken = "pk.eyJ1IjoicmVkZ29ibGluMjMiLCJhIjoiY2x2dnA3ODAyMXk2MDJpbzVzd2NtdDVsMiJ9.TBZRwebRR3T9E_4LiWjx8A";

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

    const coins = Object.keys(geoJson);
    console.log(coins);
    coins.forEach(c => {

      const coords = geoJson[c];
      coords.forEach(xy => {
        new mapboxgl.Marker()
          .setLngLat([xy.lng, xy.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`${xy.dte}`))
          .addTo(map.current);
      });      
    });
  }, []);

  return (
    <div className="App">
      <div>
        <div ref={mapContainer} className="map-container" />
      </div>
    </div>
  );
}

export default App;
