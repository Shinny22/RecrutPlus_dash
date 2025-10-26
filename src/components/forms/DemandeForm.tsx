"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Demande } from "@/lib/types";

const Schema = Yup.object().shape({
  DatDde: Yup.string().required("Date requise"),
  CV: Yup.string().required("CV requis"),
  Diplome: Yup.string().required("Diplôme requis"),
  AnneObtDip: Yup.number()
    .required("Année requise")
    .min(1900)
    .max(new Date().getFullYear()),
  EtatDde: Yup.string()
    .oneOf(["En attente", "Acceptée", "Refusée"])
    .required(),
  CodAnne: Yup.string().required("Code année requis"),
  IdCandidat: Yup.number().positive().integer().required("ID candidat requis"),
});

export default function DemandeForm() {
  async function onSubmit(values: Omit<Demande, "IdDde">, { resetForm }: any) {
    await fetch("/api/demandes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    resetForm();
  }

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-base font-semibold mb-3 text-gray-800">
        Ajouter une demande
      </h2>

      <Formik
        initialValues={{
          DatDde: "",
          CV: "",
          Diplome: "",
          AnneObtDip: new Date().getFullYear(),
          EtatDde: "En attente",
          Reponse: "",
          CodAnne: "",
          IdCandidat: 0,
        }}
        validationSchema={Schema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-3 text-sm">
            <div>
              <label className="block text-gray-700 mb-1">Date</label>
              <Field
                name="DatDde"
                type="date"
                className="w-full border rounded-md px-2 py-1.5 text-sm"
              />
              <ErrorMessage
                name="DatDde"
                component="p"
                className="text-red-600 text-xs mt-0.5"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">CV (URL)</label>
              <Field
                name="CV"
                className="w-full border rounded-md px-2 py-1.5 text-sm"
              />
              <ErrorMessage
                name="CV"
                component="p"
                className="text-red-600 text-xs mt-0.5"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Diplôme</label>
              <Field
                name="Diplome"
                className="w-full border rounded-md px-2 py-1.5 text-sm"
              />
              <ErrorMessage
                name="Diplome"
                component="p"
                className="text-red-600 text-xs mt-0.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 mb-1">
                  Année obtention
                </label>
                <Field
                  name="AnneObtDip"
                  type="number"
                  className="w-full border rounded-md px-2 py-1.5 text-sm"
                />
                <ErrorMessage
                  name="AnneObtDip"
                  component="p"
                  className="text-red-600 text-xs mt-0.5"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">État</label>
                <Field
                  as="select"
                  name="EtatDde"
                  className="w-full border rounded-md px-2 py-1.5 text-sm"
                >
                  <option>En attente</option>
                  <option>Acceptée</option>
                  <option>Refusée</option>
                </Field>
                <ErrorMessage
                  name="EtatDde"
                  component="p"
                  className="text-red-600 text-xs mt-0.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Réponse</label>
              <Field
                as="textarea"
                name="Reponse"
                rows="2"
                className="w-full border rounded-md px-2 py-1.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Code Année (FK)</label>
              <Field
                name="CodAnne"
                className="w-full border rounded-md px-2 py-1.5 text-sm"
              />
              <ErrorMessage
                name="CodAnne"
                component="p"
                className="text-red-600 text-xs mt-0.5"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                ID Candidat (FK)
              </label>
              <Field
                name="IdCandidat"
                type="number"
                className="w-full border rounded-md px-2 py-1.5 text-sm"
              />
              <ErrorMessage
                name="IdCandidat"
                component="p"
                className="text-red-600 text-xs mt-0.5"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition"
              >
                {isSubmitting ? "Envoi..." : "Ajouter"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
