// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Loader2, Save, X } from "lucide-react";
// import { toast } from "sonner";
// import { API_ENDPOINTS, apiUrl } from "@/lib/api";

// const API_URL = apiUrl(API_ENDPOINTS.campagnes);

// interface CampagneFormProps {
//   onAdded: () => void;
//   onCancel: () => void;
//   editId?: string | null;
// }

// export default function CampagneForm({ onAdded, onCancel, editId }: CampagneFormProps) {
//   const [codAnne, setCodAnne] = useState("");
//   const [description, setDescription] = useState("");
//   const [datDebut, setDatDebut] = useState("");
//   const [datFin, setDatFin] = useState("");
//   const [etat, setEtat] = useState("Ouvert");
//   const [loading, setLoading] = useState(false);

//   // Charger les données si on est en mode édition
//   useEffect(() => {
//     if (editId) {
//       setLoading(true);
//       axios.get(`${API_URL}${editId}/`)
//         .then((res) => {
//           setCodAnne(res.data.cod_anne);
//           setDescription(res.data.description);
//           setDatDebut(res.data.dat_debut);
//           setDatFin(res.data.dat_fin);
//           setEtat(res.data.etat || "Ouvert");
//         })
//         .catch(() => toast.error("Erreur lors de la récupération des données"))
//         .finally(() => setLoading(false));
//     }
//   }, [editId]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const payload = { 
//         cod_anne: codAnne, 
//         description, 
//         dat_debut: datDebut, 
//         dat_fin: datFin, 
//         etat 
//       };

//       if (editId) {
//         await axios.put(`${API_URL}${editId}/`, payload);
//         toast.success("✅ Campagne mise à jour !");
//       } else {
//         await axios.post(API_URL, payload);
//         toast.success("✅ Campagne ajoutée avec succès !");
//       }

//       onAdded();
//     } catch (error: unknown) {
//       console.error("Erreur :", error);
//       toast.error("❌ Échec de l'enregistrement.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-2xl shadow-xl border border-[#E6F4ED] max-w-lg mx-auto">
//       <h2 className="text-2xl font-bold text-[#0A5C36] mb-6">
//         {editId ? "Modifier la Campagne" : "Nouvelle Campagne"}
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Code Année (ID) */}
//         <div className="space-y-2">
//           <Label htmlFor="codAnne" className="text-[#0A5C36] font-semibold">Code Année</Label>
//           <Input
//             id="codAnne"
//             value={codAnne}
//             onChange={(e) => setCodAnne(e.target.value)}
//             placeholder="Ex: 2025"
//             required
//             disabled={!!editId} // La clé primaire ne doit pas être modifiée
//             className="border-[#1B7A53] focus:ring-2 focus:ring-[#B4EFC4] rounded-xl"
//           />
//         </div>

//         {/* Description */}
//         <div className="space-y-2">
//           <Label htmlFor="description" className="text-[#0A5C36] font-semibold">Description</Label>
//           <Input
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Nom de la campagne..."
//             required
//             className="border-[#1B7A53] focus:ring-2 focus:ring-[#B4EFC4] rounded-xl"
//           />
//         </div>

//         {/* Dates côte à côte */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="datDebut" className="text-[#0A5C36] font-semibold">Date Début</Label>
//             <Input 
//               id="datDebut" 
//               type="date" 
//               value={datDebut} 
//               onChange={(e) => setDatDebut(e.target.value)} 
//               required 
//               className="border-[#1B7A53] focus:ring-2 focus:ring-[#B4EFC4] rounded-xl"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="datFin" className="text-[#0A5C36] font-semibold">Date Fin</Label>
//             <Input 
//               id="datFin" 
//               type="date" 
//               value={datFin} 
//               onChange={(e) => setDatFin(e.target.value)} 
//               required 
//               className="border-[#1B7A53] focus:ring-2 focus:ring-[#B4EFC4] rounded-xl"
//             />
//           </div>
//         </div>

//         {/* État (Dropdown stylisé) */}
//         <div className="space-y-2">
//           <Label htmlFor="etat" className="text-[#0A5C36] font-semibold">État</Label>
//           <select
//             id="etat"
//             className="w-full border border-[#1B7A53] rounded-xl px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-[#B4EFC4] outline-none"
//             value={etat}
//             onChange={(e) => setEtat(e.target.value)}
//           >
//             <option value="Ouvert">Ouvert</option>
//             <option value="Fermé">Fermé</option>
//           </select>
//         </div>

//         {/* Boutons d'action */}
//         <div className="flex justify-end gap-3 pt-4">
//           <Button 
//             type="button" 
//             variant="outline" 
//             onClick={onCancel} 
//             disabled={loading}
//             className="rounded-xl border-[#0A5C36] text-[#0A5C36] hover:bg-[#E9F7F0]"
//           >
//             <X className="w-4 h-4 mr-2" /> Annuler
//           </Button>
          
