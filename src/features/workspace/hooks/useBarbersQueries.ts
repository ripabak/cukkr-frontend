import { useQuery } from '@tanstack/react-query';
import { barbersService } from '../services/barbers.service';

const BARBERS_QUERY_KEYS = {
  all: ['barbers'] as const,
  list: () => [...BARBERS_QUERY_KEYS.all, 'list'] as const,
  search: (search: string) => [...BARBERS_QUERY_KEYS.list(), search] as const,
};

export function useBarbersList(search?: string) {
  return useQuery({
    queryKey: search ? BARBERS_QUERY_KEYS.search(search) : BARBERS_QUERY_KEYS.list(),
    queryFn: () => barbersService.getList(search),
  });
}

export { BARBERS_QUERY_KEYS };
