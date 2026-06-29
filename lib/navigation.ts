export function withBasePath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!basePath) return normalized;
  return `${basePath}${normalized}`;
}
