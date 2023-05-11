import axios from "axios";
import jwt_decode from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: "http://192.168.1.13:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem('@accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401) {
//       try {
//         const refreshToken = localStorage.getItem("refreshToken");
//         const decodedToken = jwt_decode(refreshToken);

//         if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
//           window.location.replace("/auth");
//           return;
//         }

//         const { data } = await api.post(`/auth/refresh-token`, {
//           token: refreshToken,
//         });
//         localStorage.setItem("accessToken", data.accessToken);
//         localStorage.setItem("refreshToken", data.refreshToken);
//         api.defaults.headers.common["Authorization"] =
//           "Bearer " + data.accessToken;
//         return api(originalRequest);
//       } catch (e) {
//         return Promise.reject(error);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
