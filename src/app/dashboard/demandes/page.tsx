"use client";

import { useState, type ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DemandeForm from "@/components/forms/DemandeForm";
import DemandeList from "@/components/lists/DemandeList";

type DemandeRow = Parameters<ComponentProps<typeof DemandeList>["onEdit"]>[0];

export default function DemandesPage() {
  const router = useRouter();
  
  // États pour la navigation et l'édition
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDemande, setEditingDemande] = useState<DemandeRow | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Actions
  const handleAdd = () => {
    setEditingDemande(null);
    setIsFormOpen(true);
  };

  const handleEdit = (demande: DemandeRow) => {
    setEditingDemande(demande);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingDemande(null);
  };

  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    handleCancel();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F3F9F5]">
      {/* Header fixe style V1 */}
      <header className="flex items-center gap-4 bg-white p-4 shadow-md w-full fixed top-0 z-50 border-b border-[#E6F4ED]">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-[#E7F5EF] transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#0A5C36]" />
        </button>
        <h1 className="text-2xl font-bold text-[#0A5C36]">Gestion des Demandes</h1>
      </header>

      {/* Contenu principal */}
      <main className="flex flex-col gap-8 p-6 pt-28 max-w-7xl mx-auto w-full">
        <div className="bg-white p-6 rounded-2xl border border-[#E6F4ED] shadow-xl space-y-6">
          {!isFormOpen ? (
            <DemandeList 
              key={refreshKey} 
              onAdd={handleAdd} 
              onEdit={handleEdit} 
            />
          ) : (
            <div className="animate-in fade-in zoom-in duration-300">
              <DemandeForm
                demande={editingDemande}
                onAdded={handleFormSuccess}
                onClose={handleCancel}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}