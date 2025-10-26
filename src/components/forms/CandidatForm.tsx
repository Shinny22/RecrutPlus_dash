"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Candidat } from "@/lib/types";

const Schema = Yup.object().shape({
  NomCand: Yup.string().required("Nom requis"),
  PrenCand: Yup.string().required("Prénom requis"),
  Genre: Yup.string().oneOf(["M", "F"]).required("Genre requis"),
  DatNais: Yup.string().required("Date requise"),
  LieuNais: Yup.string().required("Lieu requis"),
  Telphone1: Yup.string().required("Téléphone requis"),
  Email: Yup.string().email("Email invalide").required("Email requis"),
  IdDiplome: Yup.number().positive().integer().required("Diplôme requis"),
});

export default function CandidatForm() {
  async function onSubmit(values: Omit<Candidat, "IdCandidat">, { resetForm }: any) {
    await fetch("/api/candidats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    resetForm();
  }

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-base font-semibold mb-3 text-gray-800">
        Ajouter un candidat
      </h2>

      <Formik
        initialValues={{
          NomCand: "",
          PrenCand: "",
          Genre: "M",
          DatNais: "",
          LieuNais: "",
          Telphone1: "",
          Telphone2: "",
          Email: "",
          Photo: "",
          Sitmat: "Célibataire",
          IdDiplome: 0,
        }}
        validationSchema={Schema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 mb-1">Nom</label>
                <Field
                  name="NomCand"
                  className="w-full border rounded-md px-2 py-1.5"
                />
                <ErrorMessage
                  name="NomCand"
                  component="p"
                  className="text-red-600 text-xs mt-0.5"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Prénom</label>
                <Field
                  name="PrenCand"
                  className="w-full border rounded-md px-2 py-1.5"
                />
                <ErrorMessage
                  name="PrenCand"
                  component="p"
                  className="text-red-600 text-xs mt-0.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 mb-1">Genre</label>
                <Field
                  as="select"
                  name="Genre"
                  className="w-full border rounded-md px-2 py-1.5"
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </Field>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Date de naissance
                </label>
                <Field
                  name="DatNais"
                  type="date"
                  className="w-full border rounded-md px-2 py-1.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Lieu de naissance</label>
              <Field
                name="LieuNais"
                className="w-full border rounded-md px-2 py-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 mb-1">Téléphone 1</label>
                <Field
                  name="Telphone1"
                  className="w-full border rounded-md px-2 py-1.5"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Téléphone 2</label>
                <Field
                  name="Telphone2"
                  className="w-full border rounded-md px-2 py-1.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <Field
                name="Email"
                type="email"
                className="w-full border rounded-md px-2 py-1.5"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Photo (URL)</label>
              <Field
                name="Photo"
                className="w-full border rounded-md px-2 py-1.5"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Situation matrimoniale
              </label>
              <Field
                as="select"
                name="Sitmat"
                className="w-full border rounded-md px-2 py-1.5"
              >
                <option value="Célibataire">Célibataire</option>
                <option value="Marié">Marié</option>
                <option value="Divorcé">Divorcé</option>
              </Field>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                ID Diplôme (FK)
              </label>
              <Field
                name="IdDiplome"
                type="number"
                className="w-full border rounded-md px-2 py-1.5"
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

