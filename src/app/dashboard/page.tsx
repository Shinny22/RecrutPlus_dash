"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Briefcase,
  Award,
  Users,
  FileText,
  Megaphone,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableRow,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import DataTableToolbar from "@/components/DataTableToolbar";
import PaginationControls from "@/components/PaginationControls";
import ModuleStatCards from "@/components/ModuleStatCards";
import { useDataTable } from "@/hooks/useDataTable";
import { API_ENDPOINTS, apiUrl } from "@/lib/api";
import {
  exportToExcel,
  exportToPdf,
  rowsForExport,
  type ExportColumn,
} from "@/lib/export";

type Stats = {
  campagnes: number;
  domaines: number;
  diplomes: number;
  candidats: number;
  demandes: number;
};

type CandidatRow = {
  id_candidat?: number;
  id?: number;
  nom_cand?: string;
  pren_cand?: string;
  nom_complet?: string;
  email?: string;
  genre?: string;
};

const CANDIDAT_COLUMNS: ExportColumn[] = [
  { key: "id", label: "ID" },
  { key: "nom_complet", label: "Nom complet" },
  { key: "email", label: "Email" },
  { key: "genre", label: "Genre" },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    campagnes: 0,
    domaines: 0,
    diplomes: 0,
    candidats: 0,
    demandes: 0,
  });
  const [candidates, setCandidates] = useState<CandidatRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Récupération du token stocké lors du login
        const token = localStorage.getItem("access_token");

        // 2. Configuration du header d'autorisation
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // 3. Envoi des requêtes avec le token requis par l'API
        const [statsRes, candRes] = await Promise.all([
          axios.get(apiUrl(API_ENDPOINTS.stats), config),
          axios.get(apiUrl(API_ENDPOINTS.candidats), config),
        ]);

        setStats(statsRes.data.global ?? statsRes.data);
        
        const raw = Array.isArray(candRes.data) ? candRes.data : candRes.data.results ?? [];
        setCandidates(
          raw.map((c: CandidatRow) => ({
            ...c,
            id: c.id_candidat ?? c.id,
            nom_complet:
              c.nom_complet ??
              `${c.nom_cand ?? ""} ${c.pren_cand ?? ""}`.trim(),
          }))
        );
      } catch (err) {
        console.error("Erreur dashboard :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
  } = useDataTable(candidates, {
    pageSize: 10,
    searchKeys: ["nom_complet", "email", "genre"],
  });

  const chartData = useMemo(
    () => [
      { label: "Domaines", value: stats.domaines },
      { label: "Diplômes", value: stats.diplomes },
      { label: "Candidats", value: stats.candidats },
      { label: "Demandes", value: stats.demandes },
      { label: "Campagnes", value: stats.campagnes },
    ],
    [stats]
  );

  const exportRows = rowsForExport(
    filtered.map((c) => ({
      id: c.id,
      nom_complet: c.nom_complet,
      email: c.email ?? "",
      genre: c.genre ?? "",
    })),
    CANDIDAT_COLUMNS
  );

  const handleExportExcel = async () => {
    try {
      await exportToExcel(exportRows, "dashboard_candidats", "Candidats");
    } catch {
      console.error("Export Excel échoué");
    }
  };

  const handleExportPdf = async () => {
    try {
      await exportToPdf(
        exportRows,
        CANDIDAT_COLUMNS,
        "Tableau de bord — Candidats",
        "dashboard_candidats"
      );
    } catch {
      console.error("Export PDF échoué");
    }
  };

  const statCards = [
    { label: "Campagnes", value: stats.campagnes, icon: Megaphone },
    { label: "Domaines", value: stats.domaines, icon: Briefcase },
    { label: "Diplômes", value: stats.diplomes, icon: Award },
    { label: "Candidats", value: stats.candidats, icon: Users },
    { label: "Demandes", value: stats.demandes, icon: FileText },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <header className="flex flex-col md:flex-row justify-between items-center p-6 gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0A5C36]">
            Tableau de bord
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Vue d&apos;ensemble du recrutement
          </p>
        </div>
        <Avatar className="border-2 border-[#0A5C36] w-9 h-9">
          <AvatarImage src="/avatar.jpg" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </header>

      <main className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        <ModuleStatCards items={statCards} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="shadow-md border border-[#E6F4ED]">
            <CardHeader className="py-3">
              <CardTitle className="text-base text-[#0A5C36] flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Répartition par module
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                {loading ? (
                  <p className="text-sm text-gray-500">Chargement…</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0A5C36"
                        strokeWidth={2}
                        dot={{ fill: "#0A5C36" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border border-[#E6F4ED]">
            <CardHeader className="py-3">
              <CardTitle className="text-base text-[#0A5C36]">
                Synthèse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {statCards.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-[#F1F8F4] py-2"
                >
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-[#0A5C36]">
                    {loading ? "…" : value}
                  </span>
                </div>
              ))}
              <p className="text-xs text-gray-400 pt-2">
                Total enregistrements :{" "}
                {loading
                  ? "…"
                  : Object.values(stats).reduce((a, b) => a + b, 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg border border-[#E6F4ED] rounded-lg p-4">
          <DataTableToolbar
            title="Candidats"
            searchPlaceholder="Rechercher par nom, email ou genre…"
            query={query}
            onQueryChange={setQuery}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
            filteredCount={filteredCount}
            totalCount={total}
          />

          <div className="overflow-x-auto mt-2">
            {loading ? (
              <p className="text-sm text-gray-500 py-6">Chargement…</p>
            ) : (
              <Table className="border border-gray-200 rounded-lg text-sm">
                <TableHeader>
                  <TableRow className="bg-[#E9F7F0]">
                    <TableHead>ID</TableHead>
                    <TableHead>Nom complet</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Genre</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((c) => (
                    <TableRow
                      key={c.id}
                      className="hover:bg-[#F4FBF7] transition"
                    >
                      <TableCell>{c.id}</TableCell>
                      <TableCell>{c.nom_complet}</TableCell>
                      <TableCell>{c.email ?? "—"}</TableCell>
                      <TableCell className="capitalize">
                        {c.genre ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginated.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500 py-6"
                      >
                        Aucun candidat trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {!loading && filteredCount > 0 && (
            <PaginationControls
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </Card>
      </main>
    </div>
  );
}