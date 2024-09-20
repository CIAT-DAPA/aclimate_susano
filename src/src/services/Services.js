import axios from "axios";
import Configuration from "../conf/Configuration";

const NICARAGUA_ID = "651437a78a8437279ea6ca2c";

// Create an Axios instance with the base URL
const apiClient = axios.create({
  baseURL: Configuration.aclimateApiUrl,
});

class Services {
  /**
   * Fetches all weather stations for Nicaragua.
   * @returns {Promise<Object[]>} A promise that resolves to an array of weather stations.
   * @throws Will throw an error if the request fails.
   */
  async getAllWeatherStations() {
    const url = `/geographic/${NICARAGUA_ID}/WeatherStations/json`;
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching weather stations:", error);
      throw new Error(
        "Failed to fetch weather stations. Please try again later."
      );
    }
  }

  /**
   * Fetches daily weather data for a specific station.
   * @param {number} month - The month for which to fetch data.
   * @param {number} year - The year for which to fetch data.
   * @param {string} stationId - The ID of the weather station.
   * @returns {Promise<Object>} A promise that resolves to the daily weather data.
   * @throws Will throw an error if the request fails.
   */
  async getDailyWeather(month, year, stationId) {
    const url = `/DailyWeatherData/Climatology/${stationId}/json?year=${year}&month=${month}`;
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching daily weather for station ${stationId}:`,
        error
      );
      throw new Error(
        `Failed to fetch daily weather for station ${stationId}. Please try again later.`
      );
    }
  }
}

export default new Services();
