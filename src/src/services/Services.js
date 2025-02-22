import axios from "axios";
import Configuration from "../conf/Configuration";

const COUNTRY_ID = process.env.REACT_APP_COUNTRY_ID;

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
    const url = `/geographic/${COUNTRY_ID}/json`;
    try {
      const response = await apiClient.get(url);
      const data = response.data;

      // Flatten the response to extract the weather stations
      const weatherStations = [];

      data.forEach((state) => {
        const stateName = state.name;

        state.municipalities.forEach((municipality) => {
          const municipalityName = municipality.name;

          municipality.weather_stations.forEach((station) => {
            // Add municipality and state to each weather station
            weatherStations.push({
              ...station,
              municipality: municipalityName,
              state: stateName,
            });
          });
        });
      });

      return weatherStations;
    } catch (error) {
      console.error("Error fetching weather stations:", error);
      throw new Error(
        "Failed to fetch weather stations. Please try again later."
      );
    }
  }

  /**
   * Fetches daily weather data for a specific station.
   * @param {number} startDate - The start date for which to fetch data.
   * @param {number} endDate - The end date for which to fetch data.
   * @param {string} stationId - The ID of the weather station.
   * @returns {Promise<Object>} A promise that resolves to the daily weather data.
   * @throws Will throw an error if the request fails.
   */
  async getDailyWeather(startDate, endDate, stationId) {
    const url = `/DailyWeatherData/Climatology/${stationId}/json?startDate=${startDate}&endDate=${endDate}`;
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

  /**
   * Fetches last daily weather data for a specific station.
   * @param {Array} stationId - The IDs of the weather stations.
   * @returns {Promise<Object>} A promise that resolves to the daily weather data.
   * @throws Will throw an error if the request fails.
   */
  async getLastDailyWeather(stationsIds, lastData = true) {
    const url = `/DailyWeatherData/LastDailyData/${stationsIds}/json?lastData=${lastData}`;
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching last daily weather for station ${stationsIds}:`,
        error
      );
      throw new Error(
        `Failed to fetch last daily weather for station ${stationsIds}. Please try again later.`
      );
    }
  }
}

export default new Services();
