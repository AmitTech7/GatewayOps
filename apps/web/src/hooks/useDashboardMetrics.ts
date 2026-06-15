import { useQuery } from '@tanstack/react-query';
import { fetchMetricsSummary } from '../lib/api';

export function useDashboardMetrics(from?: string, to?: string) {
  return useQuery({
    queryKey: ['metrics', 'summary'],
    queryFn: () => fetchMetricsSummary(from, to),
  });
}
