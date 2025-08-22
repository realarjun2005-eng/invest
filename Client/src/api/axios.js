import axios from "axios";

const api = axios.create({
  baseURL: "https://invest-2-9yoa.onrender.com", // ✅ your new API URL
  withCredentials: true,
});

export default api;
