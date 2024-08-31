import React from "react";
import PlacesList from "./PlacesList";
const Places = () => {
  const places = [
    {
      id: "U1",
      name: "Waterford",
      image: "waterford.jpg",
      placecount: 1,
    },
  ];
  return <PlacesList dummy_places={places} />;
};
export default Places;
