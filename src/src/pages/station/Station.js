import React, { useState, useEffect, useRef } from "react";
import "./Station.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
} from "react-leaflet";
import Services from "../../services/Services";
import L from "leaflet";
import { IconChartDonut } from "@tabler/icons-react";
import SearchBar from "../../components/searchBar/SearchBar";

function Station() {
  const [stations, setStations] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState([]);
  const mapRef = useRef(null);

  const iconMarker = new L.Icon({
    iconUrl: require("../../assets/img/marker.png"),
    iconSize: [48, 48],
  });

  useEffect(() => {
    //Call to API to get stations
    Services.get_all_weatherStation()
      .then((response) => {
        const filteredResponseByCHIRPS = response.filter(item => item.origin === "CHIRPS y ERA-5");
        setStations(filteredResponseByCHIRPS);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // useEffect(() => {
  //   if (stations.length > 0) {
  //     const requests = stations.map((item) =>
  //       Services.get_daily_weather(12, 2022, item.id)
  //     );

  //     Promise.all(requests)
  //       .then((responses) => {
  //         const data = responses.map((response) => response);
  //         setDailyData(data);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }
  // }, [stations.length]);

  const MapCenter = ({ stations }) => {
    const map = useMap();

    useEffect(() => {
      if (stations.length > 0) {
        const bounds = L.latLngBounds(
          stations.map((station) => [station.latitude, station.longitude])
        );
        map.fitBounds(bounds); // Adjust the map to fit the bounds
      }
    }, [stations, map]);

    return null; // No need to render anything
  };

  const handleStationClick = (station) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([station.latitude, station.longitude], 12);
    }
  };

  const popupData = (station) => {
    return (
      <Marker
        position={[station.latitude, station.longitude]}
        key={station.id}
        icon={iconMarker}
      >
        <Popup closeButton={false} className="popup">
          <div>
            <div className="d-flex align-items-center justify-content-between ">
              <h6 className="fw-medium mb-0 text-nowrap">
                Estacion {station.name}
              </h6>
            </div>
            <p className="mt-0 mb-2">Fecha: 32</p>
          </div>
          <table className="fs-6 text-nowrap w-100">
            <tbody>
              <tr>
                <td className="d-flex align-items-center me-2">
                  Temperatura maxima:
                </td>
                <td>432</td>
              </tr>
              <tr>
                <td className="d-flex align-items-center me-2">
                  Temperatura minima:
                </td>
                <td>432</td>
              </tr>
              <tr>
                <td className="d-flex align-items-center me-2">
                  Precipitacion:
                </td>
                <td>432</td>
              </tr>
              <tr>
                <td className="d-flex align-items-center me-2">
                  Radiacion solar:
                </td>
                <td>432</td>
              </tr>
            </tbody>
          </table>
          <div className="d-flex justify-content-between flex-column align-items-end mt-3">
            <a
              href={`/dashboard/${station.id}`}
              className="btn btn-primary btn-sm text-white rounded-3 fw-medium d-flex align-items-center justify-content-between px-2 py-2 mx-2"
              role="button"
            >
              <IconChartDonut stroke={2} className="me-2" />
              Data
            </a>
          </div>
        </Popup>
        <Tooltip direction="right" offset={[0, -5]} opacity={1} permanent>
          {station.name}
        </Tooltip>
      </Marker>
    );
  };

  return (
    <>
      <MapContainer
        style={{
          height: "93vh",
          width: "100%",
        }}
        className="map-monitoring"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl position="topright" />

        {stations.map((station, i) => (
          <div key={i}>{popupData(station)}</div>
        ))}

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
