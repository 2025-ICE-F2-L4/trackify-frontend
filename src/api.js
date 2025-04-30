import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

// ✅ Add the token to request headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // ✅ Log outgoing request
        console.log(
            `%c➡️ Request [${config.method?.toUpperCase()}] ${config.url}`,
            "color: rgb(5, 163, 255); font-weight: bold;",
            config.data || ""
        );

        return config;
    },
    (error) => {
        console.error(
            "%c❌ Request Error",
            "color: red; font-weight: bold;",
            error
        );
        return Promise.reject(error);
    }
);

// ✅ Log incoming responses
api.interceptors.response.use(
    (response) => {
        console.log(
            `%c✅ Response [${response.status}] ${response.config.url}`,
            "color: rgb(85, 255, 76); font-weight: bold;",
            response.data
        );
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(
                `%c❌ Response Error [${error.response.status}] ${error.config?.url}`,
                "color: red; font-weight: bold;",
                error.response.data
            );
        } else {
            console.error(
                "%c❌ Network Error",
                "color: red; font-weight: bold;",
                error
            );
        }
        return Promise.reject(error);
    }
);

export default api;
