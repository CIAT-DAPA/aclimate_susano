import React from "react";
import "./Home.css";
import { Col, Container, Row } from "react-bootstrap";
import logo from "../../assets/img/logo.png";
import Feature from "../../components/feature/Feature";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div className="header-bg">
        <Container className="container-header">
          <Row className="justify-content-between flex-column flex-md-row">
            <Col className="col-12 col-md-7 col-lg-5 d-flex flex-column gap-2 mb-5 mb-md-0">
              <h1 className="text-light ">Bienvenido a AClimate monitoring</h1>
              <p className="text-light ">
                Explora y compara los datos de las estaciones en tiempo real con
                otras bases de datos confiables. Simplifica la toma de
                decisiones con información precisa y personalizada al alcance de
                tu mano.
              </p>
              <Link
                type="button"
                className="btn btn-primary text-white rounded-5 py-2 px-4 fw-medium"
                style={{ width: "fit-content" }}
                to="/estaciones"
              >
                Revisa los datos
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      <Row className="g-0">
        <Feature
          title="Feature 1"
          description="Ex ea fugiat duis eu amet deserunt non. Sint anim velit non Lorem aute pariatur commodo dolor cillum qui proident occaecat. "
          image={logo}
          color="blue"
        />
        <Feature
          title="Feature 2"
          description="Exercitation pariatur amet occaecat Lorem veniam cupidatat reprehenderit enim commodo dolor. Magna eiusmod nisi quis mollit consectetur exercitation velit nostrud."
          image={logo}
          color="white"
        />
        <Feature
          title="Feature 3"
          description="Voluptate sunt est proident et non laborum commodo do dolor esse elit. Sunt pariatur fugiat ullamco et exercitation aliquip minim."
          image={logo}
          color="blue"
        />
      </Row>
    </div>
  );
}

export default Home;