//           <Button 
//             type="submit" 
//             disabled={loading}
//             className="rounded-xl bg-[#0A5C36] hover:bg-[#0C7041] text-white shadow-md min-w-[140px]"
//           >
//             {loading ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               <Save className="w-4 h-4 mr-2" />
//             )}
//             {editId ? "Mettre à jour" : "Enregistrer"}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { API_ENDPOINTS, apiUrl } from "@/lib/api";

const API_URL = apiUrl(API_ENDPOINTS.campagnes);

interface CampagneFormProps {
  onAdded: () => void;
  onCancel: () => void;
  editId?: string | null;
}

export default function CampagneForm({ onAdded, onCancel, editId }: CampagneFormProps) {
  const [codAnne, setCodAnne] = useState("");
  const [description, setDescription] = useState("");
  const [datDebut, setDatDebut] = useState("");
  const [datFin, setDatFin] = useState("");
  const [etat, setEtat] = useState("Ouvert");
  const [loading, setLoading] = useState(false);

  // Charger les données si on est en mode édition
  useEffect(() => {
    if (editId) {
      setLoading(true);
      
      // 🔑 Récupération du token pour sécuriser le GET initial
      const token = localStorage.getItem("access_token");
      const config = {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      };

      axios.get(`${API_URL}${editId}/`, config)
        .then((res) => {
          setCodAnne(res.data.cod_anne);
          setDescription(res.data.description);
          setDatDebut(res.data.dat_debut);
          setDatFin(res.data.dat_fin);
          setEtat(res.data.etat || "Ouvert");
        })
        .catch(() => toast.error("Erreur lors de la récupération des données"))
        .finally(() => setLoading(false));
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { 
        cod_anne: codAnne, 
        description, 
        dat_debut: datDebut, 
        dat_fin: datFin, 
        etat 
      };

      // 🔑 Récupération du token pour la soumission des données
      const token = localStorage.getItem("access_token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      };

      if (editId) {
        await axios.put(`${API_URL}${editId}/`, payload, config);
        toast.success("✅ Campagne mise à jour !");
      } else {
        await axios.post(API_URL, payload, config);
        toast.success("✅ Campagne ajoutée avec succès !");
      }

      onAdded();
    } catch (error: unknown) {
      console.error("Erreur :", error);
      toast.error("❌ Échec de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl border border-[#E6F4ED] max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-[#0A5C36] mb-6">
        {editId ? "Modifier la Campagne" : "Nouvelle Campagne"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Code Année (ID) */}
        <div className="space-y-2">
          <Label htmlFor="codAnne" className="text-[#0A5C36] font-semibold">Code Année</Label>
          <Input
            id="codAnne"
            value={codAnne}
            onChange={(e) => setCodAnne(e.target.value)}
            placeholder="Ex: 2026"
            required
            disabled={!!editId} // La clé primaire ne doit pas être modifiée
            className="border-[#1B7A53] focus:ring-2 focus:ring-[#B4EFC4] rounded-xl"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-[#0A5C36] font-semibold">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nom de la campagne..."
            required
            className="border-[#1B7A53] focus:ring-2 focus:ring-[#B4EFC4] rounded-xl"
          />
        </div>

        {/* Dates côte à côte */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="datDebut" className="text-[#0A5C36] font-semibold">Date Début</Label>
            <Input 
              id="datDebut" 
              type="date" 
              value={datDebut} 
              onChange={(e) => setDatDebut(e.target.value)} 
              required 
              className="border-[#1B7A53] focus:ring-2 focus:ring-[#B4EFC4] rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="datFin" className="text-[#0A5C36] font-semibold">Date Fin</Label>
            <Input 
              id="datFin" 
              type="date" 
              value={datFin} 
              onChange={(e) => setDatFin(e.target.value)} 
              required 
              className="border-[#1B7A53] focus:ring-2 focus:ring-[#B4EFC4] rounded-xl"
            />
          </div>
        </div>

        {/* État (Dropdown stylisé) */}
        <div className="space-y-2">
          <Label htmlFor="etat" className="text-[#0A5C36] font-semibold">État</Label>
          <select
            id="etat"
            className="w-full border border-[#1B7A53] rounded-xl px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-[#B4EFC4] outline-none"
            value={etat}
            onChange={(e) => setEtat(e.target.value)}
          >
            <option value="Ouvert">Ouvert</option>
            <option value="Fermé">Fermé</option>
          </select>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={loading}
            className="rounded-xl border-[#0A5C36] text-[#0A5C36] hover:bg-[#E9F7F0]"
          >
            <X className="w-4 h-4 mr-2" /> Annuler
          </Button>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="rounded-xl bg-[#0A5C36] hover:bg-[#0C7041] text-white shadow-md min-w-[140px]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {editId ? "Mettre à jour" : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
}