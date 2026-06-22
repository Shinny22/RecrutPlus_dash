// "use client";

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableHead,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Loader2, User, Eye, Edit3, Trash2, Users, List, Hash } from "lucide-react";
// import { toast } from "sonner";
// import type { ApiRecord } from "@/lib/api-types";
// import CandidatView from "../CandidatView";
// import DataTableToolbar from "../DataTableToolbar";
// import PaginationControls from "../PaginationControls";
// import ModuleStatCards from "../ModuleStatCards";
// import { useDataTable } from "@/hooks/useDataTable";
// import { API_ENDPOINTS, apiUrl } from "@/lib/api";
// import {
//   exportToExcel,
//   exportToPdf,
//   importFromExcel,
//   rowsForExport,
//   type ExportColumn,
// } from "@/lib/export";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface Candidat {
//   id_candidat: number;
//   nom_cand: string;
//   pren_cand: string;
//   genre: string;
//   dat_nais: string;
//   lieu_nais: string;
//   telephone1: string;
//   telephone2?: string;
//   email: string;
//   photo?: string | null;
//   sitmat?: string;
//   diplome?: number | null;
// }

// const API_URL = apiUrl(API_ENDPOINTS.candidats);

// const COLUMNS: ExportColumn[] = [
//   { key: "id_candidat", label: "ID" },
//   { key: "nom_complet", label: "Nom complet" },
//   { key: "genre", label: "Genre" },
//   { key: "email", label: "Email" },
//   { key: "telephone1", label: "Téléphone" },
//   { key: "sitmat", label: "Situation" },
// ];

// interface CandidatListProps {
//   onAdd: () => void;
//   onEdit: (candidat: Candidat) => void;
// }

// export default function CandidatList({ onAdd, onEdit }: CandidatListProps) {
//   const [candidats, setCandidats] = useState<Candidat[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState<Candidat | null>(null);
//   const [viewing, setViewing] = useState(false);
//   const [genreFilter, setGenreFilter] = useState("all");

//   const fetchCandidats = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(API_URL);
//       const raw = Array.isArray(res.data) ? res.data : res.data.results ?? [];
//       setCandidats(raw);
//     } catch {
//       toast.error("Impossible de charger les candidats.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCandidats();
//   }, [fetchCandidats]);

//   const enriched = useMemo(
//     () =>
//       candidats.map((c) => ({
//         ...c,
//         nom_complet: `${c.nom_cand} ${c.pren_cand}`.trim(),
//       })),
//     [candidats]
//   );

//   const filterFn = useCallback(
//     (item: Candidat & { nom_complet: string }) =>
//       genreFilter === "all" || item.genre === genreFilter,
//     [genreFilter]
//   );

//   const {
//     query,
//     setQuery,
//     page,
//     setPage,
//     pageSize,
//     setPageSize,
//     paginated,
//     filtered,
//     totalPages,
//     total,
//     filteredCount,
//   } = useDataTable(enriched, {
//     pageSize: 10,
//     searchKeys: ["nom_complet", "email", "telephone1", "lieu_nais"],
//     filterFn,
//   });

//   const moduleStats = useMemo(
//     () => [
//       { label: "Total", value: candidats.length, icon: Users },
//       { label: "Filtrés", value: filteredCount, icon: List },
//       { label: "Hommes", value: candidats.filter((c) => c.genre === "M").length, icon: Hash },
//       { label: "Femmes", value: candidats.filter((c) => c.genre === "F").length, icon: Hash },
//     ],
//     [candidats, filteredCount]
//   );

//   const exportData = () => rowsForExport(filtered, COLUMNS);

//   const handleExportExcel = async () => {
//     try {
//       await exportToExcel(exportData(), "candidats", "Candidats");
//     } catch {
//       toast.error("Échec de l'export Excel");
//     }
//   };

//   const handleExportPdf = async () => {
//     try {
//       await exportToPdf(exportData(), COLUMNS, "Liste des candidats", "candidats");
//     } catch {
//       toast.error("Échec de l'export PDF");
//     }
//   };

