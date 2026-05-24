"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { display, displayDate, type ApiRecord } from "@/lib/api-types";

export default function CandidatView({
  candidat,
  onClose,
}: {
  candidat: ApiRecord;
  onClose: () => void;
}) {
  const diplome = candidat.diplome as ApiRecord | undefined;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-4 rounded-2xl shadow-lg border border-[#E6F4ED] bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0A5C36]">
            Détails du Candidat
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-gray-700">
          <p><strong className="text-[#0A5C36]">Nom :</strong> {display(candidat.nom_cand)}</p>
          <p><strong className="text-[#0A5C36]">Prénom :</strong> {display(candidat.pren_cand)}</p>
          <p><strong className="text-[#0A5C36]">Genre :</strong> {display(candidat.genre)}</p>
          <p><strong className="text-[#0A5C36]">Date de naissance :</strong> {displayDate(candidat.dat_nais)}</p>
          <p><strong className="text-[#0A5C36]">Lieu de naissance :</strong> {display(candidat.lieu_nais)}</p>
          <p><strong className="text-[#0A5C36]">Email :</strong> {display(candidat.email)}</p>
          <p><strong className="text-[#0A5C36]">Téléphone 1 :</strong> {display(candidat.telephone1)}</p>
          {candidat.telephone2 ? (
            <p><strong className="text-[#0A5C36]">Téléphone 2 :</strong> {display(candidat.telephone2)}</p>
          ) : null}
          <p><strong className="text-[#0A5C36]">Statut matrimonial :</strong> {display(candidat.sitmat)}</p>
          <p><strong className="text-[#0A5C36]">Diplôme :</strong> {display(diplome?.designation)}</p>
          {candidat.photo ? (
            <p><strong className="text-[#0A5C36]">Photo :</strong> {display(candidat.photo)}</p>
          ) : null}
        </div>

        <Button
          onClick={onClose}
          className="w-full rounded-xl bg-[#0A5C36] hover:bg-[#1B7A53] text-white shadow-md transition-transform hover:scale-[1.02]"
        >
          Fermer
        </Button>
      </DialogContent>
    </Dialog>
  );
}
