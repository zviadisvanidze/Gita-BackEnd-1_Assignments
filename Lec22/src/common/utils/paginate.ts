import { PaginatedResult } from '../interfaces/paginated-result.interface';

export function paginate<T>(
  items: T[],
  page: number,
  take: number,
): PaginatedResult<T> {
  const start = (page - 1) * take;
  return {
    data: items.slice(start, start + take),
    total: items.length,
    page,
    take,
  };
}
