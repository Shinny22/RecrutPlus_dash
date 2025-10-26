"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// ✅ Schéma de validation
const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .required("Le nom d'utilisateur est requis")
    .min(3, "Au moins 3 caractères")
    .max(20, "Max 20 caractères")
    .matches(/^[a-zA-Z0-9_]+$/, "Uniquement lettres, chiffres et underscore"),

  password: Yup.string()
    .required("Mot de passe requis")
    .min(8, "Min 8 caractères")
    .max(32, "Max 32 caractères")
    .matches(/[a-z]/, "Doit contenir une minuscule")
    .matches(/[A-Z]/, "Doit contenir une majuscule")
    .matches(/[0-9]/, "Doit contenir un chiffre")
    .matches(/[@$!%*?&#]/, "Doit contenir un caractère spécial"),
});

export default function AuthForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleLogin(values: { username: string; password: string }) {
    setServerError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json();
        setServerError(body?.message || "Erreur de connexion");
        return;
      }

      // ✅ Redirection
      window.location.href = "/dashboard";
    } catch (err) {
      setServerError("Impossible de joindre le serveur");
    }
  }

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={handleLogin}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          {serverError && (
            <div role="alert" className="text-sm text-red-600">
              {serverError}
            </div>
          )}

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm mb-1">
              Nom d'utilisateur
            </label>
            <Field
              name="username"
              id="username"
              className="w-full rounded border px-3 py-2"
              placeholder="admin"
            />
            <ErrorMessage
              name="username"
              component="p"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Mot de passe
            </label>
            <Field
              name="password"
              id="password"
              type="password"
              className="w-full rounded border px-3 py-2"
              placeholder="••••••••"
            />
            <ErrorMessage
              name="password"
              component="p"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          {/* Options */}
          <div className="flex items-center justify-between">
            <label className="text-sm flex items-center gap-2">
              <Field type="checkbox" name="remember" className="w-4 h-4" />
              Se souvenir de moi
            </label>
            <a className="text-sm underline" href="#">
              Mot de passe oublié ?
            </a>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded px-4 py-2 bg-blue-600 text-white font-medium disabled:opacity-60"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
