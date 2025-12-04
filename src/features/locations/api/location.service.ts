import axios from "axios";
import { Location } from "@/types/location";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const LocationService = {
    getAll: async (): Promise<Location[]> => {
        try {
            const response = await axios.get<Location[]>(`${API_URL}/locations`);
            return response.data;
        } catch (error) {
            console.error("Error fetching locations:", error);
            return [];
        }
    },

    getById: async (id: string): Promise<Location | null> => {
        try {
            const response = await axios.get<Location>(`${API_URL}/locations/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching location ${id}:`, error);
            return null;
        }
    },

    create: async (location: Omit<Location, "id">): Promise<Location | null> => {
        try {
            const response = await axios.post<Location>(`${API_URL}/locations`, location);
            return response.data;
        } catch (error) {
            console.error("Error creating location:", error);
            return null;
        }
    },
};
