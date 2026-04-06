import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
    }
});

export const api = {
    postAIMessage: async (game_info) => {
        let response = await apiClient.post("/ai_message", game_info);
        return response.data;
    }
}
