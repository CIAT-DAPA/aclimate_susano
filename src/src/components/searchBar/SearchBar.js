import { IconSearch, IconRouter } from "@tabler/icons-react";
import React, { useState } from "react";
import "./SearchBar.css";

function SearchBar({ stations, onStationClick, bigSize }) {
  const [filterText, setFilterText] = useState("");
  const [selectedStation, setSelectedStation] = useState(null);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    setSelectedStation(null); // Reiniciar la selección cuando se empieza a escribir de nuevo
  };

  // Asegurarse de que las estaciones no estén duplicadas
  const filteredStations = stations
    .filter(
      (station, index, self) =>
        self.findIndex((s) => s.id === station.id) === index
    ) // Evitar duplicados
    .filter((station) =>
      station.name.toLowerCase().includes(filterText.toLowerCase())
    );
    console.log(filteredStations);

  const handleStationClick = (station) => {
    if (onStationClick) {
      onStationClick(station); // Llama a la función pasada como prop
    }
    setSelectedStation(station);
    setFilterText(""); // Limpiar el campo de texto después de la selección
  };

  return (
    <>
      <div className={`bar-hints`}>
        <div
          className={`d-flex px-3 bg-white align-items-center border-bottom justify-content-between py-2 ${
            filterText === "" || filterText.length < 3
              ? "search-bar-unfocused "
              : "search-bar-focused "
          } ${bigSize ? "search-bar-big" : ""}`}
        >
          <input
            type="search"
            className="form-control form-control-sm border-0 text-input w-100 text-capitalize"
            style={{ width: "350px" }}
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
          <IconSearch />
        </div>

        {filterText !== "" && filterText.length >= 3 && (
          <div className="bg-white stations-search px-3 py-1">
            {filteredStations.map((station) => (
              <div
                className="py-1 small hint-div text-capitalize"
                key={station.id} // Usar `station.id` como clave única
                onClick={() => handleStationClick(station)}
              >
                <IconRouter className="me-3" style={{ color: "#000" }} />
                {station.name.toLowerCase()}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default SearchBar;
