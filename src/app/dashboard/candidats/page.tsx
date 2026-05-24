"use client";

import { useState, type ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CandidatForm from "@/components/forms/CandidatForm";
import CandidatList from "@/components/lists/CandidatList";

type CandidatRow = Parameters<ComponentProps<typeof CandidatList>["onEdit"]>[0];

export default function CandidatsPage() {
  const router = useRouter();
  
  // États pour la navigation et le rafraîchissement
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Actions : Ouvrir pour ajout
  const handleAdd = () => {
    setEditId(null);
    setIsFormOpen(true);
  };

  // Actions : Ouvrir pour modification (C'est ici que le lien se fait avec la liste)
  const handleEdit = (candidat: CandidatRow) => {
    setEditId(candidat.id_candidat); 
    setIsFormOpen(true);
  };

  // Fermer le formulaire
  const handleCancel = () => {
    setIsFormOpen(false);
    setEditId(null);
  };

  // Succès de l'opération
  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    handleCancel();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F3F9F5]">
      {/* Header fixe - Style V1 */}
      <header className="flex items-center gap-4 bg-white p-4 shadow-sm w-full fixed top-0 z-50 border-b border-[#E6F4ED]">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-[#E7F5EF] transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#0A5C36]" />
        </button>
        <h1 className="text-2xl font-bold text-[#0A5C36]">Gestion des Candidats</h1>
      </header>

      {/* Contenu principal */}
      <main className="flex flex-col gap-8 p-6 pt-28 max-w-7xl mx-auto w-full">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-[#E6F4ED] space-y-6">
          {!isFormOpen ? (
            /* Liste : on passe obligatoirement onAdd ET onEdit */
            <CandidatList 
              key={refreshKey} 
              onAdd={handleAdd} 
              onEdit={handleEdit} 
            />
          ) : (
            /* Formulaire : on passe editId pour savoir s'il faut PUT ou POST */
            <div className="animate-in fade-in zoom-in duration-300">
              <CandidatForm
                editId={editId}
                onAdded={handleFormSuccess}
                onCancel={handleCancel}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}