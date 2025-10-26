// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft } from "lucide-react";
// import DiplomeForm from "@/components/forms/DiplomeForm";
// import DiplomeList from "@/components/lists/DiplomeList";

// export default function DiplomesPage() {
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
//         <h1 className="text-2xl font-semibold text-gray-800">Gestion des Diplomes</h1>
//       </header>

//       {/* Contenu principal avec marge pour descendre sous le header */}
//       <main className="flex flex-col gap-8 p-6 pt-50">
//         <div className="bg-white p-6 rounded-lg  ">
//           {!adding ? (
//             <DiplomeList key={refresh ? 1 : 0} onAdd={handleAdd} />
//           ) : (
//             <DiplomeForm onAdded={handleAdded} onCancel={handleCancel} />
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableRow, TableHead, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { Calendar, Users as UsersIcon, Plus, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import DiplomeForm from "@/components/forms/DiplomeForm";

export default function DashboardDiplomes() {
  const [query, setQuery] = useState("");
  const [diplomes, setDiplomes] = useState<any[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);

  const API_URL = "http://127.0.0.1:8000/api/diplomes/";

  useEffect(() => {
    fetchDiplomes();
  }, []);

  const fetchDiplomes = async () => {
    try {
      const res = await axios.get(API_URL);
      setDiplomes(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des diplômes:", error);
      toast.error("Impossible de charger les diplômes.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce diplôme ?")) return;

    try {
      await axios.delete(`${API_URL}${id}/`);
      toast.success("Diplôme supprimé !");
      fetchDiplomes();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Impossible de supprimer le diplôme.");
    }
  };

  const handleEdit = (id: number) => setEditing(id);
  const handleCancelEdit = () => setEditing(null);
  const handleAddedOrUpdated = () => {
    setAdding(false);
    fetchDiplomes();
    setEditing(null);
  };

  const filtered = diplomes.filter((d) =>
    d.designation.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <main className="flex-1 p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Diplômes</h1>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <Input
              placeholder="Rechercher un diplôme"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-w-[250px] border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            <Avatar className="border border-gray-300">
              <AvatarImage src="/avatar.jpg" alt="avatar" />
              <AvatarFallback>Ad</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Bouton Ajouter */}
        {!adding && (
          <Button
            onClick={() => setAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-44"
          >
            <Plus className="w-4 h-4" /> Ajouter un diplôme
          </Button>
        )}

        {/* Formulaire d'ajout */}
        {adding && (
          <Card className="shadow-lg p-4 rounded-lg bg-white">
            <CardHeader>
              <CardTitle>Ajouter un diplôme</CardTitle>
            </CardHeader>
            <CardContent>
              <DiplomeForm
                onAdded={handleAddedOrUpdated}
                onCancel={() => setAdding(false)}
              />
            </CardContent>
          </Card>
        )}

        {/* Tableau des diplômes */}
        <Card className="overflow-visible shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Liste des Diplômes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="rounded-lg border border-gray-200 bg-white shadow">
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead>ID</TableHead>
                  <TableHead>Désignation</TableHead>
                  <TableHead>Domaine</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((d) => (
                    <TableRow key={d.id_diplome}>
                      {editing === d.id_diplome ? (
                        <TableCell colSpan={4}>
                          <DiplomeForm
                            onAdded={handleAddedOrUpdated}
                            onCancel={handleCancelEdit}
                            editId={d.id_diplome}
                          />
                        </TableCell>
                      ) : (
                        <>
                          <TableCell>{d.id_diplome}</TableCell>
                          <TableCell>{d.designation}</TableCell>
                          <TableCell>{d.domaine_libelle || d.domaine?.lib_dom}</TableCell>
                          <TableCell className="text-right flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(d.id_diplome)}
                            >
                              <Edit3 className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(d.id_diplome)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      Aucun diplôme trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Separator />

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="flex items-center gap-2 hover:bg-blue-50 transition duration-200">
            <Calendar className="w-5 h-5" /> Calendrier
          </Button>
          <Button variant="outline" className="flex items-center gap-2 hover:bg-blue-50 transition duration-200">
            <UsersIcon className="w-5 h-5" /> Utilisateurs
          </Button>
        </div>
      </main>
    </div>
  );
}
