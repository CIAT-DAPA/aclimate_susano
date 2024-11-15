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
  dataSpacial,
  unit,
  color,
  isChartLoading,
  startAtZero,
}) => {
  const adjustColor = (
    color,
    opacity = 1,
    brightnessFactor = 1.2,
    hueShift = 10
  ) => {
    // Convertir RGB a HSL
    const rgbToHsl = (r, g, b) => {
      r /= 255;
      g /= 255;
      b /= 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h,
        s,
        l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // gris
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h *= 60;
      }

      return [h, s, l];
    };

    // Convertir HSL de nuevo a RGB
    const hslToRgb = (h, s, l) => {
      let r, g, b;

      const hueToRgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 3) return q;
        if (t < 1 / 2) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      if (s === 0) {
        r = g = b = l; // gris
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h / 360 + 1 / 3);
        g = hueToRgb(p, q, h / 360);
        b = hueToRgb(p, q, h / 360 - 1 / 3);
      }

      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };

    // Extraer los valores RGB del color
    const rgbaMatch = color.match(/rgba?\((\d+), ?(\d+), ?(\d+),? ?([\d.]*)\)/);
    if (!rgbaMatch) {
      throw new Error("Formato de color no válido");
    }

    const [r, g, b] = rgbaMatch.slice(1, 4).map(Number);

    // Convertir a HSL
    let [h, s, l] = rgbToHsl(r, g, b);

    // Ajustar el brillo (luminance) y el hue (matiz)
    l = Math.min(1, l * brightnessFactor); // Aumentar el brillo
    h = (h + hueShift) % 360; // Cambiar el hue

    // Convertir de nuevo a RGB
    const [newR, newG, newB] = hslToRgb(h, s, l);

    // Retornar el color con la nueva opacidad
    return `rgba(${newR},${newG},${newB},${opacity})`;
  };

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
      [
        "Fecha",
        title,
        ...(dataSpacial.length > 0 ? [`${title} satelital`] : []),
      ],
      ...data.map((item, index) => [
        item.label,
        item.value,
        ...(dataSpacial.length > 0 ? [dataSpacial[index]?.value ?? "N/A"] : []),
      ]),
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

  const chartConfig = (label, data, color, dataSpacial) => ({
    labels: data.map((item) => item.label),
    datasets: [
      {
        label,
        data: data.map((item) => item.value),
        fill: false,
        borderColor: color,
        backgroundColor: color,
        tension: 0.1,
      },
      ...(dataSpacial.length > 0
        ? [
            {
              label: `Datos satelitales`,
              data: dataSpacial.map((item) => item.value),
              fill: false,
              borderColor: adjustColor(color, 0.5, 1, 15),
              backgroundColor: adjustColor(color, 0.5, 1, 15),
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
                  La gráfica muestra los datos de {title.toLowerCase()}{" "}
                  registrada en la estación meteorológica desde{" "}
                  <b>{data[0].label}</b> hasta{" "}
                  <b>{data[data.length - 1].label}</b>. En ella se destaca que
                  el día con la {title.toLowerCase()} más alta fue el{" "}
                  <b>{formatLabel(maxItem.label)}</b>, alcanzando un máximo de{" "}
                  <b>
                    {maxItem.value.toFixed(2)} {unit}
                  </b>
                  , mientras que el día con la {title.toLowerCase()} más baja
                  fue el <b>{formatLabel(minItem.label)}</b>, con una mínima de{" "}
                  <b>
                    {minItem.value.toFixed(2)} {unit}
                  </b>
                  .
                </p>
                <Line
                  data={chartConfig("Datos estación", data, color, dataSpacial)}
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
