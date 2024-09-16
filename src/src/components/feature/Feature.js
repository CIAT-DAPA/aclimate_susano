import React from "react";
import { Col } from "react-bootstrap";
import "./Feature.css";

function Feature(props) {
  return (
    <Col
      className={`py-5 px-5 text-center ${
        props.color === "white" ? "feature-white" : "feature-blue"
      }`}
    >
      <img src={props.image} alt={props.title} className="icon-feature" />
      <h5>{props.title}</h5>
      <p className="lh-sm">{props.description}</p>
    </Col>
  );
}

export default Feature;
