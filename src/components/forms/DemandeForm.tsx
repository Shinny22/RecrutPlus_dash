// "use client";

// import React, { useEffect, useState } from "react";
// import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
// import { Loader2, FileUp, User, Briefcase, GraduationCap, CheckCircle2, X, MessageSquare } from "lucide-react";
// import { toast } from "sonner";
// import { API_ENDPOINTS, apiUrl } from "@/lib/api";
// import type { ApiRecord } from "@/lib/api-types";

// interface DemandeFormData {
//   id?: number;
//   id_dde?: number;
//   anne_obt_dip?: number;
//   etat_dde?: string;
//   reponse?: string;
//   campagne?: string | number;
//   candidat?: string | number;
// }

// interface DemandeFormProps {
//   demande?: DemandeFormData | null;
//   onClose?: () => void;
//   onAdded: () => void;
// }

// // Validation Yup pour éviter les erreurs 400 (Bad Request)
// const validationSchema = Yup.object().shape({
//   anne_obt_dip: Yup.number().required("Année requise").min(1900).max(2100),
//   etat_dde: Yup.string().required("Le statut est requis"),
//   campagne: Yup.string().required("Sélectionnez une campagne"),
//   candidat: Yup.string().required("Sélectionnez un candidat"),
//   reponse: Yup.string().nullable(),
// });

// // Correction : Ajout de = () => {} pour éviter l'erreur "onClose is not a function"
// export default function DemandeForm({
//   demande,
//   onClose = () => {},
//   onAdded,
// }: DemandeFormProps) {
//   const [campagnes, setCampagnes] = useState<ApiRecord[]>([]);
//   const [candidats, setCandidats] = useState<ApiRecord[]>([]);
//   const [files, setFiles] = useState<{ cv: File | null; diplome: File | null }>({ cv: null, diplome: null });

