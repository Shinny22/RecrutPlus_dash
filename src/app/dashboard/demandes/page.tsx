"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DemandeForm from "@/components/forms/DemandeForm";
import DemandeList from "@/components/lists/DemandeList";

export default function DemandesPage() {
  const [adding, setAdding] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();

  const handleAdd = () => setAdding(true);
  const handleCancel = () => setAdding(false);
  const handleAdded = () => {
    setRefresh(!refresh);
    handleCancel();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header fixe */}
      <header className="flex items-center gap-4 bg-white p-4 shadow-md w-full fixed top-0 z-50">
              <button
                onClick={() => router.back()}
                className="p-2 rounded hover:bg-gray-100 transition"
              >
                <ArrowLeft className="w-6 h-6 text-blue-600" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-800">Gestion des Demandes</h1>
            </header>

      {/* Contenu principal */}
      <main className="flex flex-col gap-8 p-6 pt-28">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {!adding ? (
            <DemandeList key={refresh ? 1 : 0} onAdd={handleAdd} />
          ) : (
            <DemandeForm onAdded={handleAdded} onCancel={handleCancel} />
          )}
        </div>
      </main>
    </div>
  );
}
