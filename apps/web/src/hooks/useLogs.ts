import { useQuery } from '@tanstack/react-query';
import { fetchLogs } from '../lib/api';

export function useLogs(page: number, limit: number, filters?: any) {
  return useQuery({
    queryKey: ['logs', page, limit, filters],
    queryFn: () => fetchLogs(page, limit, filters),
  });
}
