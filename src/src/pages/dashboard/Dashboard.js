import React, { useState, useEffect, useMemo } from "react";
import { Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchBar/SearchBar";
import Services from "../../services/Services";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "./Dashboard.css";
import WeatherChart from "../../components/weatherChart/WeatherChart";
import FloatingButton from "../../components/floatingButton/FloatingButton.js";
import { IconCalendarMonth } from "@tabler/icons-react";

const Dashboard = () => {
  const [data, setData] = useState({
    tempMax: [],
    tempMin: [],
    precipitation: [],
    solRad: [],
  });
  const [stations, setStations] = useState([]);
  const [currentStation, setCurrentStation] = useState(null);
  const [currentStationSpacial, setCurrentStationSpacial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [endDataDate, setEndDataDate] = useState();
  const [endDataSpacialDate, setEndDataSpacialDate] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const { idWS } = useParams();
  const navigate = useNavigate();

  const iconMarker = useMemo(
    () =>
      new L.Icon({
        iconUrl: require("../../assets/img/marker.png"),
        iconSize: [48, 48],
      }),
    []
  );

  useEffect(() => {
    const fetchStations = async () => {
      setIsLoading(true);
      try {
        const response = await Services.getAllWeatherStations();
        const filteredStations = response.filter(
          (item) => item.origin === "WEATHERLINK"
        );
        const filteredStationsSpacial = response.filter(
          (item) => item.origin === "CHIRPS y AgERA-5"
        );
        const station = filteredStations.find((item) => item.id === idWS);
        const stationSpacial = filteredStationsSpacial.find(
          (item) => item.ext_id === station.ext_id + "_h"
        );
        setStations(filteredStations);
        setCurrentStation(station);
        setCurrentStationSpacial(stationSpacial);
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
        const lastDataAvailable = await Services.getLastDailyWeather(idWS);
        const formattedEndDate = new Date(lastDataAvailable[0].date)
          .toISOString()
          .split("T")[0];
        setEndDate(formattedEndDate);
        setEndDataDate(formattedEndDate);

        const lastDataSpacialAvailable = await Services.getLastDailyWeather(
          currentStationSpacial.id
        );
        const formattedSpacialEndDate = new Date(
          lastDataSpacialAvailable[0].date
        )
          .toISOString()
          .split("T")[0];
        setEndDataSpacialDate(formattedSpacialEndDate);

        const startDate = new Date(lastDataAvailable[0].date);
        startDate.setDate(startDate.getDate() - 7);
        const formattedStartDate = startDate.toISOString().split("T")[0];
        setStartDate(formattedStartDate);

        const response = await Services.getDailyWeather(
          formattedStartDate,
          formattedEndDate,
          idWS
        );
        const parsedData = parseWeatherData(response.daily_data);
        setData(parsedData);
      } catch (error) {
        console.error("Error fetching daily weather data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentStation, idWS]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentStation || !startDate || !endDate) return;
      setIsChartLoading(true);
      try {
        const response = await Services.getDailyWeather(
          startDate,
          endDate,
          idWS
        );
        const parsedData = parseWeatherData(response.daily_data);
        setData(parsedData);
      } catch (error) {
        console.error("Error fetching daily weather data:", error);
      } finally {
        setIsChartLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate, currentStation, idWS]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(
      favorites.some((stationId) => stationId === currentStation?.id)
    );
  }, [currentStation]);

  const parseWeatherData = (readings) => {
    const result = {
      tempMax: [],
      tempMin: [],
      precipitation: [],
      solRad: [],
    };

    readings.forEach((reading) => {
      const dayLabel = `${reading.date.split("T")[0]}`;
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

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
  };

  const downloadAllData = () => {
    const csvData = [
      ["Date", "Temp Max", "Temp Min", "Precipitation", "Solar Radiation"],
      ...data.tempMax.map((item, index) => [
        item.label,
        item.value,
        data.tempMin[index]?.value ?? "N/A",
        data.precipitation[index]?.value ?? "N/A",
        data.solRad[index]?.value ?? "N/A",
      ]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvData.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${currentStation?.name.toLowerCase()}_weather_data.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveFavorite = () => {
    const favorites = [];
    favorites.push(currentStation.id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(true);
  };

  const compareData = () => {};

  return (
    <div className="bg-dashboard">
      <Container className="p-3 bg-dashboard">
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
              <div className="d-flex justify-content-between">
                <div>
                  <h1 className="mb-0">{currentStation?.name}</h1>
                  <p className="text-muted ">Fuente: WeatherLink</p>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Group className="d-flex">
                    <div className="d-flex flex-column">
                      <Form.Label className="me-2">
                        {" "}
                        <IconCalendarMonth className="me-2" /> Fecha de inicio:
                      </Form.Label>
                      <Form.Control
                        type="date"
                        aria-label="Fecha de inicio"
                        className="me-2"
                        value={startDate}
                        onChange={handleStartDateChange}
                        max={endDate}
                      />
                    </div>
                    <div className="d-flex flex-column pb-2 justify-content-end mx-3">
                      -
                    </div>
                    <div className="d-flex flex-column">
                      <Form.Label className="me-2">
                        {" "}
                        <IconCalendarMonth className="me-2" />
                        Fecha de fin:
                      </Form.Label>
                      <Form.Control
                        type="date"
                        aria-label="Fecha de fin"
                        value={endDate}
                        onChange={handleEndDateChange}
                        min={startDate}
                        max={endDataDate}
                      />
                    </div>
                  </Form.Group>
                </div>
              </div>

              <hr />
              <p>
                La estación meteorológica <b>{currentStation?.name}</b> está
                ubicada en{" "}
                <b>
                  {currentStation?.latitude + ", " + currentStation?.longitude}.{" "}
                </b>
                Cuenta con datos observados desde el {" ----- "} hasta el{" "}
                <b>{endDataDate}</b>, se puede comparar con datos espaciales
                como AgERA-5 y CHIRPS que tiene datos desde el {" ----- "} hasta
                el <b>{endDataSpacialDate}</b>.
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
                color="rgba(26, 51, 237, 1)"
                isChartLoading={isChartLoading}
                startAtZero
              />
              <WeatherChart
                title="Temperatura Máxima"
                data={data.tempMax}
                unit="°C"
                color="rgba(163, 36, 36, 1)"
                isChartLoading={isChartLoading}
              />
            </Row>
            <Row>
              <WeatherChart
                title="Temperatura Mínima"
                data={data.tempMin}
                unit="°C"
                color="rgba(184, 84, 13, 1)"
                isChartLoading={isChartLoading}
              />
              <WeatherChart
                title="Radiación Solar"
                data={data.solRad}
                unit="MJ"
                color="rgba(237, 185, 12, 1)"
                isChartLoading={isChartLoading}
              />
            </Row>
            <FloatingButton
              type="favorite"
              onClick={saveFavorite}
              isFavorite={isFavorite}
            />
            <FloatingButton type="download" onClick={downloadAllData} />
            <FloatingButton type="compare" onClick={compareData} />
          </>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
