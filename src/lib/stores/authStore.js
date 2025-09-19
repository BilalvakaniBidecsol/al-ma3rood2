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

      // Reset errors
      resetError: () => set({ error: null }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data: user, token } = await authApi.login({
            email,
            password,
          });
          setAuthToken(token);
          set({ user, token, isLoading: false });
          // Fetch and set watchlist after login
          try {
            const { data } = await watchlistApi.getWatchlist();
            useWatchlistStore.getState().setWatchlist(data?.data || []);
          } catch (e) {
            useWatchlistStore.getState().setWatchlist([]);
          }
          return user;
        } catch (error) {
          set({ error: error?.message || "Login Failed", isLoading: false });
          throw error;
        }
      },

      // register: async (userData) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     if (userData.password !== userData.confirmPassword) {
      //       throw new Error("Passwords don't match");
      //     }

      //     const { data: user, token } = await authApi.register({
      //       name: userData.name,
      //       first_name: userData.first_name,
      //       last_name: userData.last_name,
      //       username:userData.username, 
      //       email: userData.email,
      //       phone: userData.phone,
      //       country: userData.country,
      //       billing_address: userData.billing_address,
      //       city: userData.city,
      //       state: userData.state,
      //       password: userData.password,
      //     });

      //     localStorage.setItem("token", token);
      //     set({ user, token, isLoading: false });
      //     return user;
      //   } catch (error) {
      //     set({ error: error.data?.error, isLoading: false });
      //     throw error;
      //   }
      // },
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
            password: userData.password,
          });

          // res looks like: { success, message, email }
          if (res?.success) {
            // Store only email for verification step
            set({ user: null, token: null, isLoading: false });
            return res; // return the response to handle in your component
          } else {
            throw new Error(res?.message || "Registration failed");
          }
        } catch (error) {
          set({ error: error.message || "Registration failed", isLoading: false });
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
