import React from "react";
import "./Home.css";
import { Col, Container, Row } from "react-bootstrap";
import Feature from "../../components/feature/Feature";
import { Link } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconMapSearch,
  IconCloudRain,
} from "@tabler/icons-react";

function Home() {
  // Definir colores en una variable para facilitar ajustes globales
  const green = "green";
  const white = "white";

  return (
    <div>
      {/* Sección de bienvenida */}
      <div className="header-bg">
        <Container className="container-header">
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
        </Container>
      </div>

      {/* Sección de características */}
      <Row className="g-0">
        <Feature
          title="Mapa interactivo de estaciones climáticas"
          description="Consulta en un mapa interactivo la ubicación y datos en tiempo real de las estaciones climáticas, incluyendo temperaturas, precipitaciones y más."
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
          description="Compara los datos del dashboard con otras bases de datos climáticas, detectando patrones y obteniendo insights más precisos para tus análisis."
          image={IconCloudRain}
          color={green}
        />
      </Row>
    </div>
  );
}

export default Home;
