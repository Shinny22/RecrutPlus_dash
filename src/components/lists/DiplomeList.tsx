"use client";

import { useEffect, useState } from "react";
import { Diplome } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function DiplomeList({ onAdd }: { onAdd: () => void }) {
  const [diplomes, setDiplomes] = useState<Diplome[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDiplomes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/diplomes");
      const data = await res.json();
      setDiplomes(data);
    } catch (error) {
      console.error(error);
      alert("❌ Impossible de charger les diplômes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiplomes();
  }, []);

  const deleteDiplome = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce diplôme ?")) return;
    try {
      const res = await fetch(`/api/diplomes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      fetchDiplomes();
      alert("✅ Diplôme supprimé !");
    } catch (error) {
      console.error(error);
      alert("❌ Échec : " + error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin w-6 h-6 mr-2 text-blue-500" />
        <span className="text-gray-500">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Liste des Diplômes</h2>
        <Button onClick={onAdd} className="flex items-center gap-2">
          ➕ Ajouter Diplôme
        </Button>
      </div>

      <Table className="w-full border border-gray-200 rounded-lg">
        <TableHeader>
          <TableRow className="bg-blue-50">
            <TableHead className="w-20">ID</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Domaine</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {diplomes.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                Aucun diplôme trouvé.
              </TableCell>
            </TableRow>
          )}

          {diplomes.map((dip: any) => (
            <TableRow key={dip.IdDiplome} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-medium">{dip.IdDiplome}</TableCell>
              <TableCell>{dip.Designation}</TableCell>
              <TableCell>{dip.LibDom}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert("Modification à implémenter")}
                >
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteDiplome(dip.IdDiplome)}
                >
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
