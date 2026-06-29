"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { API_ENDPOINTS, apiUrl } from "@/lib/api";
import { toast } from "sonner"; // ✅ Ajout de sonner pour des notifications graphiques propres
import type { ApiRecord, DiplomeRecord } from "@/lib/api-types";

const API_DOMAINE = apiUrl(API_ENDPOINTS.domaines);
const API_DIPLOME = apiUrl(API_ENDPOINTS.diplomes);

interface DiplomeFormValues {
  designation: string;
  domaineId: string;
}

export default function DiplomeForm({
  diplome,
  onClose,
}: {
  diplome?: DiplomeRecord | null;
  onClose: () => void;
}) {
  const [domaines, setDomaines] = useState<ApiRecord[]>([]);

  // Fonction utilitaire pour récupérer la configuration d'authentification globale
  const getAuthConfig = () => {
    const token = localStorage.getItem("access_token");
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  };

  // 1. Schéma de validation Yup
  const validationSchema = Yup.object({
    designation: Yup.string()
      .min(3, "La désignation doit faire au moins 3 caractères")
      .required("La désignation est obligatoire"),
    domaineId: Yup.string()
      .required("Veuillez sélectionner un domaine"),
  });

  // 2. Configuration de Formik
  const formik = useFormik<DiplomeFormValues>({
    initialValues: {
      designation: diplome?.designation || "",
      domaineId: diplome?.domaine ? String(diplome.domaine) : "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const payload = {
        designation: values.designation,
        domaine: Number(values.domaineId),
      };

      try {
        const config = getAuthConfig();

        if (diplome) {
          // Envoi du PUT avec le payload ET le token
          await axios.put(`${API_DIPLOME}${diplome.id_diplome}/`, payload, config);
          toast.success("Diplôme modifié avec succès");
        } else {
          // Envoi du POST avec le payload ET le token
          await axios.post(API_DIPLOME, payload, config);
          toast.success("Diplôme créé avec succès");
        }
        onClose();
      } catch (err) {
        console.error("Erreur sauvegarde:", err);
        toast.error("Échec de l'enregistrement. Vérifiez vos accès.");
      }
    },
  });

  // Charger les domaines au montage avec sécurisation token intégrée
  useEffect(() => {
    const fetchDomaines = async () => {
      try {
        const res = await axios.get(API_DOMAINE, getAuthConfig());
        setDomaines(Array.isArray(res.data) ? res.data : res.data.results ?? []);
      } catch (err) {
        console.error("Erreur chargement domaines:", err);
        toast.error("Impossible de charger la liste des domaines.");
      }
    };
    fetchDomaines();
  }, []);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-5 rounded-xl p-6 border border-[#E6F4ED] bg-white shadow-md">
        <DialogHeader>
          <DialogTitle className="text-[#0A5C36] text-xl font-bold">
            {diplome ? "Modifier le Diplôme" : "Nouveau Diplôme"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          
          {/* Désignation */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="designation" className="text-[#0A5C36] font-medium">Désignation</Label>
            <Input
              id="designation"
              name="designation"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.designation}
              className={`border-[#1B7A53] focus:ring-2 focus:ring-[#B4EFC4] rounded-lg ${
                formik.touched.designation && formik.errors.designation ? "border-red-500" : ""
              }`}
              placeholder="Ex: Ingénierie Logicielle"
            />
            {formik.touched.designation && formik.errors.designation ? (
              <span className="text-red-500 text-xs">{formik.errors.designation}</span>
            ) : null}
          </div>

          {/* Domaine */}
          <div className="flex flex-col gap-1">
            <Label className="text-[#0A5C36] font-medium">Domaine</Label>
            <Select
              value={formik.values.domaineId}
              onValueChange={(value) => formik.setFieldValue("domaineId", value)}
            >
              <SelectTrigger 
                className={`border-[#1B7A53] focus:ring-2 focus:ring-[#B4EFC4] rounded-lg ${
                  formik.touched.domaineId && formik.errors.domaineId ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Choisir un domaine" />
              </SelectTrigger>
              <SelectContent>
                {domaines.map((d) => (
                  <SelectItem key={String(d.id_dom)} value={String(d.id_dom)}>
                    {String(d.lib_dom)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.domaineId && formik.errors.domaineId ? (
              <span className="text-red-500 text-xs">{formik.errors.domaineId}</span>
            ) : null}
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-[#0A5C36] hover:bg-[#0C7041] text-white rounded-xl shadow-sm"
            >
              {formik.isSubmitting ? "Enregistrement..." : diplome ? "Mettre à jour" : "Créer"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full border-[#0A5C36] text-[#0A5C36] hover:bg-[#E7F5EF] rounded-xl"
            >
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}