//   const handleImportExcel = async (file: File) => {
//     try {
//       const rows = await importFromExcel(file);
//       let ok = 0;
//       for (const row of rows) {
//         const nom = row.nom_cand ?? row.NomCand ?? row.nom;
//         const pren = row.pren_cand ?? row.PrenCand ?? row.prenom;
//         const email = row.email ?? row.Email;
//         if (!nom || !pren || !email) continue;
//         await axios.post(API_URL, {
//           nom_cand: String(nom),
//           pren_cand: String(pren),
//           genre: row.genre ?? row.Genre ?? "M",
//           dat_nais: row.dat_nais ?? row.DatNais ?? "2000-01-01",
//           lieu_nais: row.lieu_nais ?? row.LieuNais ?? "—",
//           telephone1: row.telephone1 ?? row.Telphone1 ?? "000000000",
//           email: String(email),
//           sitmat: row.sitmat ?? row.Sitmat ?? "Célibataire",
//           diplome: row.diplome ? Number(row.diplome) : null,
//         });
//         ok++;
//       }
//       toast.success(`${ok} candidat(s) importé(s)`);
//       fetchCandidats();
//     } catch {
//       toast.error("Échec de l'import Excel");
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Supprimer ce candidat ?")) return;
//     try {
//       await axios.delete(`${API_URL}${id}/`);
//       toast.success("Candidat supprimé");
//       fetchCandidats();
//     } catch {
//       toast.error("Échec de la suppression");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-20">
//         <Loader2 className="animate-spin w-8 h-8 text-[#0A5C36]" />
//         <span className="ml-3 text-gray-500">Chargement…</span>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-start flex-wrap gap-2">
//         <div className="flex-1 min-w-0">
//           <DataTableToolbar
//             title="Liste des Candidats"
//             searchPlaceholder="Nom, email, téléphone, lieu…"
//             query={query}
//             onQueryChange={setQuery}
//             onExportExcel={handleExportExcel}
//             onExportPdf={handleExportPdf}
//             onImportExcel={handleImportExcel}
//             filteredCount={filteredCount}
//             totalCount={total}
//           >
//             <Select value={genreFilter} onValueChange={setGenreFilter}>
//               <SelectTrigger className="w-[130px]">
//                 <SelectValue placeholder="Genre" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Tous</SelectItem>
//                 <SelectItem value="M">Homme</SelectItem>
//                 <SelectItem value="F">Femme</SelectItem>
//               </SelectContent>
//             </Select>
//           </DataTableToolbar>
//         </div>
//         <Button
//           onClick={onAdd}
//           className="rounded-xl bg-[#0A5C36] hover:bg-[#1B7A53] text-white shadow-md shrink-0"
//         >
//           + Ajouter
//         </Button>
//       </div>

//       <ModuleStatCards items={moduleStats} />

//       <div className="rounded-2xl border border-[#E6F4ED] shadow-lg overflow-hidden bg-white">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-[#E7F5EF]">
//               <TableHead className="text-[#0A5C36] w-20">Photo</TableHead>
//               <TableHead className="text-[#0A5C36]">Nom & Prénom</TableHead>
//               <TableHead className="text-[#0A5C36]">Genre</TableHead>
//               <TableHead className="text-[#0A5C36]">Email</TableHead>
//               <TableHead className="text-[#0A5C36]">Téléphone</TableHead>
//               <TableHead className="text-right text-[#0A5C36]">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginated.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={6} className="text-center py-10 text-gray-500">
//                   Aucun candidat trouvé.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               paginated.map((c) => (
//                 <TableRow key={c.id_candidat} className="hover:bg-[#F3F9F5]">
//                   <TableCell>
//                     {c.photo ? (
//                       <img
//                         src={c.photo}
//                         alt={c.nom_cand}
//                         className="w-10 h-10 rounded-full object-cover border"
//                       />
//                     ) : (
//                       <div className="w-10 h-10 rounded-full bg-[#E7F5EF] flex items-center justify-center">
//                         <User className="w-5 h-5 text-[#0A5C36]" />
//                       </div>
//                     )}
//                   </TableCell>
//                   <TableCell className="font-medium">
//                     {c.nom_cand.toUpperCase()} {c.pren_cand}
//                   </TableCell>
//                   <TableCell className="capitalize">{c.genre || "—"}</TableCell>
//                   <TableCell>{c.email}</TableCell>
//                   <TableCell>{c.telephone1}</TableCell>
//                   <TableCell className="flex justify-end gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => {
//                         setSelected(c);
//                         setViewing(true);
//                       }}
//                     >
//                       <Eye className="w-4 h-4 mr-1" /> Voir
//                     </Button>
//                     <Button variant="outline" size="sm" onClick={() => onEdit(c)}>
//                       <Edit3 className="w-4 h-4 mr-1" /> Modifier
//                     </Button>
//                     <Button
//                       size="sm"
//                       className="bg-[#D72638] text-white"
//                       onClick={() => handleDelete(c.id_candidat)}
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {filteredCount > 0 && (
//         <PaginationControls
//           page={page}
//           totalPages={totalPages}
//           pageSize={pageSize}
//           onPageChange={setPage}
//           onPageSizeChange={setPageSize}
//         />
//       )}

//       {viewing && selected && (
//         <CandidatView candidat={selected as unknown as ApiRecord} onClose={() => setViewing(false)} />
//       )}
//     </div>
//   );
// }

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

export interface Demande {
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

  // 🔐 Configuration correcte et sécurisée de l'enveloppe de requêtes Axios
  const getAuthHeaders = useCallback((additionalHeaders = {}) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    return {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...additionalHeaders,
      },
    };
  }, []);

  const fetchDemandes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, getAuthHeaders());
      setDemandes(Array.isArray(res.data) ? res.data : res.data.results ?? []);
    } catch {
      toast.error("Erreur de chargement des demandes");
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

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

        await axios.post(API_URL, form, getAuthHeaders({ "Content-Type": "multipart/form-data" }));
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
      await axios.delete(`${API_URL}${id}/`, getAuthHeaders());
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