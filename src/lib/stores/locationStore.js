import { create } from "zustand";
import { locationsApi } from "../api/location";

export const useLocationStore = create((set, get) => ({
  locations: [],
  isLoading: false,
  error: null,

  getAllLocations: async () => {
    const { locations } = get();
    if (locations.length > 0) return locations;

    set({ isLoading: true, error: null });
    try {
      const { data } = await locationsApi.getAllLocations();
      const countries = data?.countries || [];
      set({ locations: countries, isLoading: false });
      return countries;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
