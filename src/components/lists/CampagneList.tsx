"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Loader2, Megaphone, List, Hash } from "lucide-react";
import ConfirmDelete from "../ConfirmDelete";
import CampagneView from "../CampagneView";
import DataTableToolbar from "../DataTableToolbar";
import PaginationControls from "../PaginationControls";
import ModuleStatCards from "../ModuleStatCards";
import { useDataTable } from "@/hooks/useDataTable";
import { API_ENDPOINTS, apiUrl } from "@/lib/api";
import {
  exportToExcel,
  exportToPdf,
  importFromExcel,
  rowsForExport,
  type ExportColumn,
} from "@/lib/export";
import { toast } from "sonner";
import type { Campagne } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = apiUrl(API_ENDPOINTS.campagnes);

const COLUMNS: ExportColumn[] = [
  { key: "cod_anne", label: "Code" },
  { key: "description", label: "Description" },
  { key: "dat_debut", label: "Date début" },
  { key: "dat_fin", label: "Date fin" },
  { key: "etat", label: "État" },
];

interface CampagneListProps {
  onAdd: () => void;
  onEdit: (campagne: Record<string, unknown>) => void;
}

export default function CampagneList({ onAdd, onEdit }: CampagneListProps) {
  const [campagnes, setCampagnes] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<Record<string, unknown> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);
  const [etatFilter, setEtatFilter] = useState("all");

  // Fonction utilitaire pour injecter le token JWT
  const getAuthConfig = () => {
    const token = localStorage.getItem("access_token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchCampagnes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, getAuthConfig());
      setCampagnes(Array.isArray(res.data) ? res.data : res.data.results ?? []);
    } catch {
      toast.error("Impossible de charger les campagnes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampagnes();
  }, [fetchCampagnes]);

  const etats = useMemo(() => {
    const set = new Set<string>();
    campagnes.forEach((c) => {
      if (c.etat) set.add(String(c.etat));
    });
    return Array.from(set);
  }, [campagnes]);

  const filterFn = useCallback(
    (item: Record<string, unknown>) =>
      etatFilter === "all" || String(item.etat) === etatFilter,
    [etatFilter]
  );

  const {
    query,
    setQuery,
    page,
    setPage,
    pageSize,
    setPageSize,
    paginated,
    filtered,
    totalPages,
    total,
    filteredCount,
  } = useDataTable(campagnes, {
    pageSize: 10,
    searchKeys: ["cod_anne", "description", "etat"],
    filterFn,
  });

  const exportRows = useMemo(
    () =>
      rowsForExport(
        filtered.map((c) => ({
          cod_anne: c.cod_anne,
          description: c.description,
          dat_debut: c.dat_debut
            ? new Date(String(c.dat_debut)).toLocaleDateString("fr-FR")
            : "",
          dat_fin: c.dat_fin
            ? new Date(String(c.dat_fin)).toLocaleDateString("fr-FR")
            : "",
          etat: c.etat,
        })),
        COLUMNS
      ),
    [filtered]
  );

  const moduleStats = useMemo(
    () => [
      { label: "Total", value: campagnes.length, icon: Megaphone },
      { label: "Filtrées", value: filteredCount, icon: List },
      { label: "En cours", value: campagnes.filter((c) => c.etat === "En cours" || c.etat === "Ouvert").length, icon: Hash },
      { label: "Clôturées", value: campagnes.filter((c) => c.etat === "Clôturée").length, icon: Hash },
    ],
    [campagnes, filteredCount]
  );

  const handleExportExcel = async () => {
    try {
      await exportToExcel(exportRows, "campagnes", "Campagnes");
    } catch {
      toast.error("Échec de l'export Excel");
    }
  };

  const handleExportPdf = async () => {
    try {
      await exportToPdf(exportRows, COLUMNS, "Liste des campagnes", "campagnes");
    } catch {
      toast.error("Échec de l'export PDF");
    }
  };

  const handleImportExcel = async (file: File) => {
    try {
      const rows = await importFromExcel(file);
      let ok = 0;
      for (const row of rows) {
        const cod = row.cod_anne ?? row.CodAnne;
        const description = row.description ?? row.Description;
        if (!cod || !description) continue;
        await axios.post(API_URL, {
          cod_anne: String(cod),
          description: String(description),
          dat_debut: row.dat_debut ?? row.DatDebut ?? new Date().toISOString().slice(0, 10),
          dat_fin: row.dat_fin ?? row.DatFin ?? new Date().toISOString().slice(0, 10),
          etat: row.etat ?? row.Etat ?? "Ouvert",
        }, getAuthConfig());
        ok++;
      }
      toast.success(`${ok} campagne(s) importée(s)`);
      fetchCampagnes();
    } catch {
      toast.error("Échec de l'import Excel");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API_URL}${deleteTarget.cod_anne}/`, getAuthConfig());
      toast.success("Campagne supprimée");
      setDeleteTarget(null);
      fetchCampagnes();
    } catch {
      toast.error("Impossible de supprimer la campagne.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div className="flex-1 min-w-0">
          <DataTableToolbar
            title="Liste des Campagnes"
            searchPlaceholder="Rechercher une campagne…"
            query={query}
            onQueryChange={setQuery}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
            onImportExcel={handleImportExcel}
            filteredCount={filteredCount}
            totalCount={total}
          >
            <Select value={etatFilter} onValueChange={setEtatFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="État" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les états</SelectItem>
                {etats.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DataTableToolbar>
        </div>
        <Button
          onClick={onAdd}
          className="rounded-xl bg-[#0A5C36] hover:bg-[#1B7A53] text-white shadow-md shrink-0"
        >
          + Ajouter
        </Button>
      </div>

      <ModuleStatCards items={moduleStats} loading={loading} />

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-[#0A5C36]" />
        </div>
      ) : (
        <>
          <Table className="w-full rounded-xl border border-[#E6F4ED] shadow-lg overflow-hidden bg-white">
            <TableHeader>
              <TableRow className="bg-[#E7F5EF]">
                <TableHead className="text-[#0A5C36]">Code</TableHead>
                <TableHead className="text-[#0A5C36]">Description</TableHead>
                <TableHead className="text-[#0A5C36]">Début</TableHead>
                <TableHead className="text-[#0A5C36]">Fin</TableHead>
                <TableHead className="text-[#0A5C36]">État</TableHead>
                <TableHead className="text-right text-[#0A5C36]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    Aucune campagne trouvée.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((c) => (
                  <TableRow key={String(c.cod_anne)} className="hover:bg-[#E7F5EF]">
                    <TableCell className="font-medium text-[#0A5C36]">
                      {String(c.cod_anne)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={String(c.description)}>
                      {String(c.description)}
                    </TableCell>
                    <TableCell>
                      {c.dat_debut
                        ? new Date(String(c.dat_debut)).toLocaleDateString("fr-FR")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {c.dat_fin
                        ? new Date(String(c.dat_fin)).toLocaleDateString("fr-FR")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#E7F5EF] text-[#0A5C36]">
                        {String(c.etat)}
                      </span>
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedView(c)}
                      >
                        Voir
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onEdit(c)}>
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#D72638] text-white hover:bg-[#b52030]"
                        onClick={() => setDeleteTarget(c)}
                      >
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {filteredCount > 0 && (
            <PaginationControls
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </>
      )}

      {selectedView && (
        <CampagneView
          campagne={selectedView as unknown as Campagne}
          onClose={() => setSelectedView(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDelete
          open={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Confirmer la suppression"
          message={`Supprimer la campagne « ${deleteTarget.description} » ?`}
        />
      )}
    </div>
  );
}