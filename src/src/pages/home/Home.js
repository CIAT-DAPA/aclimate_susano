import React, { useEffect, useState } from "react";
import "./Home.css";
import { Col, Container, Row } from "react-bootstrap";
import Feature from "../../components/feature/Feature";
import { Link } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconMapSearch,
  IconCloudRain,
} from "@tabler/icons-react";
import StationCard from "../../components/stationCard/StationCard";
import Services from "../../services/Services";

function Home() {
  // Definir colores en una variable para facilitar ajustes globales
  const green = "green";
  const white = "white";

  const [stations, setStations] = useState([]);
  const [nearestStation, setNearestStation] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            findNearestStation(userLat, userLon);
          },
          (error) => {
            console.error("Error al obtener la ubicación del usuario:", error);
            setError("Error al obtener la ubicación del usuario");
            setLoading(false);
          }
        );
      } else {
        console.error("Geolocalización no es soportada por este navegador.");
        setError("Geolocalización no es soportada por este navegador.");
        setLoading(false);
      }
    };

    const findNearestStation = (userLat, userLon) => {
      let minDistance = Infinity;
      let nearest = null;

      stations.forEach((station) => {
        const distance = getDistanceFromLatLonInKm(
          userLat,
          userLon,
          station.latitude,
          station.longitude
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearest = station;
        }
      });

      setNearestStation(nearest);
      setLoading(false);
    };

    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radio de la Tierra en km
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distancia en km
      return distance;
    };

    const deg2rad = (deg) => {
      return deg * (Math.PI / 180);
    };
    getUserLocation();
  }, [stations]);

  return (
    <div>
      {/* Sección de bienvenida */}
      <div className="header-bg align-content-center">
        <Container className="container-header pt-3">
          <Row className="justify-content-between flex-column flex-md-row">
            <Col className="col-12 col-md-7 col-lg-5 d-flex flex-column gap-2 mb-5 mb-md-0">
              <h1 className="text-light">Bienvenido a AClimate monitoring</h1>
              <p className="text-light fw-medium">
                Explora y compara los datos de las estaciones en tiempo real con
                otras bases de datos confiables. Simplifica la toma de
                decisiones con información precisa y personalizada al alcance de
                tu mano.
              </p>
              <Link
                to="/estaciones"
                className="btn btn-primary text-light rounded-5 py-2 px-4 fw-semibold"
                aria-label="Revisa los datos"
              >
                Revisa los datos
              </Link>
            </Col>
          </Row>
          <Row className="mt-4 justify-content-around gy-4">
            <StationCard loading={loading} msgError={error} station={nearestStation} />
          </Row>
        </Container>
      </div>

      {/* Sección de características */}
      <Row className="g-0">
        <Feature
          title="Mapa interactivo de estaciones climáticas"
          description="Consulta en un mapa interactivo la ubicación y datos históricos climáticos de las estaciones climatológicas, incluyendo temperaturas, precipitaciones y más."
          image={IconMapSearch}
          color={green}
        />
        <Feature
          title="Dashboard de análisis climático"
          description="Visualiza la temperatura máxima, mínima, precipitaciones y otros datos clave en un dashboard diseñado para el análisis climático en tiempo real."
          image={IconLayoutDashboard}
          color={white}
        />
        <Feature
          title="Comparación de datos climáticos con otras fuentes"
          description="Compara los datos de las estaciones climatológicas con otras bases de datos satelitales como CHIRPS y AgERA5."
          image={IconCloudRain}
          color={green}
        />
      </Row>
    </div>
  );
}

export default Home;
