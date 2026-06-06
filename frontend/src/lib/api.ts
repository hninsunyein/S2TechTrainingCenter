import axios from 'axios';
import Cookies from 'js-cookie';

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const BASE_URL = BACKEND_URL;

/** Upload a file to Next.js /api/upload and return the static URL (/assets/img/...) */
export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Image upload failed');
  const { url } = (await res.json()) as { url: string };
  return url;
}

/** Resolve any imageUrl to a fully-usable src string */
export function getImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('/assets/')) return url;
  if (url.startsWith('/uploads/')) return `${BACKEND_URL}${url}`;
  return url;
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const coursesApi = {
  getAll: () => api.get('/courses').then((r) => r.data),
  getOne: (slug: string) => api.get(`/courses/${slug}`).then((r) => r.data),
  create: (data: FormData) =>
    api.post('/courses', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  update: (id: string, data: FormData) =>
    api.patch(`/courses/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  delete: (id: string) => api.delete(`/courses/${id}`).then((r) => r.data),
};

export const teachersApi = {
  getAll: () => api.get('/teachers').then((r) => r.data),
  getOne: (slug: string) => api.get(`/teachers/${slug}`).then((r) => r.data),
  create: (data: FormData) =>
    api.post('/teachers', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  update: (id: string, data: FormData) =>
    api.patch(`/teachers/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  delete: (id: string) => api.delete(`/teachers/${id}`).then((r) => r.data),
};

export const studentsApi = {
  getAll: (category?: string) =>
    api.get('/students', { params: category ? { category } : {} }).then((r) => r.data),
  create: (data: FormData) =>
    api.post('/students', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  update: (id: string, data: FormData) =>
    api.patch(`/students/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  delete: (id: string) => api.delete(`/students/${id}`).then((r) => r.data),
};

export const reviewsApi = {
  getAll: () => api.get('/reviews').then((r) => r.data),
  create: (data: unknown) => api.post('/reviews', data).then((r) => r.data),
  update: (id: string, data: unknown) => api.patch(`/reviews/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/reviews/${id}`).then((r) => r.data),
};

export const blogApi = {
  getAll: (page = 1, limit = 6) => api.get('/blog', { params: { page, limit } }).then((r) => r.data),
  getOne: (slug: string) => api.get(`/blog/${slug}`).then((r) => r.data),
  create: (data: FormData) =>
    api.post('/blog', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  update: (id: string, data: FormData) =>
    api.patch(`/blog/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  delete: (id: string) => api.delete(`/blog/${id}`).then((r) => r.data),
};

export const enrollmentsApi = {
  submit: (data: FormData) =>
    api.post('/enrollments', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  getAll: () => api.get('/enrollments').then((r) => r.data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/enrollments/${id}/status`, { status }).then((r) => r.data),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};
