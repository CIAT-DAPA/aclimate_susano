import React from "react";
import "./FloatingButton.css";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  IconFileDownload,
  IconSatellite,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";

const FloatingButton = ({ type, onClick, isFavorite }) => {
  let icon;
  let label;

  switch (type) {
    case "favorite":
      icon = isFavorite ? <IconStarFilled /> : <IconStar />;
      label = "Favorito";
      break;
    case "download":
      icon = <IconFileDownload />;
      label = "Descargar Datos";
      break;
    case "compare":
      icon = <IconSatellite />;
      label = "Comparar con datos satelitales";
      break;
    default:
      icon = null;
      label = "";
  }

  return (
    <OverlayTrigger
      placement="left"
      overlay={<Tooltip id={`tooltip-${type}`}>{label}</Tooltip>}
    >
      <Button
        variant="primary text-light"
        className={`position-fixed shadow rounded-5 btn-floating-${type}`}
        onClick={onClick}
      >
        {icon}
      </Button>
    </OverlayTrigger>
  );
};

export default FloatingButton;
