"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CampagneForm from "@/components/forms/CampagneForm";
import CampagneList from "@/components/lists/CampagneList";
import axios from "axios";
import { toast } from "sonner";
import { API_ENDPOINTS, apiUrl } from "@/lib/api";

const API_URL = apiUrl(API_ENDPOINTS.campagnes);

export default function CampagnesPage() {
  const router = useRouter();

  // États pour la navigation interne
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [refreshKey, setRefreshKey] = useState(0);
  const [campagnes, setCampagnes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch API
  const fetchCampagnes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setCampagnes(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les campagnes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampagnes();
  }, [refreshKey]);

  // Actions
  const handleAdd = () => {
    setEditId(null); // Mode ajout
    setIsFormOpen(true);
  };

  const handleEdit = (campagne: any) => {
    setEditId(campagne.cod_anne); // Mode édition avec l'ID
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditId(null);
  };

  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    handleCancel();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center gap-4 bg-[#E7F5EF] p-4 shadow-md w-full fixed top-0 z-50 rounded-b-lg">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-md hover:bg-[#D1EAD9] transition"
        >
          <ArrowLeft className="w-6 h-6 text-[#0A5C36]" />
        </button>
        <h1 className="text-2xl font-bold text-[#0A5C36]">Gestion des Campagnes</h1>
      </header>

      {/* Main content */}
      <main className="flex flex-col gap-6 p-6 pt-28">
        <div className="bg-white p-6 rounded-xl shadow-md space-y-6 border border-[#E6F4ED]">
          {!isFormOpen ? (
            <CampagneList
              onAdd={handleAdd}
              onEdit={handleEdit} // Passé ici pour corriger l'erreur
            />
          ) : (
            <div className="animate-in fade-in zoom-in duration-300">
              <CampagneForm 
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