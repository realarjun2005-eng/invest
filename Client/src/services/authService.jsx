import axios from 'axios';
import api from '../api/axios';
const API_URL = 'https://invest-2-9yoa.onrender.com/api/auth';

export const registerUser = async (data) => {
  const res = await api.post(`${API_URL}/register`, data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post(`${API_URL}/login`, data);
  return res.data;
};
