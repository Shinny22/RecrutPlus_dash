

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

export default function DashboardSymphos() {
  const [query, setQuery] = useState("");
  const [domaines, setDomaines] = useState<any[]>([]);
  const [libDom, setLibDom] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const API_URL = "http://127.0.0.1:8000/api/domaines/"; // 🧠 adapte selon ton backend

  // 🔹 Charger les domaines au montage
  useEffect(() => {
    fetchDomaines();
  }, []);

  const fetchDomaines = async () => {
    try {
      const res = await axios.get(API_URL);
      setDomaines(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des domaines:", error);
    }
  };

  // 🔹 Ajouter ou Modifier un domaine
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}${editId}/`, { lib_dom: libDom });
      } else {
        await axios.post(API_URL, { lib_dom: libDom });
      }
      setLibDom("");
      setEditId(null);
      fetchDomaines();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du domaine:", error);
    }
  };

  // 🔹 Supprimer un domaine
  const handleDelete = async (id: number) => {
    if (confirm("Supprimer ce domaine ?")) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        fetchDomaines();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  // 🔹 Préparer édition
  const handleEdit = (id: number, lib: string) => {
    setEditId(id);
    setLibDom(lib);
  };

  // 🔹 Filtrer les domaines selon la recherche
  const filteredDomaines = domaines.filter((d) =>
    d.lib_dom.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <main className="flex-1 p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <Input
              placeholder="Rechercher un domaine"
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

        {/* Formulaire CRUD Domaine */}
        <Card className="shadow-lg p-4 rounded-lg bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {editId ? "Modifier un domaine" : "Ajouter un domaine"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4 items-center">
              <Input
                placeholder="Nom du domaine"
                value={libDom}
                onChange={(e) => setLibDom(e.target.value)}
                required
                className="border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
              >
                {editId ? "Mettre à jour" : "Ajouter"}
              </Button>
              {editId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditId(null);
                    setLibDom("");
                  }}
                >
                  Annuler
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Table Domaines */}
        <Card className="overflow-visible shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Domaines</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="rounded-lg border border-gray-200">
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead>ID</TableHead>
                  <TableHead>Nom du domaine</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDomaines.length > 0 ? (
                  filteredDomaines.map((domaine) => (
                    <TableRow key={domaine.id_dom}>
                      <TableCell>{domaine.id_dom}</TableCell>
                      <TableCell>{domaine.lib_dom}</TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(domaine.id_dom, domaine.lib_dom)}
                        >
                          <Edit3 className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(domaine.id_dom)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                      Aucun domaine trouvé.
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
