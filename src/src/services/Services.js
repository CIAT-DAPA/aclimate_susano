import axios from "axios";
import Configuration from "../conf/Configuration";

const NICARAGUA_ID = "651437a78a8437279ea6ca2c";

class Services {
  constructor() {
    this.apiBaseUrl = Configuration.getAclimateApiUrl();
  }

  async getAllWeatherStations() {
    const url = `${this.apiBaseUrl}/geographic/${NICARAGUA_ID}/WeatherStations/json`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching weather stations:", error);
      throw error; // Propagar el error para que pueda manejarse a nivel superior
    }
  }

  async getDailyWeather(month, year, stationId) {
    const url = `${this.apiBaseUrl}/DailyWeatherData/Climatology/${stationId}/json?year=${year}&month=${month}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching daily weather for station ${stationId}:`, error);
      throw error;
    }
  }
}

export default new Services();
