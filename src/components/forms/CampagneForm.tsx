// "use client";

// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Campagne } from "@/lib/types";
// import { Button } from "@/components/ui/button";

// const Schema = Yup.object().shape({
//   CodAnne: Yup.string().required("Code année requis"),
//   Description: Yup.string().required("Description requise"),
//   DatDebut: Yup.string().required("Date début requise"),
//   DatFin: Yup.string().required("Date fin requise"),
//   Etat: Yup.string()
//     .oneOf(["Planifiée", "En cours", "Clôturée"])
//     .required("État requis"),
// });

// export default function CampagneForm({ onAdded, onCancel }: { onAdded?: () => void; onCancel?: () => void; }) {
//   async function onSubmit(values: Campagne, { resetForm }: any) {
//     try {
//       const res = await fetch("/api/campagnes", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(values),
//       });

//       if (!res.ok) throw new Error("Erreur lors de l'ajout");
//       resetForm();
//       if (onAdded) onAdded();
//       alert("✅ Campagne ajoutée !");
//     } catch (error) {
//       console.error(error);
//       alert("❌ Échec : " + error);
//     }
//   }

//   return (
//     <div className="bg-white p-4 rounded-lg shadow max-w-2xl mx-auto">
//       <h2 className="text-lg font-semibold mb-3">Ajouter une campagne</h2>

//       <Formik
//         initialValues={{
//           CodAnne: "",
//           Description: "",
//           DatDebut: "",
//           DatFin: "",
//           Etat: "Planifiée",
//         }}
//         validationSchema={Schema}
//         onSubmit={onSubmit}
//       >
//         {({ isSubmitting }) => (
//           <Form className="space-y-3">
//             <div>
//               <label className="block text-sm font-medium mb-1">Code Année</label>
//               <Field name="CodAnne" className="w-full border rounded px-2 py-1 text-sm" />
//               <ErrorMessage name="CodAnne" component="p" className="text-red-600 text-xs mt-1" />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Description</label>
//               <Field as="textarea" name="Description" className="w-full border rounded px-2 py-1 text-sm" rows={3} />
//               <ErrorMessage name="Description" component="p" className="text-red-600 text-xs mt-1" />
//             </div>

//             <div className="grid grid-cols-2 gap-2">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Date Début</label>
//                 <Field name="DatDebut" type="date" className="w-full border rounded px-2 py-1 text-sm" />
//                 <ErrorMessage name="DatDebut" component="p" className="text-red-600 text-xs mt-1" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Date Fin</label>
//                 <Field name="DatFin" type="date" className="w-full border rounded px-2 py-1 text-sm" />
//                 <ErrorMessage name="DatFin" component="p" className="text-red-600 text-xs mt-1" />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">État</label>
//               <Field as="select" name="Etat" className="w-full border rounded px-2 py-1 text-sm">
//                 <option value="Planifiée">Planifiée</option>
//                 <option value="En cours">En cours</option>
//                 <option value="Clôturée">Clôturée</option>
//               </Field>
//               <ErrorMessage name="Etat" component="p" className="text-red-600 text-xs mt-1" />
//             </div>

//             <div className="flex justify-between items-center mt-4">
//               {onCancel && (
//                 <Button variant="outline" type="button" onClick={onCancel}>
//                   Annuler
//                 </Button>
//               )}
//               <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//                 {isSubmitting ? "Envoi..." : "Ajouter"}
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Formik>
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
  const [etat, setEtat] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://127.0.0.1:8000/api/campagnes/";

  // Si édition, charger les données existantes
  useEffect(() => {
    if (editId) {
      axios.get(`${API_URL}${editId}/`).then((res) => {
        setCodAnne(res.data.cod_anne);
        setDescription(res.data.description);
        setDatDebut(res.data.dat_debut);
        setDatFin(res.data.dat_fin);
        setEtat(res.data.etat);
      });
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codAnne || !description || !datDebut || !datFin || !etat) {
      toast.error("Tous les champs sont requis !");
      return;
    }

    setLoading(true);

    try {
      const payload = { cod_anne: codAnne, description, dat_debut: datDebut, dat_fin: datFin, etat };

      if (editId) {
        await axios.put(`${API_URL}${editId}/`, payload);
        toast.success("Campagne mise à jour !");
      } else {
        await axios.post(API_URL, payload);
        toast.success("Campagne ajoutée !");
      }

      onAdded();
      setCodAnne("");
      setDescription("");
      setDatDebut("");
      setDatFin("");
      setEtat("");
    } catch (error) {
      console.error("Erreur :", error);
      toast.error("Impossible de sauvegarder la campagne.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="codAnne">Code année</Label>
        <Input
          id="codAnne"
          value={codAnne}
          onChange={(e) => setCodAnne(e.target.value)}
          placeholder="Ex: 2025"
          required
          disabled={!!editId} // ne pas éditer le PK
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Campagne inscription 2025"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="datDebut">Date début</Label>
        <Input id="datDebut" type="date" value={datDebut} onChange={(e) => setDatDebut(e.target.value)} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="datFin">Date fin</Label>
        <Input id="datFin" type="date" value={datFin} onChange={(e) => setDatFin(e.target.value)} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="etat">État</Label>
        <Input id="etat" value={etat} onChange={(e) => setEtat(e.target.value)} placeholder="Ex: Ouvert / Fermé" required />
      </div>

      <div className="flex justify-end gap-4 mt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          <X className="w-4 h-4" /> Annuler
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {editId ? "Mettre à jour" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
