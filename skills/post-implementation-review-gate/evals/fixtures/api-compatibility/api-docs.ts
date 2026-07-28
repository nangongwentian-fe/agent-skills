const configuredApiBase = "/api";

export function openApiDocumentUrl(baseUrl = configuredApiBase) {
  return `${baseUrl.replace(/\/$/, "")}/api/openapi.json`;
}

export const proxyDocumentUrl = openApiDocumentUrl(
  "/employee-card-location-correction",
);
