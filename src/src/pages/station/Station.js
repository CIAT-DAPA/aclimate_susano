import React, { useState, useEffect } from "react";
import "./Station.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import Services from "../../services/Services";
import L from "leaflet"; // Import Leaflet to calculate bounds

function Station() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    //Call to API to get stations
    Services.get_all_weatherStation()
      .then((response) => {
        console.log(response);
        setStations(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  const popupData = (station) => {
    return (
      <Marker position={[station.latitude, station.longitude]} key={station.id}>
        <Popup closeButton={false} className="popup">
          <div>
            <div className="d-flex align-items-center justify-content-between ">
              <h6 className="fw-medium mb-0">Estacion {station.name}</h6>
            </div>
            <p className="mt-0 mb-2">Fecha: 32</p>
          </div>
          <table className="fs-6">
            <tbody>
              <tr>
                <td className="d-flex align-items-center ">
                  Temperatura maxima:
                </td>
                <td>432</td>
              </tr>
              <tr>
                <td className="d-flex align-items-center ">
                  Temperatura minima:
                </td>
                <td>432</td>
              </tr>
              <tr>
                <td className="d-flex align-items-center ">Precipitacion:</td>
                <td>432</td>
              </tr>
              <tr>
                <td className="d-flex align-items-center ">Radiacion solar:</td>
                <td>432</td>
              </tr>
            </tbody>
          </table>
          <div className="d-flex justify-content-between mt-3">
            <a
              href={`/dashboard/${station.id}`}
              className="btn btn-primary btn-sm text-white rounded-3 fw-medium d-flex align-items-center justify-content-between px-2 py-2 mx-2"
              role="button"
            >
              Data
            </a>
          </div>
        </Popup>
      </Marker>
    );
  };

  return (
    <>
      <MapContainer
        zoom={6}
        style={{
          height: "100vh",
          width: "100%",
        }}
        className="map-monitoring"
        zoomControl={false}
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
    </>
  );
}

export default Station;
