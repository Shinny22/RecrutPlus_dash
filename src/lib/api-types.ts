/** Enregistrement API (snake_case) utilisé dans listes et formulaires */
export type ApiRecord = Record<string, unknown>;

export function display(value: unknown, fallback = "—"): string {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

export function displayDate(value: unknown, fallback = "—"): string {
  if (!value) return fallback;
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? fallback : d.toLocaleDateString("fr-FR");
}

export interface DomaineRecord extends ApiRecord {
  id_dom?: number;
  lib_dom?: string;
}

export interface DiplomeRecord extends ApiRecord {
  id_diplome?: number;
  designation?: string;
  domaine?: number;
}
