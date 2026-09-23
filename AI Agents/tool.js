import { tool } from "langchain";
import { z } from "zod";
import { PineconeCompressionRetriever } from "../Rag/index.js";

export const WeatherTool = tool(
    async ({ city }) => {
        try {
            // 1. Geocode city name to lat/long
            const geoRes = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                return JSON.stringify({ error: `City '${city}' not found.` });
            }

            const { latitude, longitude, name, country } = geoData.results[0];

            // 2. Fetch current weather from Open-Meteo
            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
            );
            const weatherData = await weatherRes.json();
            const current = weatherData.current;

            return JSON.stringify({
                city: `${name}, ${country}`,
                temperature: `${current.temperature_2m}°C`,
                humidity: `${current.relative_humidity_2m}%`,
                windSpeed: `${current.wind_speed_10m} km/h`,
            });
        } catch (error) {
            return JSON.stringify({ error: `Failed to fetch weather: ${error.message}` });
        }
    },
    {
        name: "get_weather",
        description: "Get real-time live weather information for any city",
        schema: z.object({
            city: z.string().describe("The city name, e.g. London, Delhi, New York"),
        }),
    }
);

export const vectorSearchTool = tool(({ query }) => {
    return PineconeCompressionRetriever.invoke(query).then(docs => docs.map((d) => d.pageContent).join("\n\n"))
},
    {
        name: "vector_search",
        description: "Search for relevant documents in the vector database",
        schema: z.object({
            query: z.string().describe("The query to search for"),
        }),
    }
)