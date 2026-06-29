"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Briefcase, Hash, List } from "lucide-react";
import { toast } from "sonner";
import DomaineForm from "../forms/DomaineForm";
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

const API_URL = apiUrl(API_ENDPOINTS.domaines);

const COLUMNS: ExportColumn[] = [
  { key: "id_dom", label: "ID" },
  { key: "lib_dom", label: "Libellé" },
];

export default function DomaineList() {
  const [domaines, setDomaines] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

  const getAuthConfig = () => {
    const token = localStorage.getItem("access_token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchDomaines = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, getAuthConfig());
      setDomaines(Array.isArray(res.data) ? res.data : res.data.results ?? []);
    } catch {
      toast.error("Impossible de charger les domaines.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDomaines();
  }, [fetchDomaines]);

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
  } = useDataTable(domaines, {
    pageSize: 10,
    searchKeys: ["lib_dom", "id_dom"],
  });

  const moduleStats = useMemo(
    () => [
      { label: "Total", value: domaines.length, icon: Briefcase },
      { label: "Affichés", value: filteredCount, icon: List },
      { label: "Page", value: `${page}/${totalPages}`, icon: Hash },
      {
        label: "Dernier ID",
        value:
          domaines.length > 0
            ? Math.max(...domaines.map((d) => Number(d.id_dom) || 0))
            : "—",
        icon: Hash,
      },
    ],
    [domaines, filteredCount, page, totalPages]
  );

  const exportData = () => rowsForExport(filtered, COLUMNS);

  const handleExportExcel = async () => {
    try {
      await exportToExcel(exportData(), "domaines", "Domaines");
    } catch {
      toast.error("Échec de l'export Excel");
    }
  };

  const handleExportPdf = async () => {
    try {
      await exportToPdf(exportData(), COLUMNS, "Liste des domaines", "domaines");
    } catch {
      toast.error("Échec de l'export PDF");
    }
  };

  const handleImportExcel = async (file: File) => {
    try {
      const rows = await importFromExcel(file);
      let ok = 0;
      for (const row of rows) {
        const lib = row.lib_dom ?? row.LibDom ?? row.libelle ?? row.Libellé;
        if (!lib) continue;
        await axios.post(API_URL, { lib_dom: String(lib) }, getAuthConfig());
        ok++;
      }
      toast.success(`${ok} domaine(s) importé(s)`);
      fetchDomaines();
    } catch {
      toast.error("Échec de l'import Excel");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}${id}/`, getAuthConfig());
      toast.success("Domaine supprimé");
      fetchDomaines();
    } catch {
      toast.error("Échec de la suppression");
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <DataTableToolbar
          title="Liste des Domaines"
          searchPlaceholder="Rechercher un domaine…"
          query={query}
          onQueryChange={setQuery}
          onExportExcel={handleExportExcel}
          onExportPdf={handleExportPdf}
          onImportExcel={handleImportExcel}
          filteredCount={filteredCount}
          totalCount={total}
        />
        <Button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-[#0A5C36] text-white hover:bg-[#0C7041] rounded-xl shadow-sm shrink-0"
        >
          + Ajouter
        </Button>
      </div>

      <ModuleStatCards items={moduleStats} loading={loading} />

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="animate-spin w-6 h-6 mr-2 text-[#0A5C36]" />
          <span className="text-gray-500">Chargement…</span>
        </div>
      ) : (
        <>
          <Table className="w-full border border-[#E7F5EF] rounded-xl shadow-sm overflow-hidden bg-white">
            <TableHeader>
              <TableRow className="bg-[#E7F5EF]">
                <TableHead className="text-[#0A5C36] font-semibold">ID</TableHead>
                <TableHead className="text-[#0A5C36] font-semibold">Libellé</TableHead>
                <TableHead className="text-right text-[#0A5C36] font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                    Aucun domaine trouvé.
                  </TableCell>
                </TableRow>
              )}
              {paginated.map((d) => (
                <TableRow
                  key={String(d.id_dom)}
                  className="hover:bg-[#E9F7F0] transition-colors"
                >
                  <TableCell className="text-[#0A5C36]">{String(d.id_dom)}</TableCell>
                  <TableCell className="text-[#0A5C36]">{String(d.lib_dom)}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[#0A5C36] border-[#0A5C36] hover:bg-[#E7F5EF]"
                      onClick={() => {
                        setSelected(d);
                        setOpenForm(true);
                      }}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setConfirmDelete({ open: true, id: Number(d.id_dom) })}
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
            fetchDomaines();
          }}
        />
      )}

      {confirmDelete.open && confirmDelete.id && (
        <ConfirmDelete
          open={confirmDelete.open}
          onClose={() => setConfirmDelete({ open: false, id: null })}
          onConfirm={() => handleDelete(confirmDelete.id!)}
          title="Supprimer le domaine"
          message="Voulez-vous vraiment supprimer ce domaine ?"
        />
      )}
    </div>
  );
}