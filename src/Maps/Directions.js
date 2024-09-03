import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker } from 'react-map-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import 'mapbox-gl/dist/mapbox-gl.css'; // Ensure Mapbox CSS is imported
import './Maps.css';

const apiKey = process.env.REACT_APP_MAPBOX_API_TOKEN;

const mapContainerStyle = {
  width: '50vw',
  height: '50vh',
};

const defaultCenter = { latitude: 52.2593, longitude: -7.1101 };
const destination = { latitude: 53.3440956, longitude: -6.2674862 };

const DirectionsMap = () => {
  const [map, setMap] = useState(null);
  const [distance, setDistance] = useState(null);
  const [calculationTime, setCalculationTime] = useState(null);
  const directionsRef = useRef(null);

  useEffect(() => {
    if (map && !directionsRef.current) {
      // Initialize Mapbox Directions
      const directions = new MapboxDirections({
        accessToken: apiKey,
        unit: 'metric',
        profile: 'mapbox/driving',
        controls: { inputs: false }, // Disable the input forms
      });

      map.addControl(directions, 'top-left');
      directionsRef.current = directions;

      const handleCalculateRoute = () => {
        if (directionsRef.current) {
          const startTime = new Date(); // Start timing

          directionsRef.current.setOrigin([defaultCenter.longitude, defaultCenter.latitude]);
          directionsRef.current.setDestination([destination.longitude, destination.latitude]);

          directionsRef.current.on('route', (e) => {
            if (e.route && e.route.length > 0) {
              const route = e.route[0];
              const routeDistance = route.distance / 1000; // Convert meters to kilometers

              setDistance(`${routeDistance.toFixed(2)} km`);

              const endTime = new Date(); // End timing
              const elapsedTime = (endTime - startTime) / 1000; // Calculate elapsed time in seconds
              setCalculationTime(elapsedTime.toFixed(2)); // Save the elapsed time
            }
          });
        }
      };

      const calculateRouteButton = document.getElementById('direct');
      if (calculateRouteButton) {
        calculateRouteButton.addEventListener('click', handleCalculateRoute);
      }

      return () => {
        if (calculateRouteButton) {
          calculateRouteButton.removeEventListener('click', handleCalculateRoute);
        }
      };
    }
  }, [map]);

  return (
    <div>
      <Map
        initialViewState={{
          latitude: defaultCenter.latitude,
          longitude: defaultCenter.longitude,
          zoom: 10,
        }}
        style={mapContainerStyle}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={apiKey}
        onLoad={(e) => setMap(e.target)}
      >
        <Marker latitude={defaultCenter.latitude} longitude={defaultCenter.longitude} />
        <Marker latitude={destination.latitude} longitude={destination.longitude} />
      </Map>
      <button id="direct" className="calculate-route">
        Calculate Route
      </button>

      {/* Display the distance and route calculation time */}
      {distance && calculationTime && (
        <div>
          <p>Distance: {distance}</p>
          <p>Time to calculate route: {calculationTime} seconds</p>
        </div>
      )}
    </div>
  );
};

export default DirectionsMap;