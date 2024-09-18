import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchBar/SearchBar";
import Services from "../../services/Services";
import "./Dashboard.css";

function Dashboard() {
  const [stations, setStations] = useState([]);
  const [currentStation, setCurrentStation] = useState([]);
  const { idWS } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    //Call to API to get stations for the search bar
    Services.get_all_weatherStation()
      .then((response) => {
        const filteredResponseByCHIRPS = response.filter(
          (item) => item.origin === "CHIRPS y ERA-5"
        );
        const currentStation = filteredResponseByCHIRPS.find(
          (item) => item.id === idWS
        );
        setStations(filteredResponseByCHIRPS);
        setCurrentStation(currentStation);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleStationClick = (station) => {
    navigate(`/dashboard/${station.id}`);
    setCurrentStation(station);
  };

  return (
    <div>
      <Container fluid className="p-3 bg-dashboard">
        <SearchBar
          stations={stations}
          onStationClick={handleStationClick}
          dashboard
        />
        <Col className="bg-white rounded p-4 my-2">
          <div className="d-flex justify-content-between mb-2">
            <Form.Select aria-label="Periodo de tiempo" className="w-auto">
              <option>Últimos 7 días</option>
              <option value="1">Últimos 15 días</option>
              <option value="2">Últimos 30 días</option>
            </Form.Select>
            <Button variant="primary">Comparar con datos estacionales</Button>
          </div>

          <h4>{currentStation.name}</h4>
          <hr />
          {/* Aquí iría el componente del mapa */}
          <div
            style={{
              height: "300px",
              backgroundColor: "#e6f0ff",
              borderRadius: "10px",
              position: "relative",
            }}
          >
            {/* Icono del marcador */}
            <div
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: "#007bff",
                borderRadius: "50%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
        </Col>

        {/* Segunda Sección - Gráficas de temperatura */}
        <Row>
          <Col md={6} className="mb-4">
            <div className="bg-light rounded p-4">
              <h5>Temperatura máxima</h5>
              <hr />
              {/* Aquí iría la gráfica de temperatura máxima */}
              <div
                style={{ height: "200px", backgroundColor: "#f8f9fa" }}
              ></div>
            </div>
          </Col>

          <Col md={6} className="mb-4">
            <div className="bg-light rounded p-4">
              <h5>Temperatura mínima</h5>
              <hr />
              {/* Aquí iría la gráfica de temperatura mínima */}
              <div
                style={{ height: "200px", backgroundColor: "#f8f9fa" }}
              ></div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
