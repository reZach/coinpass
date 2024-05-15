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
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [panningIndex, setPanningIndex] = useState(-1);
  const [coords, setCoords] = useState([]);

  // Call this code when panningIndex is updated;
  // this code moves the camera to the selected pin
  useEffect(() => {
    
    if (markers.length > 0 && panningIndex >= 0) {
      let t = {
        center: [markers[panningIndex]._lngLat.lng, markers[panningIndex]._lngLat.lat],
        zoom: 10,
        pitch: 0,
        bearing: 0
      };
      map.current.flyTo({
        ...t,
        duration: 2000,
        essential: true
      });
    }
  }, [panningIndex])

  // Start the navigation for a coin at the very beginning
  const start = (event) => {
    event.preventDefault();

    setPanningIndex(0);
  }

  // To navigate to the previous location a coin has been
  const previous = (event) => {
    event.preventDefault();

    if (panningIndex > 0) {
      setPanningIndex(panningIndex - 1);
    }
  }

  // To navigate to the next location a coin has been
  const next = (event) => {
    event.preventDefault();

    if (panningIndex < coords.length) {
      setPanningIndex(panningIndex + 1);
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

      for (let i = 0; i < coords.length; i++) {
        let html = `<strong>${selectedCoin}</strong><br />
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
            <div className="row">
              <div className="col">
                <select id="lightPreset" name="lightPreset" onChange={changeCoin}>
                  {[<option key="-1" value="">Choose</option>, coinNames.map((cn, index) => {
                    return <option key={index} value={cn}>{cn}</option>
                  })]}
                </select>
              </div>
              <div className="col">
                <fieldset>
                  <label for="showPlaceLabels">Show</label>
                  <input type="checkbox" id="showPlaceLabels" onChange={show} value={showCheckbox} />
                </fieldset>
              </div>
              <div className="col">
                <button className="btn" onClick={start}>Start</button>
              </div>
              <div className="col">
                <button className="btn" onClick={previous} disabled={panningIndex <= 0 ? "disabled" : ""}>Previous</button>
              </div>
              <div className="col">
                <button className="btn" onClick={next} disabled={panningIndex + 1 >= coords.length ? "disabled" : ""}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
