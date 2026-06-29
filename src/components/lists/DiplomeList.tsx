"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Loader2, Trash2, Award, Hash, List } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import DiplomeForm from "../forms/DiplomeForm";
import DiplomeView from "@/components/DiplomeView";
import ConfirmDelete from "@/components/ConfirmDelete";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = apiUrl(API_ENDPOINTS.diplomes);

const COLUMNS: ExportColumn[] = [
  { key: "id_diplome", label: "ID" },
  { key: "designation", label: "Désignation" },
  { key: "domaine_lib", label: "Domaine" },
];

interface DiplomeListProps {
  onAdd: () => void;
  onEdit: (id: number) => void;
}

export default function DiplomeList({ onAdd, onEdit }: DiplomeListProps) {
  const [diplomes, setDiplomes] = useState<Record<string, unknown>[]>([]);
  const [domaines, setDomaines] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [domaineFilter, setDomaineFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

  const getAuthConfig = () => {
    const token = localStorage.getItem("access_token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchDiplomes = useCallback(async () => {
    setLoading(true);
    try {
      const [dipRes, domRes] = await Promise.all([
        axios.get(API_URL, getAuthConfig()),
        axios.get(apiUrl(API_ENDPOINTS.domaines), getAuthConfig()),
      ]);

      const listDomaines = Array.isArray(domRes.data) ? domRes.data : domRes.data.results ?? [];
      setDomaines(listDomaines);

      const listDiplomes = Array.isArray(dipRes.data) ? dipRes.data : dipRes.data.results ?? [];
      
      // Reconstruction propre du libellé pour éviter l'affichage de "N/A"
      setDiplomes(
        listDiplomes.map((d: Record<string, unknown>) => {
          let libelle = "Non renseigné";
          
          // Cas 1 : Domaine est un objet imbriqué
          if (d.domaine && typeof d.domaine === "object") {
            libelle = (d.domaine as { lib_dom?: string })?.lib_dom ?? 
                      (d.domaine as { libdom?: string })?.libdom ?? 
                      libelle;
          } 
          // Cas 2 : Domaine est uniquement un ID numérique (on cherche la correspondance dans les domaines chargés)
          else if (d.domaine) {
            const match = listDomaines.find((dom: Record<string, unknown>) => String(dom.id_dom) === String(d.domaine));
            if (match) {
              libelle = String(match.lib_dom || match.libdom || libelle);
            }
          }

          return {
            ...d,
            domaine_lib: libelle,
          };
        })
      );
    } catch {
      toast.error("Impossible de charger les diplômes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiplomes();
  }, [fetchDiplomes]);

  const filterFn = useCallback(
    (item: Record<string, unknown>) => {
      if (domaineFilter === "all") return true;
      const domId =
        typeof item.domaine === "object"
          ? (item.domaine as { id_dom?: number })?.id_dom
          : item.domaine;
      return String(domId) === domaineFilter;
    },
    [domaineFilter]
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
  } = useDataTable(diplomes, {
    pageSize: 10,
    searchKeys: ["designation", "id_diplome", "domaine_lib"],
    filterFn,
  });

  const moduleStats = useMemo(
    () => [
      { label: "Total", value: diplomes.length, icon: Award },
      { label: "Filtrés", value: filteredCount, icon: List },
      { label: "Domaines", value: domaines.length, icon: Hash },
      { label: "Page", value: `${page}/${totalPages}`, icon: Hash },
    ],
    [diplomes, filteredCount, domaines, page, totalPages]
  );

  const exportData = () => rowsForExport(filtered, COLUMNS);

  const handleExportExcel = async () => {
    try {
      await exportToExcel(exportData(), "diplomes", "Diplômes");
    } catch {
      toast.error("Échec de l'export Excel");
    }
  };

  const handleExportPdf = async () => {
    try {
      await exportToPdf(exportData(), COLUMNS, "Liste des diplômes", "diplomes");
    } catch {
      toast.error("Échec de l'export PDF");
    }
  };

  const handleImportExcel = async (file: File) => {
    try {
      const rows = await importFromExcel(file);
      let ok = 0;
      for (const row of rows) {
        const designation = row.designation ?? row.Designation;
        const domaine = row.domaine ?? row.domaineId ?? row.IdDom;
        if (!designation || !domaine) continue;
        await axios.post(API_URL, {
          designation: String(designation),
          domaine: Number(domaine),
        }, getAuthConfig());
        ok++;
      }
      toast.success(`${ok} diplôme(s) importé(s)`);
      fetchDiplomes();
    } catch {
      toast.error("Échec de l'import Excel");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}${id}/`, getAuthConfig());
      toast.success("Diplôme supprimé");
      fetchDiplomes();
    } catch {
      toast.error("Échec de la suppression");
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div className="flex-1 min-w-0">
          <DataTableToolbar
            title="Liste des Diplômes"
            searchPlaceholder="Rechercher un diplôme…"
            query={query}
            onQueryChange={setQuery}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
            onImportExcel={handleImportExcel}
            filteredCount={filteredCount}
            totalCount={total}
          >
            <Select value={domaineFilter} onValueChange={setDomaineFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Domaine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les domaines</SelectItem>
                {domaines.map((d) => (
                  <SelectItem key={String(d.id_dom)} value={String(d.id_dom)}>
                    {String(d.lib_dom)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DataTableToolbar>
        </div>
        <Button
          onClick={onAdd}
          className="bg-[#0A5C36] text-white hover:bg-[#0C7041] rounded-xl shadow-sm shrink-0"
        >
          + Ajouter
        </Button>
      </div>

      <ModuleStatCards items={moduleStats} loading={loading} />

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="animate-spin w-6 h-6 text-[#0A5C36]" />
        </div>
      ) : (
        <>
          <Table className="w-full border border-[#E6F4ED] rounded-xl shadow-sm overflow-hidden bg-white">
            <TableHeader>
              <TableRow className="bg-[#E7F5EF]">
                <TableHead className="text-[#0A5C36]">ID</TableHead>
                <TableHead className="text-[#0A5C36]">Désignation</TableHead>
                <TableHead className="text-[#0A5C36]">Domaine</TableHead>
                <TableHead className="text-right text-[#0A5C36]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    Aucun diplôme trouvé.
                  </TableCell>
                </TableRow>
              )}
              {paginated.map((d) => (
                <TableRow key={String(d.id_diplome)} className="hover:bg-[#E9F7F0]">
                  {/* Suppression du symbole # */}
                  <TableCell>{String(d.id_diplome)}</TableCell>
                  <TableCell className="font-medium">{String(d.designation)}</TableCell>
                  <TableCell>{String(d.domaine_lib)}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelected(d);
                        setOpenView(true);
                      }}
                    >
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(Number(d.id_diplome))}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setConfirmDelete({ open: true, id: Number(d.id_diplome) })
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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

      {openForm && (
        <DomaineForm
          domaine={selected}
          onClose={() => {
            setOpenForm(false);
            fetchDiplomes();
          }}
        />
      )}

      {openView && selected && (
        <DiplomeView diplome={selected} onClose={() => setOpenView(false)} />
      )}

      {confirmDelete.open && confirmDelete.id && (
        <ConfirmDelete
          open={confirmDelete.open}
          onClose={() => setConfirmDelete({ open: false, id: null })}
          onConfirm={() => handleDelete(confirmDelete.id!)}
          title="Supprimer le diplôme"
          message="Voulez-vous vraiment supprimer ce diplôme ?"
        />
      )}
    </div>
  );
}