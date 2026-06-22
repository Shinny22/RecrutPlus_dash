// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { API_ENDPOINTS, apiUrl } from "@/lib/api";

// const API_URL = apiUrl(API_ENDPOINTS.domaines);

// import type { ApiRecord } from "@/lib/api-types";

// export default function DomaineForm({
//   domaine,
//   onClose,
// }: {
//   domaine?: ApiRecord | null;
//   onClose: () => void;
// }) {
//   const [libDom, setLibDom] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (domaine) setLibDom(String(domaine.lib_dom ?? ""));
//   }, [domaine]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (domaine) {
//         await axios.put(`${API_URL}${domaine.id_dom}/`, { lib_dom: libDom });
//       } else {
//         await axios.post(API_URL, { lib_dom: libDom });
//       }
//       onClose();
//     } catch (err) {
//       console.error("Erreur domaine :", err);
//       alert("❌ Erreur lors de la sauvegarde");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={true} onOpenChange={onClose}>
//       <DialogContent className="max-w-md space-y-4 rounded-xl shadow-lg border border-[#E6F4ED] bg-white p-6">
//         <DialogHeader>
//           <DialogTitle className="text-lg font-bold text-[#0A5C36]">
//             {domaine ? "Modifier le Domaine" : "Nouveau Domaine"}
//           </DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="flex flex-col gap-1">
//             <Label className="text-[#0A5C36] font-medium">Libellé</Label>
//             <Input
//               value={libDom}
//               onChange={(e) => setLibDom(e.target.value)}
//               className="border-[#0A5C36] focus:ring-2 focus:ring-[#B4EFC4] focus:border-[#0A5C36] rounded-lg"
//               required
//             />
//           </div>

//           <Button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#0A5C36] text-white hover:bg-[#1B7A53] transition-colors rounded-lg"
//           >
//             {loading ? "Enregistrement..." : domaine ? "Mettre à jour" : "Créer"}
//           </Button>

//           <Button
//             type="button"
//             onClick={onClose}
//             className="w-full border border-[#0A5C36] text-[#0A5C36] hover:bg-[#E7F5EF] rounded-lg transition-colors"
//           >
//             Annuler
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { API_ENDPOINTS, apiUrl } from "@/lib/api";

const API_URL = apiUrl(API_ENDPOINTS.domaines);

import type { ApiRecord } from "@/lib/api-types";

export default function DomaineForm({
  domaine,
  onClose,
}: {
  domaine?: ApiRecord | null;
  onClose: () => void;
}) {
  const [libDom, setLibDom] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (domaine) setLibDom(String(domaine.lib_dom ?? ""));
  }, [domaine]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Récupérer l'access_token généré par le composant AuthForm
      const token = localStorage.getItem("access_token");

      // 2. Configurer le header d'authentification pour Django
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };

      if (domaine) {
        // Envoi du PUT avec les données ET le token d'authentification
        await axios.put(`${API_URL}${domaine.id_dom}/`, { lib_dom: libDom }, config);
      } else {
        // Envoi du POST avec les données ET le token d'authentification
        await axios.post(API_URL, { lib_dom: libDom }, config);
      }
      onClose();
    } catch (err) {
      console.error("Erreur domaine :", err);
      alert("❌ Erreur lors de la sauvegarde (Vérifiez votre connexion)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-4 rounded-xl shadow-lg border border-[#E6F4ED] bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#0A5C36]">
            {domaine ? "Modifier le Domaine" : "Nouveau Domaine"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label className="text-[#0A5C36] font-medium">Libellé</Label>
            <Input
              value={libDom}
              onChange={(e) => setLibDom(e.target.value)}
              className="border-[#0A5C36] focus:ring-2 focus:ring-[#B4EFC4] focus:border-[#0A5C36] rounded-lg"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A5C36] text-white hover:bg-[#1B7A53] transition-colors rounded-lg"
          >
            {loading ? "Enregistrement..." : domaine ? "Mettre à jour" : "Créer"}
          </Button>

          <Button
            type="button"
            onClick={onClose}
            className="w-full border border-[#0A5C36] text-[#0A5C36] hover:bg-[#E7F5EF] rounded-lg transition-colors"
          >
            Annuler
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}