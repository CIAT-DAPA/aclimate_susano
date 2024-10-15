import React, { useMemo } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { IconChartDonut } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import L from "leaflet";

function StationPopup({ station, lastData }) {
  const iconMarker = useMemo(
    () =>
      new L.Icon({
        iconUrl: require("../../assets/img/marker.png"),
        iconSize: [48, 48],
      }),
    []
  );

  const renderClimaticData = (label, measure, unit) => (
    <tr>
      <td className="d-flex align-items-center me-2">{label}:</td>
      <td>
        {lastData?.climaticData
          .find((item) => item.measure === measure)
          ?.value.toFixed(1) ?? "N/A"}{" "}
        {unit}
      </td>
    </tr>
  );

  return (
    <Marker position={[station.latitude, station.longitude]} icon={iconMarker}>
      <Popup closeButton={false} className="popup">
        <div className="text-dark">
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="fw-medium mb-0 text-nowrap">
              Estación {station.name}
            </h6>
          </div>
          <p className="mt-0 mb-2">Fecha: {lastData?.date ?? "N/A"}</p>
        </div>
        <table className="fs-6 text-nowrap w-100 text-dark">
          <tbody>
            {renderClimaticData("Temperatura máxima", "t_max", "°C")}
            {renderClimaticData("Temperatura mínima", "t_min", "°C")}
            {renderClimaticData("Precipitación", "prec", "mm")}
            {renderClimaticData("Radiación solar", "sol_rad", "MJ")}
          </tbody>
        </table>
        <div className="d-flex justify-content-between flex-column align-items-end mt-3">
          <Link
            to={`/dashboard/${station.id}`}
            className="btn btn-primary btn-sm text-light rounded-3 fw-medium d-flex align-items-center justify-content-between px-2 py-2 mx-2"
            aria-label="Data"
          >
            <IconChartDonut stroke={2} className="me-2" />
            Data
          </Link>
        </div>
      </Popup>
      <Tooltip direction="right" offset={[0, -5]} opacity={1} permanent>
        {station.name}
      </Tooltip>
    </Marker>
  );
}

export default StationPopup;
