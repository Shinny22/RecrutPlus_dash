"use client";

import { useEffect, useState } from "react";
import CandidatForm from "@/components/forms/CandidatForm";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface Candidat {
  IdCandidat: number;
  NomCand: string;
  PrenCand: string;
  Genre: string;
  DatNais: string;
  LieuNais: string;
  Telphone1: string;
  Telphone2: string;
  Email: string;
  Photo: string;
  Sitmat: string;
  IdDiplome: number;
}

export default function CandidatList({ onAdd }: { onAdd: () => void }) {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCandidats = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/candidats/");
      // When using axios, the data is directly available in res.data, not res.json()
      const data = res.data;
      setCandidats(data);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les candidats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidats();
  }, []);

  const deleteCandidat = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce candidat ?")) return;
    try {
      // Using native fetch for DELETE, which is fine.
      const res = await fetch(`http://127.0.0.1:8000/api/candidats/${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      toast.success("Candidat supprimé !");
      fetchCandidats();
    } catch (error) {
      console.error(error);
      toast.error("Échec de la suppression");
    }
  };

  if (loading) return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin w-6 h-6 mr-2 text-blue-500" />Chargement...</div>;

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Liste des Candidats</h2>
        <Button onClick={onAdd} className="flex items-center gap-2">➕ Ajouter Candidat</Button>
      </div>

      <Table className="w-full border border-gray-200 rounded-lg">
        <TableHeader>
          <TableRow className="bg-blue-50">
            <TableHead>ID</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidats.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">Aucun candidat trouvé.</TableCell>
            </TableRow>
          )}

          {candidats.map((c) =>
            editingId === c.IdCandidat ? (
              <TableRow key={c.IdCandidat}>
                <TableCell colSpan={7}>
                  <CandidatForm
                    editId={c.IdCandidat}
                    onAdded={() => { setEditingId(null); fetchCandidats(); }}
                    onCancel={() => setEditingId(null)}
                  />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow key={c.IdCandidat} className="hover:bg-gray-50 transition-colors">
                <TableCell>{c.IdCandidat}</TableCell>
                <TableCell>{c.NomCand}</TableCell>
                <TableCell>{c.PrenCand}</TableCell>
                <TableCell>{c.Genre}</TableCell>
                <TableCell>{c.Email}</TableCell>
                <TableCell>{c.Telphone1}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(c.IdCandidat)}>
                    <Edit3 className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteCandidat(c.IdCandidat)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}
