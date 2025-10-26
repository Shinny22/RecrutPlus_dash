"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Diplome, Domaine } from "@/lib/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const Schema = Yup.object().shape({
  Designation: Yup.string().required("Designation requise").min(2, "Trop court"),
  IdDom: Yup.number().required("Domaine requis"),
});

export default function DiplomeForm({
  onAdded,
  onCancel,
}: {
  onAdded: () => void;
  onCancel: () => void;
}) {
  const [domaines, setDomaines] = useState<Domaine[]>([]);

  useEffect(() => {
    fetch("/api/domaines")
      .then((res) => res.json())
      .then(setDomaines)
      .catch(console.error);
  }, []);

  async function onSubmit(values: Omit<Diplome, "IdDiplome">, { resetForm }: any) {
    try {
      const res = await fetch("/api/diplomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout");
      resetForm();
      onAdded();
      alert("✅ Diplôme ajouté !");
    } catch (err) {
      console.error(err);
      alert("❌ Erreur : " + err);
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-center text-blue-600">Ajouter un Diplôme</h2>
      <Formik
        initialValues={{ Designation: "", IdDom: 0 }}
        validationSchema={Schema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Designation */}
            <div>
              <label className="block text-sm font-medium mb-1">Designation</label>
              <Field
                name="Designation"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Entrez la designation"
              />
              <ErrorMessage name="Designation" component="p" className="text-red-600 text-sm mt-1" />
            </div>

            {/* Domaine */}
            <div>
              <label className="block text-sm font-medium mb-1">Domaine</label>
              <Field
                as="select"
                name="IdDom"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Sélectionnez un domaine</option>
                {domaines.map((dom) => (
                  <option key={dom.IdDom} value={dom.IdDom}>
                    {dom.LibDom}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="IdDom" component="p" className="text-red-600 text-sm mt-1" />
            </div>

            {/* Boutons */}
            <div className="flex justify-between">
              <Button variant="secondary" onClick={onCancel}>
                Retour
              </Button>
              <Button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded">
                {isSubmitting ? "Envoi..." : "Ajouter"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
