import api from '../config/axios';
import type { Addon, CreateAddonRequest } from '../types/addon';

// Addon management
export async function getAllAddons(): Promise<Addon[]> {
  const response = await api.get('/addons/');
  return response.data;
}

export async function getAddon(id: number): Promise<Addon> {
  const response = await api.get(`/addons/${id}`);
  return response.data;
}

export async function createAddon(data: CreateAddonRequest): Promise<Addon> {
  const response = await api.post('/addons/', data);
  return response.data;
}

export async function updateAddon(id: number, data: Partial<CreateAddonRequest>): Promise<Addon> {
  const response = await api.put(`/addons/${id}`, data);
  return response.data;
}

export async function deleteAddon(id: number): Promise<void> {
  await api.delete(`/addons/${id}`);
}