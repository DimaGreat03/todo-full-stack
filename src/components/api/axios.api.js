import axios from "axios";


export const instance = axios.create({
  baseURL: "https://102f-5-136-159-67.ngrok-free.app",
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ` + localStorage.getItem("token") || null,
    "ngrok-skip-browser-warning": "69420",
  },
},);

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Получите токен из Local Storage (ваша логика может отличаться)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Добавьте токен в заголовок запроса
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
