// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft } from "lucide-react";
// import CampagneForm from "@/components/forms/CampagneForm";
// import CampagneList from "@/components/lists/CampagneList";

// export default function CampagnesPage() {
//   const [adding, setAdding] = useState(false);
//   const [refresh, setRefresh] = useState(false);
//   const router = useRouter();

//   const handleAdd = () => setAdding(true);
//   const handleCancel = () => setAdding(false);
//   const handleAdded = () => {
//     setRefresh(!refresh);
//     handleCancel();
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       {/* Header fixe tout en haut */}
//       <header className="flex items-center gap-4 bg-white p-4 shadow-md w-full fixed top-0 z-50">
//         <button
//           onClick={() => router.back()}
//           className="p-2 rounded hover:bg-gray-100 transition"
//         >
//           <ArrowLeft className="w-6 h-6 text-blue-600" />
//         </button>
//         <h1 className="text-2xl font-semibold text-gray-800">Gestion des Campagnes</h1>
//       </header>

//       {/* Contenu principal avec marge pour descendre sous le header */}
//       <main className="flex flex-col gap-8 p-6 pt-50">
//         <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
//           {!adding ? (
//             <CampagneList key={refresh ? 1 : 0} onAdd={handleAdd} />
//           ) : (
//             <CampagneForm onAdded={handleAdded} onCancel={handleCancel} />
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

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
  const [editing, setEditing] = useState<string | null>(null); // cod_anne est une string

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

  // 🔹 Filtrer les campagnes par code année ou description
  const filtered = campagnes.filter(
    (c) =>
      c.cod_anne?.toLowerCase().includes(query.toLowerCase()) ||
      c.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      {/* Barre d’action */}
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

      {/* Tableau */}
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
