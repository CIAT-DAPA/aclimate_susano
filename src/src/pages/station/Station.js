import React, { useState, useEffect, useRef } from "react";
import "./Station.css";
import { Modal, Spinner } from "react-bootstrap";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
} from "react-leaflet";
import Services from "../../services/Services";
import L from "leaflet";
import { IconChartDonut } from "@tabler/icons-react";
import SearchBar from "../../components/searchBar/SearchBar";
import { Link } from "react-router-dom";

function Station() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true); // Manejo de estado de carga
  const [error, setError] = useState(null); // Manejo de errores
  const mapRef = useRef(null);

  const iconMarker = new L.Icon({
    iconUrl: require("../../assets/img/marker.png"),
    iconSize: [48, 48],
  });

  useEffect(() => {
    // Llamada a la API para obtener las estaciones
    Services.getAllWeatherStations()
      .then((response) => {
        const filteredStations = response.filter(
          (item) => item.origin === "CHIRPS y ERA-5"
        );
        setStations(filteredStations);
        setLoading(false); // Marcar como cargado
      })
      .catch((error) => {
        console.error("Error al cargar las estaciones:", error);
        setError("Error al cargar las estaciones");
        setLoading(false); // Marcar como cargado aunque haya error
      });
  }, []);

  const MapCenter = ({ stations }) => {
    const map = useMap();

    useEffect(() => {
      if (stations.length > 0) {
        const bounds = L.latLngBounds(
          stations.map((station) => [station.latitude, station.longitude])
        );
        map.fitBounds(bounds); // Ajustar el mapa a los límites de las estaciones
      }
    }, [stations, map]);

    return null; // No es necesario renderizar nada
  };

  const handleStationClick = (station) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([station.latitude, station.longitude], 12);
    }
  };

  const renderPopupData = (station) => (
    <Marker
      position={[station.latitude, station.longitude]}
      key={station.id}
      icon={iconMarker}
    >
      <Popup closeButton={false} className="popup ">
        <div className="text-dark">
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="fw-medium mb-0 text-nowrap">
              Estación {station.name}
            </h6>
          </div>
          <p className="mt-0 mb-2">Fecha: 32</p>
        </div>
        <table className="fs-6 text-nowrap w-100 text-dark">
          <tbody>
            <tr>
              <td className="d-flex align-items-center me-2">
                Temperatura máxima:
              </td>
              <td>432</td>
            </tr>
            <tr>
              <td className="d-flex align-items-center me-2">
                Temperatura mínima:
              </td>
              <td>432</td>
            </tr>
            <tr>
              <td className="d-flex align-items-center me-2">Precipitación:</td>
              <td>432</td>
            </tr>
            <tr>
              <td className="d-flex align-items-center me-2">
                Radiación solar:
              </td>
              <td>432</td>
            </tr>
          </tbody>
        </table>
        <div className="d-flex justify-content-between flex-column align-items-end mt-3">
          <Link
            to={`/dashboard/${station.id}`}
            className="btn btn-primary btn-sm text-light rounded-3 fw-medium d-flex align-items-center justify-content-between px-2 py-2 mx-2"
            aria-label="Data"
          >
            <IconChartDonut stroke={2} className="me-2" />
            Data
          </Link>
        </div>
      </Popup>
      <Tooltip direction="right" offset={[0, -5]} opacity={1} permanent>
        {station.name}
      </Tooltip>
    </Marker>
  );

  if (error) {
    return <p>{error}</p>; // Mostrar mensaje de error
  }

  return (
    <>
      {/* Modal de loading */}
      <Modal
        show={loading}
        backdrop="static"
        keyboard={false}
        centered
        size="sm"
      >
        <Modal.Body className="d-flex align-items-center ">
          <Spinner animation="border" role="status" className="me-2" />
          Obteniendo estaciones...
        </Modal.Body>
      </Modal>
      <MapContainer
        style={{ height: "93vh", width: "100%" }}
        className="map-monitoring"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        {stations.map((station) => renderPopupData(station))}
        <MapCenter stations={stations} />
      </MapContainer>
      <SearchBar
        bigSize={true}
        stations={stations}
        onStationClick={handleStationClick}
      />
    </>
  );
}

export default Station;
