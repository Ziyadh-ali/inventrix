import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            error.response?.data?.message === "Invalid or expired access token" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = res.data.accessToken;
                localStorage.setItem("access_token", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return axiosInstance(originalRequest);
            } catch (error) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user_details");
                window.location.href = "/login";
                return Promise.reject(error);
            }
        }
        if (
            error.response?.status === 401 &&
            error.response?.data?.message === "Missing or invalid token" &&
            !originalRequest._retry
        ) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_details");
            window.location.href = "/login";

        }
        if (
            error.response?.status === 401 &&
            error.response?.data?.message === "No refresh token" &&
            !originalRequest._retry
        ) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_details");
            window.location.href = "/login";

        }
        if (
            error.response?.status === 403 &&
            error.response?.data?.message === "Invalid refresh token" &&
            !originalRequest._retry
        ) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_details");    
            window.location.href = "/login";

        }
        return Promise.reject(error);
    }
)

export default axiosInstance;