import React, { useEffect, useState } from "react";
import "./StationCard.css";
import { Card, Col, Spinner } from "react-bootstrap";
import { IconDroplet, IconMapPin, IconSun } from "@tabler/icons-react";
import Services from "../../services/Services";

function StationCard({ loading, msgError, station }) {
  const [lastDataStation, setLastDataStation] = useState();

  console.log(station);

  useEffect(() => {
    if (!station) return;

    const fetchLastDailyWeather = async () => {
      try {
        const idStations = station.id;
        const response = await Services.getLastDailyWeather(idStations);
        setLastDataStation(response);
        console.log(response);
      } catch (error) {
        console.error(
          "Error al cargar la última información de las estaciones:",
          error
        );
      } finally {
      }
    };
    fetchLastDailyWeather();
  }, [station]);

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { weekday: "long" });
  };

  return (
    <Col className="col-12 col-md-6 col-xl-4">
      <Card className="position-relative overflow-hidden border-0">
        {/* Onda SVG */}
        <div className="wave1">
          <svg
            width="177"
            height="95"
            viewBox="0 0 355 190"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M385.398 12.4147L0 4.31812C14.6818 32.8181 56.8561 96.2594 104.446 99.3181C141.061 103.276 257.166 119.359 282.031 136.832C311.989 157.883 368.035 187.301 385.398 190V12.4147Z"
              fill="#411010"
            />
            <path
              d="M434.517 9.71582L444.503 158.963C357.599 136.832 302.812 121.449 256.932 89.3323C211.051 57.2158 149.787 82.0454 103.097 71.2499C65.7443 62.6135 54.0672 29.6874 52.8977 14.3039L434.517 9.71582Z"
              fill="#8D5D33"
            />
            <path
              d="M398.082 0H32.926C47.6078 28.5 146.458 41.7424 194.048 44.8011C230.663 48.7595 308.102 62.1818 324.943 84.2046C341.784 106.227 380.72 117.131 398.082 119.83V0Z"
              fill="#D2A859"
            />
          </svg>
        </div>
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
            <p>Cargando datos...</p>
          </div>
        ) : msgError ? (
          <div className="text-center my-5">
            <p>{msgError}</p>
          </div>
        ) : station ? (
          <Card.Body className="position-relative">
            <div className="d-flex justify-content-between">
              <div className="">
                <div className="mb-4">
                  <h4 className="mb-0">{station.name}</h4>
                  <span>
                    {lastDataStation?.climaticData
                      ? lastDataStation.climaticData
                          .find((item) => item.measure === "t_min")
                          ?.value.toFixed(1) ?? "N/A"
                      : "N/A"}{" "}
                    -{" "}
                    {lastDataStation?.climaticData
                      ? lastDataStation.climaticData
                          .find((item) => item.measure === "t_max")
                          ?.value.toFixed(1) ?? "N/A"
                      : "N/A"}
                  </span>
                </div>
                <div className="d-flex flex-column gap-1">
                  <span className="d-flex ">
                    <IconDroplet size={24} className="me-2" />
                    {lastDataStation?.climaticData
                      ? lastDataStation.climaticData
                          .find((item) => item.measure === "prec")
                          ?.value.toFixed(1) ?? "N/A"
                      : "N/A"}{" "}
                    mm
                  </span>
                  <span className="d-flex">
                    <IconSun size={24} className="me-2" />
                    {lastDataStation?.climaticData
                      ? lastDataStation.climaticData
                          .find((item) => item.measure === "sol_rad")
                          ?.value.toFixed(1) ?? "N/A"
                      : "N/A"}{" "}
                    M/J
                  </span>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-between align-items-end">
                <div className="d-flex flex-column align-items-end">
                  <span>
                    {lastDataStation?.date
                      ? getDayOfWeek(lastDataStation.date)
                      : "N/A"}
                  </span>
                  <span>{lastDataStation?.date ?? "N/A"}</span>
                </div>
                <div>
                  <span>
                    <IconMapPin size={24} className="me-2" />
                    {station.municipality}, {station.state}	
                  </span>
                </div>
              </div>
            </div>
          </Card.Body>
        ) : (
          <div className="text-center my-5">
            <p>No se ha seleccionado ninguna estación</p>
          </div>
        )}
      </Card>
    </Col>
  );
}

export default StationCard;
