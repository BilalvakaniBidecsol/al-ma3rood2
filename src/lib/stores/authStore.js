import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, removeAuthToken, setAuthToken } from "../api/auth";
import { watchlistApi } from "../api/watchlist";
import { useWatchlistStore } from "./watchlistStore";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

       // ✅ Reset everything
       clearAuth: () => {
  removeAuthToken();
  useWatchlistStore.getState().clearWatchlist();
  localStorage.removeItem("token");
  localStorage.removeItem("auth-storage");
  set({ user: null, token: null, error: null });
},

      // Reset errors
      resetError: () => set({ error: null }),

      
login: async (email, password) => {
  set({ isLoading: true, error: null });

  try {
    const res = await authApi.login({ email, password });

    // ✅ If success
    if (res?.token) {
      const { data: user, token } = res;
      setAuthToken(token);
      set({ user, token });

      // Fetch watchlist
      try {
        const { data } = await watchlistApi.getWatchlist();
        useWatchlistStore.getState().setWatchlist(data?.data || []);
      } catch {
        useWatchlistStore.getState().setWatchlist([]);
      }
set({ isLoading: false, error: null });
      return { success: true, user };
    }

    throw new Error(res?.message || "Login failed");
  } catch (error) {
    
    set({ error: error.data?.message, isLoading: false });
    return {
      success: false,
      email: error?.data?.email || null,
      error: error?.message || "Login Failed",
    };

  } finally {
    // ✅ Always stop loader
    set({ isLoading: false });
  }
},




      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          if (userData.password !== userData.confirmPassword) {
            throw new Error("Passwords don't match");
          }

          const res = await authApi.register({
            name: userData.name,
            first_name: userData.first_name,
            last_name: userData.last_name,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            country: userData.country,
            billing_address: userData.billing_address,
            city: userData.city,
            state: userData.state,
            region: userData.region,
            governorate: userData.governorate,
            password: userData.password,
                country_id: userData.country_id,
    regions_id: userData.regions_id,
    governorates_id: userData.governorates_id,
    // city_id: userData.city_id,
          });

          // res looks like: { success, message, email }
          if (res?.success) {
            // Store only email for verification step
            set({ user: null, token: null, isLoading: false });
            return res; // return the response to handle in your component
          } else {
            throw new Error(res?.data.error || "Registration failed");
          }
        } catch (error) {
          set({ error: error?.data?.error || "Registration failed", isLoading: false });
          throw error;
        }
      },

      verifyAuth: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return null;

          const user = await authApi.verifyToken();
          set({ user });
          return user;
        } catch (error) {
          localStorage.removeItem("token");
          set({ user: null, token: null });
          return null;
        }
      },

       // ✅ Verify token and clear data if missing/invalid
      verifyAuth: async () => {
        try {
          const token = localStorage.getItem("token");

          if (!token) {
            get().clearAuth();
            return null;
          }

          const user = await authApi.verifyToken();
          if (!user) {
            get().clearAuth();
            return null;
          }

          set({ user, token });
          return user;
        } catch (error) {
          get().clearAuth();
          return null;
        }
      },


      updateUser: (updatedData) =>
        set((state) => ({
          user: { ...state.user, ...updatedData },
        })),

      logout: () => {
        set({ user: null, token: null });
        removeAuthToken();
        useWatchlistStore.getState().clearWatchlist();
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
