"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

interface Candidat {
  IdCandidat: number;
  NomCand: string;
  PrenCand: string;
  Genre: string;
  Email: string;
  Telphone1: string;
}

interface CandidatListProps {
  onAdd?: () => void;
  refresh?: boolean;
}

export default function CandidatList({ onAdd, refresh }: CandidatListProps) {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCandidats() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/candidats");
        if (!res.ok) throw new Error(`Erreur ${res.status}`);

        // gestion JSON vide
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
        setCandidats(data);
      } catch (err: any) {
        console.error("Erreur chargement candidats :", err);
        setError("Impossible de charger les candidats.");
      } finally {
        setLoading(false);
      }
    }
    loadCandidats();
  }, [refresh]);

  if (loading)
    return (
      <p className="text-sm text-gray-500 mt-4">
        Chargement des candidats...
      </p>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mt-6">
        {error}
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mt-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">
          Liste des candidats
        </h2>
        <Button
          onClick={onAdd}
          variant="outline"
          className="text-sm flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Ajouter
        </Button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {candidats.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 italic py-4"
                >
                  Aucun candidat trouvé
                </TableCell>
              </TableRow>
            ) : (
              candidats.map((c) => (
                <TableRow
                  key={c.IdCandidat}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <TableCell>{c.NomCand}</TableCell>
                  <TableCell>{c.PrenCand}</TableCell>
                  <TableCell>{c.Genre}</TableCell>
                  <TableCell>{c.Email}</TableCell>
                  <TableCell>{c.Telphone1}</TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button variant="outline" size="sm">
                      Voir
                    </Button>
                    <Button variant="outline" size="sm">
                      ✏️
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Supprimer ce candidat ?")) {
                          fetch(`/api/candidats/${c.IdCandidat}`, {
                            method: "DELETE",
                          }).then(() =>
                            setCandidats((prev) =>
                              prev.filter(
                                (item) => item.IdCandidat !== c.IdCandidat
                              )
                            )
                          );
                        }
                      }}
                    >
                      🗑️
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
