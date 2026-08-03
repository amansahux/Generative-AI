/**
 * @file ai/tools/weather.tool.js
 * @description Placeholder for the Weather AI tool.
 * This tool will allow the AI to fetch current weather data for a given location.
 */

import { tool } from "langchain";
import * as z from "zod"

/**
 * Weather tool definition.
 * No implementation — placeholder only.
 *
 * @type {Object}
 */

const execute = async ({ location }) => {
  try {
    if (!location) {
      return "Error: Location is required.";
    }
    // 1. Geocode location using open-meteo's free geocoding API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) {
      throw new Error(`Geocoding request failed with status ${geoRes.status}`);
    }
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      return `Error: Could not find location "${location}".`;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Fetch weather using open-meteo forecast API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) {
      throw new Error(`Weather request failed with status ${weatherRes.status}`);
    }
    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;

    if (!current) {
      return `Error: No current weather data available for ${name}.`;
    }

    // Map WMO Weather Interpretation Codes (WMO code) to human readable descriptions
    const weatherCodes = {
      0: "Clear sky",
      1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
      45: "Fog", 48: "Depositing rime fog",
      51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
      56: "Light freezing drizzle", 57: "Dense freezing drizzle",
      61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
      66: "Light freezing rain", 67: "Heavy freezing rain",
      71: "Slight snow fall", 73: "Moderate snow fall", 75: "Heavy snow fall",
      77: "Snow grains",
      80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
      85: "Slight snow showers", 86: "Heavy snow showers",
      95: "Thunderstorm: Slight or moderate", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
    };

    const condition = weatherCodes[current.weathercode] || "Unknown";
    console.log("========================================Weather Tool Response==========================================================================")
    console.log(JSON.stringify({
      location: `${name}, ${country || ""}`.trim(),
      latitude,
      longitude,
      temperature: `${current.temperature}°C`,
      windspeed: `${current.windspeed} km/h`,
      condition,
      time: current.time
    }, null, 2))

    return JSON.stringify({
      location: `${name}, ${country || ""}`.trim(),
      latitude,
      longitude,
      temperature: `${current.temperature}°C`,
      windspeed: `${current.windspeed} km/h`,
      condition,
      time: current.time
    }, null, 2);
  } catch (error) {
    return `Error fetching weather: ${error.message}`;
  }
}
export const weatherTool = tool(execute, {
  name: "weather",
  description: "Get current weather conditions for a specified location.",
  schema: z.object({
    location: z.string().describe("location")
  })
})