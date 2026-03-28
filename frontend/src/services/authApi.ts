import axios from '../config/axios';

export interface RegisterData {
  username: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
}

export const register = async (data: RegisterData): Promise<User> => {
  const response = await axios.post('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginData): Promise<User> => {
  const response = await axios.post('/auth/login', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axios.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await axios.get('/auth/me');
  return response.data;
};