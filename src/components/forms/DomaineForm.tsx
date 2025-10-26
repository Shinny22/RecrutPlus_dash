"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Domaine } from "@/lib/types";

const Schema = Yup.object().shape({
  LibDom: Yup.string().required("Libellé requis").min(2, "Trop court"),
});

export default function DomaineForm({
  onAdded,
  onCancel,
}: {
  onAdded: () => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (
    values: Omit<Domaine, "IdDom">,
    { resetForm }: any
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/domaines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout");

      resetForm();
      onAdded();
    } catch (err) {
      console.error(err);
      alert("❌ Erreur : " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Ajouter un Domaine
      </h2>
      <Formik initialValues={{ LibDom: "" }} validationSchema={Schema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Libellé</label>
              <Field
                name="LibDom"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Entrez le libellé"
              />
              <ErrorMessage
                name="LibDom"
                component="p"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="secondary" type="button" onClick={onCancel}>
                Retour
              </Button>
              <Button type="submit" disabled={isSubmitting || loading} className="flex items-center gap-2">
                {loading && <Loader2 className="animate-spin w-4 h-4" />}
                {loading ? "Envoi..." : "Ajouter"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
