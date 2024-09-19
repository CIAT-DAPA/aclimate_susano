import React from "react";
import { Col } from "react-bootstrap";
import "./Feature.css";

function Feature(props) {
  return (
    <Col
      className={`py-5 px-5 text-center ${
        props.color === "white" ? "feature-white" : "feature-green"
      }`}
    >
      <props.image size={48} color='#283618' />
      <h5 className="text-dark">{props.title}</h5>
      <p className="lh-sm text-dark">{props.description}</p>
    </Col>
  );
}

export default Feature;
