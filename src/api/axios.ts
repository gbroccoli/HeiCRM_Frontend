import axios from 'axios';

// Базовый URL API - можно вынести в переменные окружения
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Создаем экземпляр axios с базовыми настройками
export const $api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Если нужны cookies для авторизации
});

// Interceptor для добавления токена к каждому запросу
$api.interceptors.request.use(
    (config) => {
        // Получаем токен из localStorage
        const token = localStorage.getItem('accessToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor для обработки ответов и ошибок
$api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // URL эндпоинты, которые не требуют автоматического обновления токена
        // /auth/login - пользователь еще не авторизован
        // /auth/refresh - сам эндпоинт обновления (избежание бесконечного цикла)
        const excludedUrls = ['/auth/login', '/auth/refresh'];
        const isExcludedUrl = excludedUrls.some(url => originalRequest.url?.includes(url));

        // Обработка ошибки 401 (Unauthorized)
        // Не обрабатываем 401 для эндпоинтов авторизации
        if (error.response?.status === 401 && !originalRequest._retry && !isExcludedUrl) {
            originalRequest._retry = true;

            try {
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`);

                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);

                // Повторяем оригинальный запрос с новым токеном
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return $api(originalRequest);
            } catch (refreshError) {
                // Если refresh не удался, перенаправляем на логин
                localStorage.removeItem('accessToken');
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default $api;
