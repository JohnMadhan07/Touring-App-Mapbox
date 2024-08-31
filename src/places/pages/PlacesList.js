import React from "react";
import UsersItem from "./PlacesItem";
import './PlacesList.css'
const PlacesList = (props) => {
  if (props.dummy_places.length === 0) {
    return (
      <div className="center">
        <h2>No User Found</h2>
      </div>
    );
  }
  return (
    <ul className="places-list">
      {props.dummy_places.map((place) => (
        <UsersItem
          key={place.id}
          id={place.id}
          name={place.name}
          image={place.image}
          placecount={place.placecount}
        />
      ))}
    </ul>
  );
};
export default PlacesList;
