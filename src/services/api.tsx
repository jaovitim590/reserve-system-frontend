import axios from "axios";

export const api = axios.create({
  baseURL: "https://reserve-system-backend.onrender.com",
});

export const adminApi = axios.create({
  baseURL: "https://reserve-system-backend.onrender.com/admin"
})