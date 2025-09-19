import axiosClient from "./axiosClient";

export const authApi = {
  login: (credentials) => axiosClient.post("/user/login", credentials),
  register: (userData) => axiosClient.post("/user/register", userData),
  verifyToken: () => axiosClient.get("/user/verify"),
  logout: () => axiosClient.post("/user/logout"),
  checkusername: (payload) => axiosClient.post("user/username-check", payload),
  verifyuser: (payload) => axiosClient.post("user/email-verification", payload),

  // Password reset flows
  forgotPassword: (email) =>
    axiosClient.post("/user/forgot-password", { email }),
  resetPassword: (data) => axiosClient.post("/user/reset-password", data),
};

export const setAuthToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }

  // Set cookie with Secure and SameSite=None for production
  document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=None; Secure`;
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
  document.cookie =
    "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};
