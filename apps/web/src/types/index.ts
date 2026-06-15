export interface MetricsSummary {
  total_requests: number;
  failed_requests: number;
  success_rate: number;
  auth_failures: number;
  avg_response_time: number;
  rate_limit_violations: number;
}

export interface ApiLog {
  id: string;
  service_id: string;
  endpoint: string;
  method: string;
  status_code: number;
  latency_ms: number;
  created_at: string;
  service_name?: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  status: 'healthy' | 'degraded' | 'down';
  description?: string;
  base_url?: string;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
}

export interface ServiceDistribution {
  service: string;
  request_count: number;
  percentage: number;
}

export interface RateLimitViolation {
  id: string;
  user_id?: string;
  service_id?: string;
  endpoint?: string;
  request_count: number;
  window_start: string;
  window_end: string;
}

export interface AuthEvent {
  id: string;
  event_type: string;
  created_at: string;
}
