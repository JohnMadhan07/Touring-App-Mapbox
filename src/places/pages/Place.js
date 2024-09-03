import React from 'react';
// import { useParams } from 'react-router-dom';
import Map from '../../Maps/Maps';
import "./Place.css"

const Place = () => {
  // const { userId } = useParams(); // Extracting the userId parameter from the URL
  const location={
  center: { lat: -25.344, lng: 131.031 },
  zoom: 8}
  return (
    <div>
      <p className='place'>Waterford</p>
      <Map center={location.center} zoom={location.zoom}/>
    </div>
  );
};

export default Place;