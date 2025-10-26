"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Edit3, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import CampagneForm from "@/components/forms/CampagneForm";

interface CampagneListProps {
  onAdd: () => void;
}

export default function CampagneList({ onAdd }: CampagneListProps) {
  const [campagnes, setCampagnes] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  const API_URL = "http://127.0.0.1:8000/api/campagnes/";

  useEffect(() => {
    fetchCampagnes();
  }, []);

  const fetchCampagnes = async () => {
    try {
      const res = await axios.get(API_URL);
      setCampagnes(res.data);
    } catch (error) {
      console.error("Erreur de chargement des campagnes:", error);
      toast.error("Impossible de charger les campagnes.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette campagne ?")) return;

    try {
      await axios.delete(`${API_URL}${id}/`);
      toast.success("Campagne supprimée !");
      fetchCampagnes();
    } catch (error) {
      console.error("Erreur de suppression :", error);
      toast.error("Impossible de supprimer la campagne.");
    }
  };

  const handleEdit = (id: string) => setEditing(id);
  const handleCancelEdit = () => setEditing(null);
  const handleUpdated = () => {
    fetchCampagnes();
    setEditing(null);
  };

  const filtered = campagnes.filter(
    (c) => c.cod_anne.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Rechercher une campagne"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-64 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
        <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      <Table className="rounded-lg border border-gray-200 bg-white shadow">
        <TableHeader>
          <TableRow className="bg-blue-50">
            <TableHead>Code année</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date début</TableHead>
            <TableHead>Date fin</TableHead>
            <TableHead>État</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length > 0 ? (
            filtered.map((c) => (
              <TableRow key={c.cod_anne}>
                {editing === c.cod_anne ? (
                  <TableCell colSpan={6}>
                    <CampagneForm onAdded={handleUpdated} onCancel={handleCancelEdit} editId={c.cod_anne} />
                  </TableCell>
                ) : (
                  <>
                    <TableCell>{c.cod_anne}</TableCell>
                    <TableCell>{c.description}</TableCell>
                    <TableCell>{c.dat_debut}</TableCell>
                    <TableCell>{c.dat_fin}</TableCell>
                    <TableCell>{c.etat}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(c.cod_anne)}>
                        <Edit3 className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(c.cod_anne)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                Aucune campagne trouvée.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
