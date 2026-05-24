"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Edit3, Trash2, ExternalLink, FileStack } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import DataTableToolbar from "../DataTableToolbar";
import PaginationControls from "../PaginationControls";
import ModuleStatCards from "../ModuleStatCards";
import { useDataTable } from "@/hooks/useDataTable";
import { API_BASE_URL, API_ENDPOINTS, apiUrl } from "@/lib/api";
import {
  exportToExcel,
  exportToPdf,
  importFromExcel,
  rowsForExport,
  type ExportColumn,
} from "@/lib/export";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Demande {
  id: number;
  cv: string;
  diplome_fichier?: string | null;
  anne_obt_dip: number;
  candidat: number;
  campagne: string;
  date_creation?: string;
}

const API_URL = apiUrl(API_ENDPOINTS.demandes);

const COLUMNS: ExportColumn[] = [
  { key: "id", label: "ID" },
  { key: "candidat", label: "ID Candidat" },
  { key: "campagne", label: "Campagne" },
  { key: "anne_obt_dip", label: "Année diplôme" },
  { key: "cv", label: "CV" },
];

interface DemandeListProps {
  onAdd: () => void;
  onEdit: (demande: Demande) => void;
}

export default function DemandeList({ onAdd, onEdit }: DemandeListProps) {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [campagneFilter, setCampagneFilter] = useState("");
  const [anneeFilter, setAnneeFilter] = useState("");

  const fetchDemandes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setDemandes(Array.isArray(res.data) ? res.data : res.data.results ?? []);
    } catch {
      toast.error("Erreur de chargement des demandes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDemandes();
  }, [fetchDemandes]);

  const filterFn = useCallback(
    (item: Demande) => {
      const matchCampagne =
        !campagneFilter.trim() ||
        String(item.campagne)
          .toLowerCase()
          .includes(campagneFilter.toLowerCase());
      const matchAnnee =
        !anneeFilter || String(item.anne_obt_dip) === anneeFilter;
      return matchCampagne && matchAnnee;
    },
    [campagneFilter, anneeFilter]
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
  } = useDataTable(demandes, {
    pageSize: 10,
    searchKeys: ["id", "candidat", "campagne"],
    filterFn,
  });

  const moduleStats = useMemo(
    () => [
      { label: "Total", value: demandes.length, icon: FileStack },
      { label: "Filtrées", value: filteredCount, icon: FileText },
      {
        label: "Année moy.",
        value:
          demandes.length > 0
            ? Math.round(
                demandes.reduce((s, d) => s + (d.anne_obt_dip || 0), 0) /
                  demandes.length
              )
            : "—",
        icon: FileText,
      },
      { label: "Page", value: `${page}/${totalPages}`, icon: FileText },
    ],
    [demandes, filteredCount, page, totalPages]
  );

  const exportData = () =>
    rowsForExport(
      filtered.map((d) => ({
        id: d.id,
        candidat: d.candidat,
        campagne: d.campagne,
        anne_obt_dip: d.anne_obt_dip,
        cv: d.cv,
      })),
      COLUMNS
    );

  const handleExportExcel = async () => {
    try {
      await exportToExcel(exportData(), "demandes", "Demandes");
    } catch {
      toast.error("Échec de l'export Excel");
    }
  };

  const handleExportPdf = async () => {
    try {
      await exportToPdf(exportData(), COLUMNS, "Liste des demandes", "demandes");
    } catch {
      toast.error("Échec de l'export PDF");
    }
  };

  const handleImportExcel = async (file: File) => {
    toast.info(
      "L'import des demandes nécessite des fichiers CV. Seules les métadonnées sont importées."
    );
    try {
      const rows = await importFromExcel(file);
      let ok = 0;
      for (const row of rows) {
        const candidat = row.candidat ?? row.IdCandidat;
        const campagne = row.campagne ?? row.CodAnne;
        const annee = row.anne_obt_dip ?? row.AnneObtDip;
        if (!candidat || !campagne || !annee) continue;
        const form = new FormData();
        form.append("candidat", String(candidat));
        form.append("campagne", String(campagne));
        form.append("anne_obt_dip", String(annee));
        const cvPath = row.cv ?? row.CV;
        if (cvPath) {
          try {
            const blob = await fetch(String(cvPath)).then((r) => r.blob());
            form.append("cv", blob, "cv.pdf");
          } catch {
            continue;
          }
        } else {
          continue;
        }
        await axios.post(API_URL, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        ok++;
      }
      toast.success(`${ok} demande(s) importée(s)`);
      fetchDemandes();
    } catch {
      toast.error("Échec de l'import — vérifiez le format du fichier");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette demande ?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      toast.success("Demande supprimée");
      fetchDemandes();
    } catch {
      toast.error("Échec de la suppression");
    }
  };

  const mediaUrl = (path: string) =>
    path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin w-8 h-8 text-[#0A5C36]" />
        <span className="ml-3 text-gray-500">Chargement…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div className="flex-1 min-w-0">
          <DataTableToolbar
            title="Liste des Demandes"
            searchPlaceholder="ID, candidat, campagne…"
            query={query}
            onQueryChange={setQuery}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
            onImportExcel={handleImportExcel}
            filteredCount={filteredCount}
            totalCount={total}
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <div>
                <Label className="text-xs text-gray-500">Campagne</Label>
                <Input
                  placeholder="Filtrer campagne"
                  value={campagneFilter}
                  onChange={(e) => setCampagneFilter(e.target.value)}
                  className="h-9 w-[140px]"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Année</Label>
                <Input
                  placeholder="ex. 2020"
                  value={anneeFilter}
                  onChange={(e) => setAnneeFilter(e.target.value)}
                  className="h-9 w-[100px]"
                />
              </div>
            </div>
          </DataTableToolbar>
        </div>
        <Button
          onClick={onAdd}
          className="bg-[#0A5C36] hover:bg-[#1B7A53] text-white rounded-xl shrink-0"
        >
          + Nouvelle
        </Button>
      </div>

      <ModuleStatCards items={moduleStats} />

      <div className="rounded-2xl border border-[#E6F4ED] shadow-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E7F5EF]">
              <TableHead className="text-[#0A5C36]">ID</TableHead>
              <TableHead className="text-[#0A5C36]">Documents</TableHead>
              <TableHead className="text-[#0A5C36]">Année</TableHead>
              <TableHead className="text-[#0A5C36]">Candidat</TableHead>
              <TableHead className="text-[#0A5C36]">Campagne</TableHead>
              <TableHead className="text-right text-[#0A5C36]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                  Aucune demande trouvée.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((d) => (
                <TableRow key={d.id} className="hover:bg-[#F3F9F5]">
                  <TableCell className="text-center">{d.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <a
                        href={mediaUrl(d.cv)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center text-blue-600 hover:underline text-xs"
                      >
                        <FileText className="w-3 h-3 mr-1" /> CV
                      </a>
                      {d.diplome_fichier && (
                        <a
                          href={mediaUrl(d.diplome_fichier)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center text-emerald-600 hover:underline text-xs"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" /> Diplôme
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{d.anne_obt_dip}</TableCell>
                  <TableCell className="font-semibold">#{d.candidat}</TableCell>
                  <TableCell>{d.campagne}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(d)}>
                      <Edit3 className="w-4 h-4 mr-1" /> Modifier
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#D72638] text-white"
                      onClick={() => handleDelete(d.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredCount > 0 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  );
}
