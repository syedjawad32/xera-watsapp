import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_DOMAIN_NAME;

if (!apiBaseUrl) {
  throw new Error("VITE_API_DOMAIN_NAME is not defined");
}

const apiClient = axios.create({
  baseURL: `${apiBaseUrl}/landlord`
});

export default apiClient;

