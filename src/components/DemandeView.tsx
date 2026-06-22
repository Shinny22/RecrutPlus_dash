"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { display, displayDate, type ApiRecord } from "@/lib/api-types";

export default function DemandeView({
  demande,
  onClose,
}: {
  demande: ApiRecord;
  onClose: () => void;
}) {
  const candidat = demande.candidat as ApiRecord | number | undefined;
  const campagne = demande.campagne as ApiRecord | string | undefined;
  const candidatLabel =
    typeof candidat === "object" && candidat !== null
      ? `${display(candidat.nom_cand)} ${display(candidat.pren_cand)}`.trim()
      : display(candidat);
  const campagneLabel =
    typeof campagne === "object" && campagne !== null
      ? display(campagne.description)
      : display(campagne);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 rounded-2xl shadow-lg border border-[#E6F4ED] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0A5C36]">
            Détails de la demande #{display(demande.id ?? demande.id_dde, "?")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4 text-gray-700">
          <p><strong className="text-[#0A5C36]">Candidat :</strong> {candidatLabel}</p>
          <p><strong className="text-[#0A5C36]">Campagne :</strong> {campagneLabel}</p>
          <p><strong className="text-[#0A5C36]">État :</strong> {display(demande.etat_dde)}</p>
          <p><strong className="text-[#0A5C36]">Date :</strong> {displayDate(demande.dat_dde ?? demande.date_creation)}</p>
          <p><strong className="text-[#0A5C36]">Année d&apos;obtention :</strong> {display(demande.anne_obt_dip)}</p>
          <p><strong className="text-[#0A5C36]">Réponse :</strong> {display(demande.reponse, "-")}</p>
          {demande.cv ? (
            <p>
              <strong className="text-[#0A5C36]">CV :</strong>{" "}
              <a
                href={String(demande.cv)}
                target="_blank"
                rel="noreferrer"
                className="text-[#0A5C36] underline hover:text-[#1B7A53] transition-colors"
              >
                Voir CV
              </a>
            </p>
          ) : null}
          {demande.diplome_fichier ? (
            <p>
              <strong className="text-[#0A5C36]">Diplôme :</strong>{" "}
              <a
                href={String(demande.diplome_fichier)}
                target="_blank"
                rel="noreferrer"
                className="text-[#0A5C36] underline hover:text-[#1B7A53] transition-colors"
              >
                Voir Diplôme
              </a>
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-[#0A5C36] hover:bg-[#1B7A53] text-white rounded-xl shadow-md transition-transform hover:scale-[1.02]"
          >
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
