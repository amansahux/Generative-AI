import axios from "axios";
const API = axios.create({
    baseURL: "/api/",
    withCredentials: true,
})

const fetchResponse = async (prompt: string) => {
    try {

        const response = await API.post("/run-graph", { prompt });
        return response.data;
    } catch (error) {
        console.error("Error fetching response:", error);
        throw error
    }
}

export {fetchResponse}
