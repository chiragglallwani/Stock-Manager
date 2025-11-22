import { apiClient } from "@/lib/api-client";

export interface Location {
  id?: number;
  name: string;
  warehouse_code: string;
}

class LocationService {
  async getAllLocations(): Promise<Location[]> {
    const response = await apiClient.get<Location[]>("/locations");
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to fetch locations");
    }
    return response.data;
  }

  async createLocation(data: {
    name: string;
    warehouse_code: string;
  }): Promise<Location> {
    const response = await apiClient.post<Location>("/locations", data);
    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to create location");
    }
    return response.data;
  }

  async deleteLocation(id: number): Promise<void> {
    const response = await apiClient.delete(`/locations/${id}`);
    if (!response.success) {
      throw new Error(response.error || "Failed to delete location");
    }
  }
}

export const locationService = new LocationService();
