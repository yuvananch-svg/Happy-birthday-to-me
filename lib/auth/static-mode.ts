export function isStaticExportMode(): boolean {
  return process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
}
