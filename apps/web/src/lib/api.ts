import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer fake_token_for_demo`,
  },
});

export async function fetchMetricsSummary(from?: string, to?: string) {
  const response = await api.get('/metrics/summary', { params: { from, to } });
  return response.data.data;
}

export async function fetchRequestsOverTime(interval?: 'hour' | 'day', from?: string, to?: string) {
  const response = await api.get('/metrics/requests-over-time', { params: { interval, from, to } });
  return response.data.data;
}

export async function fetchErrorTrends(from?: string, to?: string) {
  const response = await api.get('/metrics/error-trends', { params: { from, to } });
  return response.data.data;
}

export async function fetchServiceDistribution(from?: string, to?: string) {
  const response = await api.get('/metrics/service-distribution', { params: { from, to } });
  return response.data.data;
}

export async function fetchLogs(page: number, limit: number, filters?: any) {
  const response = await api.get('/logs', { params: { page, limit, ...filters } });
  return response.data;
}

export async function fetchServices() {
  const response = await api.get('/services');
  return response.data.data;
}

export async function fetchAuthStats(from?: string, to?: string) {
  const response = await api.get('/auth/stats', { params: { from, to } });
  return response.data.data;
}

export async function fetchRateLimitsSummary(from?: string, to?: string) {
  const response = await api.get('/rate-limits/summary', { params: { from, to } });
  return response.data.data;
}
