"use client";

import { useEffect, useState } from "react";
import { Domaine } from "@/lib/types";
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

export default function DomaineList({ onAdd }: { onAdd: () => void }) {
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDomaines = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/domaines");
      const data = await res.json();
      setDomaines(data);
    } catch (error) {
      console.error(error);
      alert("❌ Impossible de charger les domaines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomaines();
  }, []);

  const deleteDomaine = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce domaine ?")) return;
    try {
      const res = await fetch(`/api/domaines/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      fetchDomaines();
      alert("✅ Domaine supprimé !");
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Liste des Domaines</h2>
        <Button onClick={onAdd} className="flex items-center gap-2">
          ➕ Ajouter Domaine
        </Button>
      </div>

      <Table className="w-full border border-gray-200 rounded-lg">
        <TableHeader>
          <TableRow className="bg-blue-50">
            <TableHead className="w-20">ID</TableHead>
            <TableHead>Libellé</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {domaines.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                Aucun domaine trouvé.
              </TableCell>
            </TableRow>
          )}

          {domaines.map((dom) => (
            <TableRow key={dom.IdDom} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-medium">{dom.IdDom}</TableCell>
              <TableCell>{dom.LibDom}</TableCell>
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
                  onClick={() => deleteDomaine(dom.IdDom)}
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
