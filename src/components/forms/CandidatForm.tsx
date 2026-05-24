"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { API_ENDPOINTS, apiUrl } from "@/lib/api";
import type { ApiRecord } from "@/lib/api-types";

interface CandidatFormProps {
  onAdded: () => void;
  onCancel: () => void;
  editId?: string | number | null;
}

interface CandidatFormValues {
  nom_cand: string;
  pren_cand: string;
  genre: string;
  dat_nais: string;
  lieu_nais: string;
  telephone1: string;
  telephone2: string;
  email: string;
  sitmat: string;
  diplome: string;
}

const validationSchema = Yup.object().shape({
  nom_cand: Yup.string().required("Nom requis"),
  pren_cand: Yup.string().required("Prénom requis"),
  genre: Yup.string().required("Genre requis"),
  dat_nais: Yup.string().required("Date de naissance requise"),
  lieu_nais: Yup.string().required("Lieu requis"),
  telephone1: Yup.string().required("Téléphone requis"),
  email: Yup.string().email("Email invalide").required("Email requis"),
  sitmat: Yup.string().required("Situation matrimoniale requise"),
  diplome: Yup.string().nullable(), 
});

export default function CandidatForm({ onAdded, onCancel, editId }: CandidatFormProps) {
  const [diplomes, setDiplomes] = useState<ApiRecord[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(false);

  const [initialValues, setInitialValues] = useState({
    nom_cand: "",
    pren_cand: "",
    genre: "M",
    dat_nais: "",
    lieu_nais: "",
    telephone1: "",
    telephone2: "",
    email: "",
    sitmat: "Célibataire",
    diplome: "", 
  });

  useEffect(() => {
    // 1. Charger les diplômes
    fetch(apiUrl(API_ENDPOINTS.diplomes))
      .then(res => res.json())
      .then(data => setDiplomes(data))
      .catch(err => console.error("Erreur diplômes:", err));

    // 2. Charger le candidat si modification
    if (editId) {
      setLoadingInitial(true);
      fetch(apiUrl(`${API_ENDPOINTS.candidats}${editId}/`))
        .then(res => res.json())
        .then(data => {
          setInitialValues({
            nom_cand: data.nom_cand || "",
            pren_cand: data.pren_cand || "",
            genre: data.genre || "M",
            dat_nais: data.dat_nais || "",
            lieu_nais: data.lieu_nais || "",
            telephone1: data.telephone1 || "",
            telephone2: data.telephone2 || "",
            email: data.email || "",
            sitmat: data.sitmat || "Célibataire",
            diplome: data.diplome ? String(data.diplome) : "",
          });
        })
        .finally(() => setLoadingInitial(false));
    }
  }, [editId]);

  const handleSubmit = async (
    values: CandidatFormValues,
    { setSubmitting }: FormikHelpers<CandidatFormValues>
  ) => {
    const formData = new FormData();
    
    // On boucle proprement sur les valeurs
    Object.keys(values).forEach(key => {
      // On n'envoie pas de chaîne vide pour le diplôme s'il est nul
      if (key === "diplome" && (values[key] === "" || values[key] === "null")) {
        return;
      }
      formData.append(key, values[key as keyof CandidatFormValues]);
    });

    // Gestion de la photo : on ne l'ajoute que si l'utilisateur en a choisi une nouvelle
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    try {
      const url = editId
        ? apiUrl(`${API_ENDPOINTS.candidats}${editId}/`)
        : apiUrl(API_ENDPOINTS.candidats);
      
      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        body: formData,
        // ATTENTION : Ne pas mettre de Headers Content-Type ici, le navigateur le fait pour FormData
      });

      if (response.ok) {
        toast.success(editId ? "Candidat modifié !" : "Candidat créé !");
        onAdded();
      } else {
        const errorData = await response.json();
        console.error("Erreur API Détails:", errorData);
        toast.error("Vérifiez les données saisies (voir console)");
      }
    } catch (error) {
      console.error("Erreur Réseau:", error);
      toast.error("Impossible de contacter le serveur");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /> Chargement...</div>;

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0A5C36]">
            {editId ? "Modifier la fiche" : "Ajouter un candidat"}
          </DialogTitle>
        </DialogHeader>

        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values, errors, touched }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <Label>Nom</Label>
                  <Field name="nom_cand" as={Input} className={errors.nom_cand && touched.nom_cand ? "border-red-500" : "border-[#0A5C36]/30"} />
                  <ErrorMessage name="nom_cand" component="span" className="text-red-500 text-[10px]" />
                </div>

                <div className="space-y-1">
                  <Label>Prénom</Label>
                  <Field name="pren_cand" as={Input} className="border-[#0A5C36]/30" />
                </div>

                <div className="space-y-1">
                  <Label>Email</Label>
                  <Field name="email" type="email" as={Input} className="border-[#0A5C36]/30" />
                  <ErrorMessage name="email" component="span" className="text-red-500 text-[10px]" />
                </div>

                <div className="space-y-1">
                  <Label>Genre</Label>
                  <Select value={values.genre} onValueChange={(v) => setFieldValue("genre", v)}>
                    <SelectTrigger className="border-[#0A5C36]/30"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculin</SelectItem>
                      <SelectItem value="F">Féminin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Date de naissance</Label>
                  <Field name="dat_nais" type="date" as={Input} className="border-[#0A5C36]/30" />
                </div>

                <div className="space-y-1">
                  <Label>Lieu de naissance</Label>
                  <Field name="lieu_nais" as={Input} className="border-[#0A5C36]/30" />
                </div>

                <div className="space-y-1">
                  <Label>Téléphone</Label>
                  <Field name="telephone1" as={Input} className="border-[#0A5C36]/30" />
                </div>

                <div className="space-y-1">
                  <Label>Situation Matrimoniale</Label>
                  <Field name="sitmat" as={Input} className="border-[#0A5C36]/30" />
                </div>

                <div className="space-y-1">
                  <Label>Diplôme</Label>
                  <Select 
                    value={values.diplome} 
                    onValueChange={(v) => setFieldValue("diplome", v)}
                  >
                    <SelectTrigger className="border-[#0A5C36]/30">
                      <SelectValue placeholder="Sélectionner un diplôme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Aucun</SelectItem>
                      {diplomes.map((d) => (
                        <SelectItem key={String(d.id_diplome)} value={String(d.id_diplome)}>
                          {String(d.designation)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Photo de profil</Label>
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => e.target.files && setPhotoFile(e.target.files[0])} 
                    className="border-[#0A5C36]/30" 
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#0A5C36] hover:bg-[#084a2c] py-6">
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : (editId ? "Enregistrer les modifications" : "Créer le compte")}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1 border-[#0A5C36] text-[#0A5C36] py-6">
                  Annuler
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}