import { useQuery } from '@tanstack/react-query';
import { fetchRateLimitsSummary } from '../lib/api';

export function useRateLimits(from?: string, to?: string) {
  return useQuery({
    queryKey: ['rate-limits', from, to],
    queryFn: () => fetchRateLimitsSummary(from, to),
  });
}
