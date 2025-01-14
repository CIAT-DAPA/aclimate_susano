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
import { findNearestStation } from "../../utils/Utilities";

const Home = () => {
  const green = "green";
  const white = "white";

  const [stations, setStations] = useState([]);
  const [nearestStation, setNearestStation] = useState(null);
  const [favoriteStation, setFavoriteStation] = useState(null);
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
            const nearest = findNearestStation(userLat, userLon, stations);
            setNearestStation(nearest);
            setLoading(false);
          },
          (error) => {
            console.error("Error al obtener la ubicación del usuario:", error);
            setError(
              "Error al obtener la ubicación del usuario, por favor activa la geolocalización en tu navegador y si ya esta activa, intenta en otro navegador."
            );
            setLoading(false);
          }
        );
      } else {
        console.error("Geolocalización no es soportada por este navegador.");
        setError("Geolocalización no es soportada por este navegador.");
        setLoading(false);
      }
    };

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.length > 0) {
      setFavoriteStation(
        stations.find((station) => station.id === favorites[0])
      );
      return;
    }
    getUserLocation();
  }, [stations]);

  // useEffect(() => {
  //   const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  //   if (favorites.length > 0) {
  //     setFavoriteStation(favorites[0]);
  //   }
  // }, []);

  return (
    <div>
      {/* Sección de bienvenida */}
      <div className="header-bg align-content-center">
        <Container className="container-header pt-3">
          <Row className="justify-content-between flex-column flex-md-row">
            <Col className="col-12 col-md-7 col-lg-5 d-flex flex-column gap-2 mb-5 mb-md-0">
              <h1 className="text-light">Bienvenido a AClimate nicaragua</h1>
              <p className="text-light fw-medium">
                Explora, monitorea y compara los datos de las estaciones
                climátologicas con bases de datos satelitales. Informate sobre
                como ha sido el clima en las regiones.
              </p>
              <Link
                to="/estaciones"
                className="btn btn-primary text-light rounded-5 py-2 px-4 fw-semibold"
                aria-label="Revisa los datos"
              >
                Explora el clima
              </Link>
            </Col>
          </Row>
          <Row className="mt-4 gy-4">
            <StationCard
              loading={loading}
              msgError={error}
              station={favoriteStation || nearestStation}
            />
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
};

export default Home;
