export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://recrutplus-back.onrender.com";

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

export const API_ENDPOINTS = {
  loginAdmin: "/login/admin/",
  stats: "/api/stats/",
  domaines: "/api/domaines/",
  diplomes: "/api/diplomes/",
  campagnes: "/api/campagnes/",
  candidats: "/api/candidats/",
  demandes: "/api/demandes/",
} as const;
