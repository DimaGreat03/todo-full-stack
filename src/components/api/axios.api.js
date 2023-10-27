import axios from "axios";


export const instance = axios.create({
  baseURL: "https://9c4a-2a03-d000-7105-4777-3de0-a2bc-aca9-ddec.ngrok-free.app",
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
