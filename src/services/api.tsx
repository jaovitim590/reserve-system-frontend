import axios from "axios";

export const api = axios.create({
  baseURL: "https://reserve-system-backend.onrender.com",
});