import React from "react";
import Avatar from "../../shared/components/UIElements/Avatar";
import { Link } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import "./PlacesItem.css";

const PlacesItem = (props) => {
  return (
    <li className="place-item">
      <Card className="place-item__content">
        <Link to={`/${props.id}/place`}>
          <div className="place-item__image">
            <Avatar image={props.image} alt={props.name} />
          </div>
          <div className="place-item__info">
            <h2>{props.name}</h2>
          </div>
        </Link>
      </Card>
    </li>
  );
};
export default PlacesItem;
