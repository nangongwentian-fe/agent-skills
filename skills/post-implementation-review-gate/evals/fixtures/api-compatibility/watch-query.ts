export function parseWatchQuery(params: URLSearchParams) {
  const supported = new Set(["deptId"]);

  for (const key of params.keys()) {
    if (!supported.has(key)) {
      return { ok: false, error: `unsupported query parameter: ${key}` } as const;
    }
  }

  return { ok: true, deptId: params.get("deptId") } as const;
}
