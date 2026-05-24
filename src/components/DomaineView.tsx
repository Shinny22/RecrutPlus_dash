"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { display, type ApiRecord } from "@/lib/api-types";

export default function DomaineView({
  domaine,
  onClose,
}: {
  domaine: ApiRecord;
  onClose: () => void;
}) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-4 rounded-xl p-6 shadow-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#0A5C36] text-lg font-bold">
            Détails du Domaine
          </DialogTitle>
        </DialogHeader>

        <div className="text-gray-700 space-y-2">
          <div>
            <strong className="text-[#0A5C36]">ID :</strong> {display(domaine.id_dom)}
          </div>
          <div>
            <strong className="text-[#0A5C36]">Libellé :</strong> {display(domaine.lib_dom)}
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
