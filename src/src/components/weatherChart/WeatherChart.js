import React from "react";
import { Col } from "react-bootstrap";
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
  days,
  color,
}) => {
  const filteredData = data.slice(-days);

  const maxItem = filteredData.reduce(
    (max, item) => (item.value > max.value ? item : max),
    filteredData[0] || { label: "N/A", value: 0 }
  );
  const minItem = filteredData.reduce(
    (min, item) => (item.value < min.value ? item : min),
    filteredData[0] || { label: "N/A", value: 0 }
  );

  return (
    <Col lg={6} className="mb-4">
      <div className="bg-white rounded p-4 text-dark">
        <h5>{title}</h5>
        <hr />
        <p>
          La gráfica muestra la evolución de {title.toLowerCase()} registrada en
          la estación meteorológica durante los <b>{days} últimos</b> días. En
          ella se destaca que el día con la {title.toLowerCase()} más alta fue
          el <b>{maxItem.label}</b>, alcanzando un máximo de{" "}
          <b>
            {maxItem.value.toFixed(2)} {unit}
          </b>
          , mientras que el día con la {title.toLowerCase()} más baja fue el{" "}
          <b>{minItem.label}</b>, con una {title.toLowerCase()} de{" "}
          <b>
            {minItem.value.toFixed(2)} {unit}
          </b>
          . Esta visualización permite analizar las variaciones diarias de{" "}
          {title.toLowerCase()} y ofrece una referencia clara para identificar
          patrones climáticos recientes en la región.
        </p>
        <Line
          data={chartConfig(title, filteredData, `${color}`)}
          options={chartOptions}
        />
      </div>
    </Col>
  );
};

export default WeatherChart;
