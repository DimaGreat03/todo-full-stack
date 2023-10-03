import axios from "axios";


export const instance = axios.create({
  baseURL: "https://3bcb-2a03-d000-7108-c794-85aa-e54c-2cc1-4812.ngrok-free.app",
  headers: {
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
