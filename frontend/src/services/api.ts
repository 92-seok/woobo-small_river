import type { Location } from '../types/locations';

const API_BASE_URL = 'http://localhost:3000';

export const locationApi = {
  async getAllLocations(): Promise<Location[]> {
    const response = await fetch(`${API_BASE_URL}/api/locations`);
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return response.json();
  },

  async getLocation(id: number): Promise<Location> {
    const response = await fetch(`${API_BASE_URL}/api/locations/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location');
    }
    return response.json();
  },
};