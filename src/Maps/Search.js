import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import './Maps.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_TOKEN;

const MapboxSearch = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const geocoder = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchDuration, setSearchDuration] = useState(null);
  const searchStartTime = useRef(null);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-7.1101, 52.2593], // Default center coordinates
        zoom: 10, // Default zoom level
      });

      geocoder.current = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false, 
        placeholder: 'Enter a location',
      });

      map.current.addControl(geocoder.current);

      geocoder.current.on('results', () => {
        searchStartTime.current = performance.now();
      });

      geocoder.current.on('result', (e) => {
        const { result } = e;
        const [lng, lat] = result.center;

        setSelectedPlace({
          name: result.text,
          position: { lat, lng },
        });

        // Center map and zoom into the searched location
        map.current.jumpTo({
          center: [lng, lat],
          zoom: 15,
        });

        // Add a marker to the search result
        new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current);

        // Calculate and set the search duration in seconds
        const endTime = performance.now();
        const durationInSeconds = (endTime - searchStartTime.current) / 1000;
        setSearchDuration(durationInSeconds);

        // Reset the start time
        searchStartTime.current = null;
      });
    }

    return () => map.current && map.current.remove();
  }, []);

  return (
    <div>
      {/* Map container */}
      <div ref={mapContainer} style={{ width: '50vw', height: '50vh', position: 'relative' }} />

      {/* Search box container */}
      <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)' }}>
        <input
          type="text"
          placeholder="Enter a location"
          className="search-box"
          style={{
            boxSizing: 'border-box',
            border: '1px solid transparent',
            width: '240px',
            height: '32px',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchStartTime.current = performance.now();
            }
          }}
        />
      </div>

      {selectedPlace && (
        <div className="search-details">
          Selected place: {selectedPlace.name}
        </div>
      )}

      {searchDuration !== null && (
        <div className="search-duration">
          Search completed in {searchDuration.toFixed(2)} seconds
        </div>
      )}
    </div>
  );
};

export default MapboxSearch;




