import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import "./Maps.css";

const apiKey = process.env.REACT_APP_MAPBOX_API_TOKEN;
const mapContainerStyle = {
  width: '50vw',
  height: '50vh',
};

const defaultCenter = {
  lat: 52.2593,
  lng: -7.1101,
};

const Map = () => {
  const mapContainer = useRef(null);
  const markerRef = useRef(null);

  // States
  const [map, setMap] = useState(null);
  const [mapRenderDuration, setMapRenderDuration] = useState(null);
  const [actionDuration, setActionDuration] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = apiKey;

    const startTime = new Date(); // Record the start time for map rendering
    
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: 10,
    });

    newMap.on('load', () => {
      setMap(newMap); // Store map instance in state
      const endTime = new Date(); // Record the end time for map rendering
      setMapRenderDuration((endTime - startTime) / 1000); // Calculate render duration in seconds

      // Add initial marker
      markerRef.current = new mapboxgl.Marker()
        .setLngLat([defaultCenter.lng, defaultCenter.lat])
        .addTo(newMap);
    });

    return () => newMap.remove(); // Cleanup on unmount
  }, []); // Empty dependency array ensures this effect runs only once

  const handlePanAndZoom = () => {
    if (map) {
      const actionStartTime = new Date(); // Record the start time of the action

      const newPosition = { lat: 52.24619711998666, lng: -7.138704504048729 };
      map.jumpTo({
        center: [newPosition.lng, newPosition.lat],
        zoom: 15,
        essential: true,
      });

      markerRef.current.setLngLat([newPosition.lng, newPosition.lat]);

      // Calculate action duration immediately after jumpTo
      const actionEndTime = new Date();
      setActionDuration((actionEndTime - actionStartTime) / 1000); // Calculate duration in seconds
    }
  };

  return (
    <div>
      <div
        id="map"
        ref={mapContainer}
        style={mapContainerStyle}
      ></div>
      <button className="panzoom" onClick={handlePanAndZoom}>
        Pan and Zoom
      </button>
      {mapRenderDuration !== null && (
        <div>Map render duration: {mapRenderDuration} seconds</div>
      )}
      {actionDuration !== null && (
        <div>Action duration: {actionDuration} seconds</div>
      )}
    </div>
  );
};

export default Map;
