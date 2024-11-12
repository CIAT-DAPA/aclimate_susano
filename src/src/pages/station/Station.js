import React, { useState, useEffect, useRef } from "react";
import "./Station.css";
import { Modal, Spinner } from "react-bootstrap";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import Services from "../../services/Services";
import L from "leaflet";
import SearchBar from "../../components/searchBar/SearchBar";
import StationPopup from "../../components/stationPopup/StationPopup";

const MapCenter = ({ stations }) => {
  const map = useMap();

  useEffect(() => {
    if (stations.length > 0) {
      const bounds = L.latLngBounds(
        stations.map((station) => [station.latitude, station.longitude])
      );
      map.fitBounds(bounds);
    }
  }, [stations, map]);

  return null;
};

function Station() {
  const [stations, setStations] = useState([]);
  const [lastDataStations, setLastDataStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await Services.getAllWeatherStations();
        const filteredStations = response.filter(
          (item) => item.origin === "WEATHERLINK"
        );
        setStations(filteredStations);
      } catch (error) {
        console.error("Error al cargar las estaciones:", error);
        setError("Error al cargar las estaciones");
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    if (stations.length === 0) return;

    const fetchLastDailyWeather = async () => {
      try {
        setLoading(true);
        const idsStations = stations.map((station) => station.id).join(",");
        const response = await Services.getLastDailyWeather(idsStations);
        setLastDataStations(response);
      } catch (error) {
        console.error(
          "Error al cargar la última información de las estaciones:",
          error
        );
        setError("Error al cargar la última información de las estaciones");
      } finally {
        setLoading(false);
      }
    };
    fetchLastDailyWeather();
  }, [stations]);

  const handleStationClick = (station) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([station.latitude, station.longitude], 12);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Modal
        show={loading}
        backdrop="static"
        keyboard={false}
        centered
        size="sm"
      >
        <Modal.Body className="d-flex align-items-center">
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
        {stations.map((station) => {
          const lastData = lastDataStations.find(
            (item) => item.weather_station === station.id
          );
          return (
            <StationPopup
              key={station.id}
              station={station}
              lastData={lastData}
            />
          );
        })}
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
