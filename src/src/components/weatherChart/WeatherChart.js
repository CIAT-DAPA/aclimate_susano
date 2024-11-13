import React, { useMemo } from "react";
import { Col, Spinner } from "react-bootstrap";
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
  unit,
  chartOptions,
  chartConfig,
  color,
  isChartLoading,
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

  return (
    <Col lg={6} className="mb-4 ">
      <div className="bg-white rounded p-4 text-dark h-100">
        {isChartLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
            <p>Cargando gráficos...</p>
          </div>
        ) : (
          <>
            <h5>{title}</h5>
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
                <p>No hubo {title.toLowerCase()} durante este período.</p>
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
                  data={chartConfig(title, data, color)}
                  options={chartOptions}
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
