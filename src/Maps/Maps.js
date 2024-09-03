import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Maps.css'; // Ensure you have a corresponding CSS file if needed

const apiKey = process.env.REACT_APP_MAPBOX_API_TOKEN;

const mapContainerStyle = {
  width: '50vw',
  height: '50vh',
};

const defaultCenter = {
  latitude: 52.2593,
  longitude: -7.1101,
};

const MapboxComponent = () => {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [mapRenderStartTime, setMapRenderStartTime] = useState(null);
  const [actionStartTime, setActionStartTime] = useState(null);
  const [actionDuration, setActionDuration] = useState(null);
  const [mapRenderDuration, setMapRenderDuration] = useState(null);

  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRenderStartTime) {
      // Calculate the time taken for the initial map render
      const currentTime = new Date();
      const elapsedTime = (currentTime - mapRenderStartTime) / 1000; // Convert milliseconds to seconds
      setMapRenderDuration(elapsedTime);
    }
  }, [mapRenderStartTime]);

  useEffect(() => {
    if (actionStartTime) {
      // Calculate the time taken for the action (panning and zooming)
      const currentTime = new Date();
      const elapsedTime = (currentTime - actionStartTime) / 1000; // Convert milliseconds to seconds
      setActionDuration(elapsedTime);
    }
  }, [actionStartTime]);

  const handlePanAndZoom = () => {
    const newPosition = { latitude: 52.24619711998666, longitude: -7.138704504048729 };
    if (map) {
      setActionStartTime(new Date());
      map.jumpTo({
        center: [newPosition.longitude, newPosition.latitude],
        zoom: 15,
        essential: true
      });
      setMarkerPosition(newPosition);
    }
  };

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
        onLoad={(e) => {
          setMap(e.target);
          setMapRenderStartTime(new Date());
        }}
        ref={mapRef}
      >
        <Marker latitude={defaultCenter.latitude} longitude={defaultCenter.longitude} />
        <Marker latitude={markerPosition.latitude} longitude={markerPosition.longitude} />
      </Map>
      <button id="panzoom" className="panzoom" onClick={handlePanAndZoom}>Pan and Zoom</button>
      {mapRenderDuration && <div>Map render duration: {mapRenderDuration} seconds</div>}
      {actionDuration && <div>Action duration: {actionDuration} seconds</div>}
    </div>
  );
};

export default MapboxComponent;
