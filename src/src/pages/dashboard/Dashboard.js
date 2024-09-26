import React, { useState, useEffect, useMemo } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchBar/SearchBar";
import Services from "../../services/Services";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "./Dashboard.css";
import WeatherChart from "../../components/weatherChart/WeatherChart";

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
  const [selectedDays, setSelectedDays] = useState(7);
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
        console.error("Error fetching weather stations:", error);
      } finally {
        setIsLoading(false);
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
        console.error("Error fetching daily weather data:", error);
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

  const handleDaysChange = (event) => {
    const value = event.target.value;
    setSelectedDays(value === "" ? 7 : parseInt(value, 10));
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
                <Form.Select
                  aria-label="Periodo de tiempo"
                  className="w-auto"
                  onChange={handleDaysChange}
                >
                  <option value="7">Últimos 7 días</option>
                  <option value="15">Últimos 15 días</option>
                  <option value="30">Últimos 30 días</option>
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
                real.
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
              <WeatherChart
                title="Precipitación"
                data={data.precipitation}
                unit="mm"
                chartOptions={chartOptions}
                chartConfig={chartConfig}
                days={selectedDays}
                color="rgba(26, 51, 237, 1)"
              />
              <WeatherChart
                title="Temperatura Máxima"
                data={data.tempMax}
                unit="°C"
                chartOptions={chartOptions}
                chartConfig={chartConfig}
                days={selectedDays}
                color="rgba(163, 36, 36, 1)"
              />
            </Row>
            <Row>
              <WeatherChart
                title="Temperatura Mínima"
                data={data.tempMin}
                unit="°C"
                chartOptions={chartOptions}
                chartConfig={chartConfig}
                days={selectedDays}
                color="rgba(54, 227, 224, 1)"
              />
              <WeatherChart
                title="Radiación Solar"
                data={data.solRad}
                unit="MJ"
                chartOptions={chartOptions}
                chartConfig={chartConfig}
                days={selectedDays}
                color="rgba(237, 185, 12, 1)"
              />
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
