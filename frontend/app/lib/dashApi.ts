export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return res;
}
