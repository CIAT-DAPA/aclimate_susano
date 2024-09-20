import React, { useState, useEffect, useMemo } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchBar/SearchBar";
import Services from "../../services/Services";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "./Dashboard.css";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState({
    tempMax: [],
    tempMin: [],
    precipitation: [],
    solRad: [],
  });
  const [stations, setStations] = useState([]);
  const [currentStation, setCurrentStation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { idWS } = useParams();
  const navigate = useNavigate();

  const iconMarker = new L.Icon({
    iconUrl: require("../../assets/img/marker.png"),
    iconSize: [48, 48],
  });

  useEffect(() => {
    const fetchStations = async () => {
      setIsLoading(true);
      try {
        const response = await Services.getAllWeatherStations();
        const filteredStations = response.filter(
          (item) => item.origin === "CHIRPS y ERA-5"
        );
        const station = filteredStations.find((item) => item.id === idWS);
        setStations(filteredStations);
        setCurrentStation(station);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStations();
  }, [idWS]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentStation) return;
      setIsLoading(true);
      try {
        const response = await Services.getDailyWeather(12, 2022, idWS);
        const parsedData = parseWeatherData(
          response.daily_readings,
          response.month,
          response.year
        );
        setData(parsedData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentStation, idWS]);

  const parseWeatherData = (readings, month, year) => {
    const result = {
      tempMax: [],
      tempMin: [],
      precipitation: [],
      solRad: [],
    };

    readings.forEach((reading) => {
      const dayLabel = `${reading.day}/${month}/${year}`;
      result.tempMax.push({
        label: dayLabel,
        value:
          reading.data.find((measure) => measure.measure === "t_max")?.value ??
          null,
      });
      result.tempMin.push({
        label: dayLabel,
        value:
          reading.data.find((measure) => measure.measure === "t_min")?.value ??
          null,
      });
      result.precipitation.push({
        label: dayLabel,
        value:
          reading.data.find((measure) => measure.measure === "prec")?.value ??
          null,
      });
      result.solRad.push({
        label: dayLabel,
        value:
          reading.data.find((measure) => measure.measure === "sol_rad")
            ?.value ?? null,
      });
    });
    return result;
  };

  const handleStationClick = (station) => {
    navigate(`/dashboard/${station.id}`);
    setCurrentStation(station);
  };

  const chartConfig = (label, data, color) => ({
    labels: data.map((item) => item.label),
    datasets: [
      {
        label,
        data: data.map((item) => item.value),
        fill: false,
        borderColor: color,
        tension: 0.1,
      },
    ],
  });

  const chartOptions = useMemo(
    () => ({
      scales: {
        x: { title: { display: true, text: "Días" } },
        y: { title: { display: true, text: "Valores" }, beginAtZero: false },
      },
    }),
    []
  );

  return (
    <div>
      <Container fluid className="p-3 bg-dashboard">
        <SearchBar
          stations={stations}
          onStationClick={handleStationClick}
          dashboard
        />
        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
            <p>Cargando datos...</p>
          </div>
        ) : (
          <>
            <Col className="bg-white rounded p-4 my-2 text-dark">
              <div className="d-flex justify-content-between mb-2">
                <Form.Select aria-label="Periodo de tiempo" className="w-auto">
                  <option>Últimos 7 días</option>
                  <option value="1">Últimos 15 días</option>
                  <option value="2">Últimos 30 días</option>
                </Form.Select>
                <Button variant="primary text-light">
                  Comparar con datos satelitales
                </Button>
              </div>

              <h4>{currentStation?.name}</h4>
              <hr />
              <p>
                La estación meteorológica <b>{currentStation?.name}</b> está
                ubicada en{" "}
                <b>
                  {currentStation?.latitude + ", " + currentStation?.longitude}.
                </b>
                Su principal objetivo es monitorear y registrar las condiciones
                climáticas locales, proporcionando datos precisos y en tiempo
                real sobre la temperatura, humedad, velocidad del viento,
                presión atmosférica y precipitación.
              </p>
              {currentStation?.latitude && currentStation?.longitude ? (
                <MapContainer
                  center={[currentStation.latitude, currentStation.longitude]}
                  zoom={12}
                  style={{ height: "300px", width: "100%" }}
                  className="map-monitoring"
                  zoomControl={false}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[
                      currentStation.latitude,
                      currentStation.longitude,
                    ]}
                    icon={iconMarker}
                  />
                  <ZoomControl position="topright" />
                </MapContainer>
              ) : (
                <div className="text-center">
                  <p>Esperando información del mapa...</p>
                </div>
              )}
            </Col>
            <Row>
              <Col md={6} className="mb-4">
                <div className="bg-white rounded p-4 text-dark">
                  <h5>Temperatura máxima</h5>
                  <hr />
                  {/* <p>
                    La gráfica muestra la evolución de la temperatura máxima
                    registrada en la estación meteorológica{" "}
                    <b>{currentStation?.name}</b> durante los últimos{" "}
                    <b>7 días</b> días. En ella se destaca que el día con la
                    temperatura más alta fue el <b>{}</b>,
                    alcanzando un máximo de{" "}
                    <b>{Math.max(...data.tempMax.map((item) => item.value))}</b>
                    °C, mientras que el día más frío fue el [Fecha del día más
                    frío], con una temperatura de [Temperatura mínima]°C. Esta
                    visualización permite analizar las variaciones diarias de
                    temperatura y ofrece una referencia clara para identificar
                    patrones climáticos recientes en la región.
                  </p> */}
                  <Line
                    data={chartConfig(
                      "Temperatura Máxima (°C)",
                      data.tempMax,
                      "rgba(75,192,192,1)"
                    )}
                    options={chartOptions}
                  />
                </div>
              </Col>

              <Col md={6} className="mb-4">
                <div className="bg-white rounded p-4 text-dark">
                  <h5>Temperatura mínima</h5>
                  <hr />
                  <Line
                    data={chartConfig(
                      "Temperatura Mínima (°C)",
                      data.tempMin,
                      "rgba(192,75,75,1)"
                    )}
                    options={chartOptions}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-4">
                <div className="bg-white rounded p-4 text-dark">
                  <h5>Precipitación</h5>
                  <hr />
                  <Line
                    data={chartConfig(
                      "Precipitación (mm)",
                      data.precipitation,
                      "rgba(75,75,192,1)"
                    )}
                    options={chartOptions}
                  />
                </div>
              </Col>

              <Col md={6} className="mb-4">
                <div className="bg-white rounded p-4 text-dark">
                  <h5>Radiación Solar</h5>
                  <hr />
                  <Line
                    data={chartConfig(
                      "Radiación Solar (MJ)",
                      data.solRad,
                      "rgba(192,192,75,1)"
                    )}
                    options={chartOptions}
                  />
                </div>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
