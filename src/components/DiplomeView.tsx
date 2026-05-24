"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { display, type ApiRecord } from "@/lib/api-types";

export default function DiplomeView({
  diplome,
  onClose,
}: {
  diplome: ApiRecord;
  onClose: () => void;
}) {
  const domaine = diplome.domaine as ApiRecord | number | undefined;
  const domaineLabel =
    typeof domaine === "object" && domaine !== null
      ? display(domaine.lib_dom)
      : display(domaine);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-6 p-6 bg-white rounded-xl shadow-md border border-[#E6F4ED]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0A5C36]">Détails du Diplôme</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-[#0A5C36]">
          <div>
            <strong>Désignation :</strong> {display(diplome.designation)}
          </div>
          <div>
            <strong>Domaine :</strong> {domaineLabel}
          </div>
        </div>

        <Button
          onClick={onClose}
          className="w-full mt-4 bg-[#0A5C36] text-white hover:bg-[#0C7041] rounded-xl shadow-sm"
        >
          Fermer
        </Button>
      </DialogContent>
    </Dialog>
  );
}
