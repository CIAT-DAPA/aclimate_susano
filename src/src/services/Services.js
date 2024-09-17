import axios from "axios";
import Configuration from "../conf/Configuration";

const NICARAGUA_ID = "651437a78a8437279ea6ca2c";

class Services {
  get_all_weatherStation() {
    const url = `${Configuration.get_url_api_aclimate()}/geographic/${NICARAGUA_ID}/WeatherStations/json`;
    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  get_daily_weather(month, year, stationId) {
    const url = `${Configuration.get_url_api_aclimate()}/DailyWeatherData/Climatology/${stationId}/json?year=${year}&month=${month}`;
    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

export default new Services();
