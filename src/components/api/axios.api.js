import axios from "axios";


export const instance = axios.create({
  baseURL: "https://710d-2a03-d000-710a-e063-7986-a55-5a2-dfcc.ngrok-free.app",
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
