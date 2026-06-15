import { useQuery } from '@tanstack/react-query';
import { fetchAuthStats } from '../lib/api';

export function useAuthStats(from?: string, to?: string) {
  return useQuery({
    queryKey: ['auth', 'stats', from, to],
    queryFn: () => fetchAuthStats(from, to),
  });
}
