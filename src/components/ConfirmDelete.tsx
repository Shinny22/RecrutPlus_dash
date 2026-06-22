"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function ConfirmDelete({
  open,
  onClose,
  onConfirm,
  title = "Supprimer l'élément",
  message = "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.",
}: ConfirmDeleteProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm space-y-4">
        <DialogHeader>
          <DialogTitle className="text-[#0A5C36] font-bold">{title}</DialogTitle>
        </DialogHeader>

        <p className="text-gray-600">{message}</p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" className="text-gray-700 hover:bg-gray-100" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            <Trash2 className="w-4 h-4" /> Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