//   // Chargement des données au montage du composant
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [cp, cand] = await Promise.all([
//           fetch(apiUrl(API_ENDPOINTS.campagnes)).then((res) => res.json()),
//           fetch(apiUrl(API_ENDPOINTS.candidats)).then((res) => res.json()),
//         ]);
//         setCampagnes(cp);
//         setCandidats(cand);
//       } catch {
//         toast.error("Erreur de communication avec le serveur");
//       }
//     };
//     fetchData();
//   }, []);

//   const initialValues = {
//     anne_obt_dip: demande?.anne_obt_dip || 2025,
//     etat_dde: demande?.etat_dde || "ENVOYEE",
//     reponse: demande?.reponse || "",
//     campagne: demande?.campagne != null ? String(demande.campagne) : "",
//     candidat: demande?.candidat != null ? String(demande.candidat) : "",
//   };

//   return (
//     <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
//       <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-slate-50">
        
//         {/* HEADER STYLISÉ */}
//         <div className="bg-[#0A5C36] px-6 py-4 text-white flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-white/20 rounded-xl"><Briefcase className="w-5 h-5" /></div>
//             <div>
//               <DialogTitle className="text-lg font-bold">
//                 {demande ? "Modifier le Dossier" : "Nouvelle Candidature"}
//               </DialogTitle>
//               <p className="text-[10px] text-emerald-100/70 uppercase font-medium tracking-wider">
//                 Remplissez les informations ci-dessous
//               </p>
//             </div>
//           </div>
//           <button 
//             type="button" 
//             onClick={onClose} 
//             className="p-2 hover:bg-white/10 rounded-full transition-all outline-none"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           enableReinitialize
//           onSubmit={async (values, { setSubmitting }) => {
//             try {
//               const formData = new FormData();
//               // Envoi des données texte
//               formData.append("anne_obt_dip", String(values.anne_obt_dip));
//               formData.append("etat_dde", values.etat_dde);
//               formData.append("reponse", values.reponse || "");
//               formData.append("campagne", String(values.campagne));
//               formData.append("candidat", String(values.candidat));
              
//               // Envoi des fichiers si présents
//               if (files.cv) formData.append("cv", files.cv);
//               if (files.diplome) formData.append("diplome_fichier", files.diplome);

//               const demandeId = demande?.id ?? demande?.id_dde;
//               const method = demandeId ? "PUT" : "POST";
//               const url = demandeId
//                 ? apiUrl(`${API_ENDPOINTS.demandes}${demandeId}/`)
//                 : apiUrl(API_ENDPOINTS.demandes);

//               const res = await fetch(url, { method, body: formData });
              
//               if (!res.ok) {
//                 const errorData = await res.json();
//                 toast.error(`Erreur: ${JSON.stringify(errorData)}`);
//                 return;
//               }

//               toast.success("Opération réussie !");
//               onAdded(); 
//               onClose();
//             } catch {
//               toast.error("Une erreur réseau est survenue");
//             } finally {
//               setSubmitting(false);
//             }
//           }}
//         >
//           {({ isSubmitting, setFieldValue, values }) => (
//             <Form className="p-6 space-y-4">
              
//               {/* SECTION CANDIDAT ET CAMPAGNE */}
//               <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
//                 <div className="space-y-1.5">
//                   <Label className="text-[#0A5C36] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
//                     <User className="w-3.5 h-3.5" /> Candidat Concerné
//                   </Label>
//                   <Select value={String(values.candidat)} onValueChange={(v) => setFieldValue("candidat", v)}>
//                     <SelectTrigger className="rounded-xl border-slate-200 h-10">
//                       <SelectValue placeholder="Choisir un candidat" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {candidats.map((c) => (
//                         <SelectItem key={String(c.id_candidat)} value={String(c.id_candidat)}>
//                           {String(c.nom_cand)} {String(c.pren_cand)}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-1.5">
//                     <Label className="text-[#0A5C36] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
//                       <Briefcase className="w-3.5 h-3.5" /> Campagne
//                     </Label>
//                     <Select value={String(values.campagne)} onValueChange={(v) => setFieldValue("campagne", v)}>
//                       <SelectTrigger className="rounded-xl border-slate-200 h-10">
//                         <SelectValue placeholder="Campagne" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {campagnes.map((cp) => (
//                           <SelectItem key={String(cp.cod_anne)} value={String(cp.cod_anne)}>
//                             {String(cp.description || cp.cod_anne)}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-1.5">
//                     <Label className="text-[#0A5C36] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
//                       <GraduationCap className="w-3.5 h-3.5" /> Année Diplôme
//                     </Label>
//                     <Field name="anne_obt_dip" as={Input} type="number" className="rounded-xl border-slate-200 h-10" />
//                   </div>
//                 </div>
//               </div>

//               {/* SECTION STATUT ET DOCUMENTS */}
//               <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-1.5">
//                     <Label className="text-[#0A5C36] font-bold text-[11px] uppercase tracking-wider">Statut Dossier</Label>
//                     <Select value={values.etat_dde} onValueChange={(v) => setFieldValue("etat_dde", v)}>
//                       <SelectTrigger className="rounded-xl border-slate-200 h-10">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="ENVOYEE">📤 Envoyée</SelectItem>
//                         <SelectItem value="ACCEPTEE" className="text-emerald-600 font-bold">✅ Acceptée</SelectItem>
//                         <SelectItem value="REFUSEE" className="text-red-600 font-bold">❌ Refusée</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-1.5">
//                     <Label className="text-[#0A5C36] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
//                       <MessageSquare className="w-3.5 h-3.5" /> Note
//                     </Label>
//                     <Field name="reponse" as={Input} className="rounded-xl border-slate-200 h-10" placeholder="..." />
//                   </div>
//                 </div>

//                 {/* ZONE FICHIERS COMPACTE */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="relative group border-2 border-dashed border-slate-200 rounded-xl p-3 bg-slate-50 hover:bg-emerald-50 transition-all text-center">
//                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFiles({...files, cv: e.target.files![0]})} />
//                     <FileUp className="w-4 h-4 mx-auto text-slate-400 group-hover:text-emerald-600" />
//                     <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">CV (PDF)</p>
//                     {files.cv && <p className="text-[9px] text-emerald-600 truncate">{files.cv.name}</p>}
//                   </div>

//                   <div className="relative group border-2 border-dashed border-slate-200 rounded-xl p-3 bg-slate-50 hover:bg-emerald-50 transition-all text-center">
//                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFiles({...files, diplome: e.target.files![0]})} />
//                     <FileUp className="w-4 h-4 mx-auto text-slate-400 group-hover:text-emerald-600" />
//                     <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Diplôme</p>
//                     {files.diplome && <p className="text-[9px] text-emerald-600 truncate">{files.diplome.name}</p>}
//                   </div>
//                 </div>
//               </div>

//               {/* BOUTONS D'ACTION */}
//               <div className="flex gap-3 pt-2">
//                 <Button 
//                   type="submit" 
//                   disabled={isSubmitting} 
//                   className="flex-1 bg-[#0A5C36] hover:bg-[#084a2c] h-12 rounded-2xl font-bold shadow-xl shadow-emerald-900/10 active:scale-[0.98] transition-all"
//                 >
//                   {isSubmitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Valider</>}
//                 </Button>
//                 <Button 
//                   type="button" 
//                   variant="outline" 
//                   onClick={onClose} 
//                   className="rounded-2xl h-12 px-6 border-slate-200 text-slate-500 font-bold hover:bg-white"
//                 >
//                   Annuler
//                 </Button>
//               </div>

//             </Form>
//           )}
//         </Formik>
//       </DialogContent>
//     </Dialog>
//   );
// }



"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Loader2, FileUp, User, Briefcase, GraduationCap, CheckCircle2, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { API_ENDPOINTS, apiUrl } from "@/lib/api";
import type { ApiRecord } from "@/lib/api-types";

interface DemandeFormData {
  id?: number;
  id_dde?: number;
  anne_obt_dip?: number;
  etat_dde?: string;
  reponse?: string;
  campagne?: string | number;
  candidat?: string | number;
}

interface DemandeFormProps {
  demande?: DemandeFormData | null;
  onClose?: () => void;
  onAdded: () => void;
}

const validationSchema = Yup.object().shape({
  anne_obt_dip: Yup.number().required("Année requise").min(1900).max(2100),
  etat_dde: Yup.string().required("Le statut est requis"),
  campagne: Yup.string().required("Sélectionnez une campagne"),
  candidat: Yup.string().required("Sélectionnez un candidat"),
  reponse: Yup.string().nullable(),
});

export default function DemandeForm({
  demande,
  onClose = () => {},
  onAdded,
}: DemandeFormProps) {
  const [campagnes, setCampagnes] = useState<ApiRecord[]>([]);
  const [candidats, setCandidats] = useState<ApiRecord[]>([]);
  const [files, setFiles] = useState<{ cv: File | null; diplome: File | null }>({ cv: null, diplome: null });

  // Chargement des données au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔑 Récupération du token pour charger les candidats légitimement
        const token = localStorage.getItem("access_token");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [cp, cand] = await Promise.all([
          fetch(apiUrl(API_ENDPOINTS.campagnes), { headers }).then((res) => res.json()),
          fetch(apiUrl(API_ENDPOINTS.candidats), { headers }).then((res) => res.json()),
        ]);
        setCampagnes(cp);
        setCandidats(cand);
      } catch {
        toast.error("Erreur de communication avec le serveur lors du chargement");
      }
    };
    fetchData();
  }, []);

  const initialValues = {
    anne_obt_dip: demande?.anne_obt_dip || 2026,
    etat_dde: demande?.etat_dde || "ENVOYEE",
    reponse: demande?.reponse || "",
    campagne: demande?.campagne != null ? String(demande.campagne) : "",
    candidat: demande?.candidat != null ? String(demande.candidat) : "",
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-slate-50">
        
        {/* HEADER STYLISÉ */}
        <div className="bg-[#0A5C36] px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl"><Briefcase className="w-5 h-5" /></div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {demande ? "Modifier le Dossier" : "Nouvelle Candidature"}
              </DialogTitle>
              <p className="text-[10px] text-emerald-100/70 uppercase font-medium tracking-wider">
                Remplissez les informations ci-dessous
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-full transition-all outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const formData = new FormData();
              formData.append("anne_obt_dip", String(values.anne_obt_dip));
              formData.append("etat_dde", values.etat_dde);
              formData.append("reponse", values.reponse || "");
              formData.append("campagne", String(values.campagne));
              formData.append("candidat", String(values.candidat));
              
              if (files.cv) formData.append("cv", files.cv);
              if (files.diplome) formData.append("diplome_fichier", files.diplome);

              const demandeId = demande?.id ?? demande?.id_dde;
              const method = demandeId ? "PUT" : "POST";
              const url = demandeId
                ? apiUrl(`${API_ENDPOINTS.demandes}${demandeId}/`)
                : apiUrl(API_ENDPOINTS.demandes);

              // 🔑 Récupération du token pour la soumission du formulaire
              const token = localStorage.getItem("access_token");

              const res = await fetch(url, { 
                method, 
                body: formData,
                headers: {
                  // On ne force pas "Content-Type" car FormData s'en occupe automatiquement avec la boundary boundary
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                }
              });
              
              if (!res.ok) {
                const errorData = await res.json();
                toast.error(`Erreur: ${JSON.stringify(errorData)}`);
                return;
              }

              toast.success("Opération réussie !");
              onAdded(); 
              onClose();
            } catch {
              toast.error("Une erreur réseau est survenue");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="p-6 space-y-4">
              
              {/* SECTION CANDIDAT ET CAMPAGNE */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[#0A5C36] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Candidat Concerné
                  </Label>
                  <Select value={String(values.candidat)} onValueChange={(v) => setFieldValue("candidat", v)}>
                    <SelectTrigger className="rounded-xl border-slate-200 h-10">
                      <SelectValue placeholder="Choisir un candidat" />
                    </SelectTrigger>
                    <SelectContent>
                      {candidats.map((c) => (
                        <SelectItem key={String(c.id_candidat)} value={String(c.id_candidat)}>
                          {String(c.nom_cand)} {String(c.pren_cand)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[#0A5C36] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" /> Campagne
                    </Label>
                    <Select value={String(values.campagne)} onValueChange={(v) => setFieldValue("campagne", v)}>
                      <SelectTrigger className="rounded-xl border-slate-200 h-10">
                        <SelectValue placeholder="Campagne" />
                      </SelectTrigger>
                      <SelectContent>
                        {campagnes.map((cp) => (
                          <SelectItem key={String(cp.cod_anne)} value={String(cp.cod_anne)}>
                            {String(cp.description || cp.cod_anne)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[#0A5C36] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" /> Année Diplôme
                    </Label>
                    <Field name="anne_obt_dip" as={Input} type="number" className="rounded-xl border-slate-200 h-10" />
                  </div>
                </div>
              </div>

              {/* SECTION STATUT ET DOCUMENTS */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[#0A5C36] font-bold text-[11px] uppercase tracking-wider">Statut Dossier</Label>
                    <Select value={values.etat_dde} onValueChange={(v) => setFieldValue("etat_dde", v)}>
                      <SelectTrigger className="rounded-xl border-slate-200 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ENVOYEE">📤 Envoyée</SelectItem>
                        <SelectItem value="ACCEPTEE" className="text-emerald-600 font-bold">✅ Acceptée</SelectItem>
                        <SelectItem value="REFUSEE" className="text-red-600 font-bold">❌ Refusée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[#0A5C36] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> Note
                    </Label>
                    <Field name="reponse" as={Input} className="rounded-xl border-slate-200 h-10" placeholder="..." />
                  </div>
                </div>

                {/* ZONE FICHIERS COMPACTE */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative group border-2 border-dashed border-slate-200 rounded-xl p-3 bg-slate-50 hover:bg-emerald-50 transition-all text-center">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFiles({...files, cv: e.target.files![0]})} />
                    <FileUp className="w-4 h-4 mx-auto text-slate-400 group-hover:text-emerald-600" />
                    <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">CV (PDF)</p>
                    {files.cv && <p className="text-[9px] text-emerald-600 truncate">{files.cv.name}</p>}
                  </div>

                  <div className="relative group border-2 border-dashed border-slate-200 rounded-xl p-3 bg-slate-50 hover:bg-emerald-50 transition-all text-center">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFiles({...files, diplome: e.target.files![0]})} />
                    <FileUp className="w-4 h-4 mx-auto text-slate-400 group-hover:text-emerald-600" />
                    <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Diplôme</p>
                    {files.diplome && <p className="text-[9px] text-emerald-600 truncate">{files.diplome.name}</p>}
                  </div>
                </div>
              </div>

              {/* BOUTONS D'ACTION */}
              <div className="flex gap-3 pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 bg-[#0A5C36] hover:bg-[#084a2c] h-12 rounded-2xl font-bold shadow-xl shadow-emerald-900/10 active:scale-[0.98] transition-all"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Valider</>}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  className="rounded-2xl h-12 px-6 border-slate-200 text-slate-500 font-bold hover:bg-white"
                >
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