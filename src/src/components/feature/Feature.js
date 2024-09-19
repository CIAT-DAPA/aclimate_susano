import React from "react";
import { Col } from "react-bootstrap";
import "./Feature.css";

function Feature({ title, description, image: ImageIcon, color }) {
  const iconColor = "#283618"; // Define el color del icono aquí, si es estático
  const iconSize = 48; // Definir tamaño del icono para cambios globales

  return (
    <Col
      className={`py-5 px-5 text-center ${
        color === "white" ? "feature-white" : "feature-green"
      }`}
    >
      {/* Renderizado del icono */}
      <ImageIcon size={iconSize} color={iconColor} aria-label={title} />

      {/* Título de la característica */}
      <h5 className="text-dark">{title}</h5>

      {/* Descripción de la característica */}
      <p className="lh-sm text-dark">{description}</p>
    </Col>
  );
}

export default Feature;
