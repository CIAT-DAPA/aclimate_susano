import React, { useMemo } from "react";
import { Button, Col, Spinner } from "react-bootstrap";
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
import noDataImage from "../../assets/img/no-data.jpg";
import { IconDownload } from "@tabler/icons-react";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherChart = ({
  title,
  data,
  dataSpatial,
  unit,
  color,
  isChartLoading,
  startAtZero,
}) => {
  const maxItem = useMemo(
    () =>
      data.reduce(
        (max, item) => (item.value > max.value ? item : max),
        data[0] || { label: "N/A", value: 0 }
      ),
    [data]
  );

  const minItem = useMemo(
    () =>
      data.reduce(
        (min, item) => (item.value < min.value ? item : min),
        data[0] || { label: "N/A", value: 0 }
      ),
    [data]
  );

  const formatLabel = (label) => label.split("T")[0];

  const allDataZero = data.every((item) => item.value === 0);

  const downloadCSV = () => {
    const csvData = [
      ["Date", "Value"],
      ...data.map((item) => [item.label, item.value]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvData.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.toLowerCase()}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartConfig = (label, data, color, dataSpatial, spatialColor) => ({
    labels: data.map((item) => item.label),
    datasets: [
      {
        label,
        data: data.map((item) => item.value),
        fill: false,
        borderColor: color,
        tension: 0.1,
      },
      ...(dataSpatial
        ? [
            {
              label: `Datos satelitales`,
              data: dataSpatial.map((item) => item.value),
              fill: false,
              borderColor: spatialColor,
              tension: 0.1,
            },
          ]
        : []),
    ],
  });

  const chartOptions = useMemo(
    () => ({
      scales: {
        x: { title: { display: true, text: "Días" } },
        y: { title: { display: true, text: unit }, beginAtZero: false },
      },
    }),
    [unit]
  );

  const ChartOptionsStartedAtZero = useMemo(
    () => ({
      ...chartOptions,
      scales: {
        ...chartOptions.scales,
        y: {
          ...chartOptions.scales.y,
          beginAtZero: true,
          min: 0,
        },
      },
    }),
    [chartOptions]
  );

  return (
    <Col lg={6} className="mb-4">
      <div className="bg-white rounded p-4 text-dark h-100">
        {isChartLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
            <p>Cargando gráficos...</p>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center">
              <h5>{title}</h5>
              <Button
                variant="dark"
                onClick={downloadCSV}
                disabled={
                  data.length === 0 ||
                  data.every((item) => item.value === null) ||
                  allDataZero
                }
              >
                <IconDownload className="me-2" size={20} />
                Descargar Datos
              </Button>
            </div>
            <hr />
            {data.length === 0 || data.every((item) => item.value === null) ? (
              <div className="h-75 d-flex flex-column justify-content-between">
                <p className="fw-bold">No hay datos disponibles</p>
                <img
                  src={noDataImage}
                  alt="No data available"
                  className="img-fluid"
                />
              </div>
            ) : allDataZero ? (
              <div className="h-75 d-flex flex-column justify-content-between">
                <p>
                  No hay datos de {title.toLowerCase()} durante este período.
                </p>
                <img
                  src={noDataImage}
                  alt="No data available"
                  className="img-fluid"
                />
              </div>
            ) : (
              <>
                <p>
                  La gráfica muestra la evolución de {title.toLowerCase()}{" "}
                  registrada en la estación meteorológica durante los{" "}
                  <b>últimos {data.length} días</b>. En ella se destaca que el
                  día con la {title.toLowerCase()} más alta fue el{" "}
                  <b>{formatLabel(maxItem.label)}</b>, alcanzando un máximo de{" "}
                  <b>
                    {maxItem.value.toFixed(2)} {unit}
                  </b>
                  , mientras que el día con la {title.toLowerCase()} más baja
                  fue el <b>{formatLabel(minItem.label)}</b>, con una{" "}
                  {title.toLowerCase()} de{" "}
                  <b>
                    {minItem.value.toFixed(2)} {unit}
                  </b>
                  . Esta visualización permite analizar las variaciones diarias
                  de {title.toLowerCase()} y ofrece una referencia clara para
                  identificar patrones climáticos recientes en la región.
                </p>
                <Line
                  data={chartConfig(
                    "Datos estación",
                    data,
                    color,
                    dataSpatial,
                    "rgba(255, 99, 132, 1)"
                  )}
                  options={
                    startAtZero ? ChartOptionsStartedAtZero : chartOptions
                  }
                />
              </>
            )}
          </>
        )}
      </div>
    </Col>
  );
};

export default WeatherChart;
