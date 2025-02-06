import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const axiosAPI = axios.create({
  baseURL: API_URL,
  validateStatus: function (status) {
    return status >= 200 && status < 600; // Allow all responses
  },
});

// Centralized error handling function
const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    // Axios error with response
    if (error.response) {
      const { status, data } = error.response;
      const message = (data as { message?: string }).message || "An error occurred";

      toast.error(`Error ${status}: ${message}`);
    } 
    // No response (e.g., network error)
    else if (error.request) {
      toast.error("Network error: No response received from server");
    } 
    // Error in setting up the request
    else {
      toast.error(`Request error: ${error.message}`);
    }
  } else {
    // Non-Axios errors
    toast.error("An unexpected error occurred");
  }
};

export const get = async (url: string, data: any, config = {}, token: string = '') => {
  try {
    if (token) {
      axiosAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axiosAPI.defaults.headers.common["Authorization"];
    }
    const response = await axiosAPI.get(url, { ...config, params: data });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error; // Re-throw to allow further handling if needed
  }
};

export const post = async (url: string, data: any, config = {}, token: string = '') => {
  try {
    if (token) {
      axiosAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axiosAPI.defaults.headers.common["Authorization"];
    }
    const response = await axiosAPI.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
      ...config,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const postbusiness = async (url: string, data: any, config = {}, token: string = '') => {
  try {
    if (token) {
      axiosAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axiosAPI.defaults.headers.common["Authorization"];
    }
    const response = await axiosAPI.post(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const del = async (url: string, data: any, config = {}, token: string = '') => {
  try {
    if (token) {
      axiosAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axiosAPI.defaults.headers.common["Authorization"];
    }
    const response = await axiosAPI.delete(url, { ...config, params: data });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const put = async (url: string, data: any, config = {}, token: string = '') => {
  try {
    if (token) {
      axiosAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axiosAPI.defaults.headers.common["Authorization"];
    }
    const response = await axiosAPI.put(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
