import { IconSearch, IconRouter } from "@tabler/icons-react";
import React, { useState } from "react";
import "./SearchBar.css";

function SearchBar({ stations, onStationClick, bigSize, dashboard }) {
  const [filterText, setFilterText] = useState("");
  const [selectedStation, setSelectedStation] = useState(null);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    setSelectedStation(null); // Reiniciar la selección al cambiar el filtro
  };

  // Filtrar estaciones sin duplicados y basándose en el texto de filtro
  const filteredStations = React.useMemo(() => {
    const uniqueStations = Array.from(
      new Map(stations.map((station) => [station.id, station])).values()
    ); // Eliminar duplicados
    return uniqueStations.filter((station) =>
      station.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [stations, filterText]);

  const handleStationClick = (station) => {
    if (onStationClick) {
      onStationClick(station); // Llama a la función pasada como prop
    }
    setSelectedStation(station);
    setFilterText(""); // Limpiar el campo de texto después de la selección
  };

  return (
    <div className={`${dashboard ? "" : "bar-hints"}`}>
      <div
        className={`d-flex px-3 bg-white align-items-center border-bottom justify-content-between py-2 ${
          filterText.length < 3 ? "search-bar-unfocused" : "search-bar-focused"
        } ${bigSize ? "search-bar-big" : ""}`}
      >
        <input
          type="search"
          className="form-control form-control-sm border-0 text-input w-100 text-capitalize text-dark"
          aria-label="Escriba una estación"
          placeholder={
            selectedStation
              ? `Seleccionado: ${selectedStation.name}`
              : "Escriba una estación"
          }
          onChange={handleFilterChange}
          value={filterText}
          autoFocus
        />
        <IconSearch color="#283618" />
      </div>

      {filterText.length >= 3 && (
        <div className="bg-white stations-search px-3 py-1 position-absolute">
          {filteredStations.map((station) => (
            <div
              className="py-1 small hint-div text-capitalize text-dark"
              key={station.id}
              onClick={() => handleStationClick(station)}
            >
              <IconRouter className="me-3" style={{ color: "#283618" }} />
              {station.name.toLowerCase()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
