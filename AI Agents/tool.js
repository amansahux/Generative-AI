import { tool } from "langchain";
import { z } from "zod";

export const WeatherTool = tool(
  async ({ city }) => {
    return JSON.stringify({
      city,
      temperature: 20,
      condition: "rainy",
      humidity: 80,
      windSpeed: 15,
    });
  },
  {
    name: "get_weather",
    description: "Get the current weather for a city",
    schema: z.object({
      city: z.string().describe("The city name"),
    }),
  }
);
