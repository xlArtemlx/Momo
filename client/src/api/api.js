import axios from "axios";

const BACKEND_URL = `https://api.binance.com/api/v3`;

const REQUEST_TIMEOUT = 5000;

export const createAPI = () => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
    withCredentials: false,
  });

  const onSuccess = (response) => response;

  const onFail = (err) => {
    const {response} = err;
    if (!response) {
      throw err;
    }
    throw err;
  };

  api.interceptors.response.use(onSuccess, onFail);

  return api;
};