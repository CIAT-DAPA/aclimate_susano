/**
 * Configuration class for application settings.
 */
class Configuration {
  static #ACLIMATE_API = "https://webapi.aclimate.org/api";

  /**
   * Gets the Aclimate API URL.
   * @returns {string} The Aclimate API URL.
   */
  static get aclimateApiUrl() {
    return this.#ACLIMATE_API;
  }
}

export default Configuration;
