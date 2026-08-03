/**
 * @file ai/tools/time.tool.js
 * @description Placeholder for the Time AI tool.
 * This tool will allow the AI to return the current date and time for a given timezone.
 */

import { tool } from "langchain";


/**
 * Time tool definition.
 * No implementation — placeholder only.
 *
 * @type {Object}
 */
const execute = async ({ timezone = "UTC" }) => {
  try {
    const options = {
      timeZone: timezone,
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "long",
    };
    const formatter = new Intl.DateTimeFormat([], options);
    return formatter.format(new Date());
  } catch (error) {
    // Fallback if the timezone is invalid
    const utcOptions = {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "long",
    };
    const formatter = new Intl.DateTimeFormat([], utcOptions);
    return `Error: Invalid timezone "${timezone}". Current UTC time is: ${formatter.format(new Date())}`;
  }
}
export const timeTool = tool(execute, {
  name: "time",
  description: "Returns the current date and time for a specified timezone.",
})
