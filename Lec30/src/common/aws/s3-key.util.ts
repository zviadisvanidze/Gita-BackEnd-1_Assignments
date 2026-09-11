import { randomUUID } from 'crypto';

export function buildObjectKey(
  folder: 'users' | 'movies',
  entityId: number,
  originalName: string,
): string {
  const sanitized = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  return `${folder}/${entityId}/${randomUUID()}-${sanitized}`;
}
