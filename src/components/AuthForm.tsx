// "use client";

// import { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// /* ======================
//    Validation (V2)
// ====================== */
// const LoginSchema = Yup.object().shape({
//   username: Yup.string()
//     .required("Le nom d'utilisateur est requis")
//     .min(3, "Au moins 3 caractères")
//     .max(20, "Max 20 caractères")
//     .matches(/^[a-zA-Z0-9_]+$/, "Uniquement lettres, chiffres et underscore"),

//   password: Yup.string()
//     .required("Mot de passe requis")
//     .min(3, "Min 8 caractères"),
// });

// export default function AuthForm() {
//   const [serverError, setServerError] = useState<string | null>(null);

//   /* ======================
//      Login DRF (V1)
//   ====================== */
//   async function handleLogin(values: {
//     username: string;
//     password: string;
//   }) {
//     setServerError(null);

//     try {
//       const res = await fetch("http://127.0.0.1:8000/login/admin/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           username: values.username,
//           password: values.password,
//         }),
//       });

//       if (!res.ok) {
//         const body = await res.json();
//         setServerError(body?.error || "Identifiants invalides");
//         return;
//       }

//       const data = await res.json();

//       // ✅ JWT Storage
//       localStorage.setItem("access_token", data.access);
//       localStorage.setItem("refresh_token", data.refresh);
//       localStorage.setItem("admin_user", JSON.stringify(data.user));

//       // ✅ Redirect
//       window.location.href = "/app/dashboard";
//     } catch {
//       setServerError("Impossible de joindre le serveur");
//     }
//   }

//   return (
//     <Formik
//       initialValues={{ username: "", password: "", remember: false }}
//       validationSchema={LoginSchema}
//       onSubmit={handleLogin}
//     >
//       {({ isSubmitting }) => (
//         <Form className="space-y-4">

//           {/* Erreur serveur */}
//           {serverError && (
//             <div className="text-sm text-red-600 font-medium">
//               {serverError}
//             </div>
//           )}

//           {/* Username */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Nom d'utilisateur
//             </label>

//             <Field
//               name="username"
//               placeholder="admin"
//               className="w-full px-3 py-2 rounded-lg border border-gray-300
//               focus:border-[#1B7A53] focus:ring-2 focus:ring-[#B4EFC4]
//               outline-none transition"
//             />

//             <ErrorMessage
//               name="username"
//               component="p"
//               className="text-red-600 text-sm mt-1"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Mot de passe
//             </label>

//             <Field
//               name="password"
//               type="password"
//               placeholder="••••••••"
//               className="w-full px-3 py-2 rounded-lg border border-gray-300
//               focus:border-[#1B7A53] focus:ring-2 focus:ring-[#B4EFC4]
//               outline-none transition"
//             />

//             <ErrorMessage
//               name="password"
//               component="p"
//               className="text-red-600 text-sm mt-1"
//             />
//           </div>

//           {/* Options */}
//           <div className="flex items-center justify-between">
//             <label className="flex items-center gap-2 text-sm text-gray-600">
//               <Field type="checkbox" name="remember" className="w-4 h-4" />
//               Se souvenir de moi
//             </label>

//             <a
//               href="/forgot-password"
//               className="text-sm text-[#0A5C36] hover:underline"
//             >
//               Mot de passe oublié ?
//             </a>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full px-4 py-2 rounded-lg bg-[#0A5C36] text-white
//             font-medium shadow-sm hover:bg-[#084E2F]
//             transition disabled:opacity-60"
//           >
//             {isSubmitting ? "Connexion..." : "Se connecter"}
//           </button>
//         </Form>
//       )}
//     </Formik>
//   );
// }



"use client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { API_ENDPOINTS, apiUrl } from "@/lib/api";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Le nom d'utilisateur est requis"),
  password: Yup.string().required("Mot de passe requis"),
});

export default function AuthForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleLogin(values: { username: string; password: string }) {
    setServerError(null);

    try {
      const res = await fetch(apiUrl(API_ENDPOINTS.loginAdmin), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json();
        setServerError(body.error || "Identifiants invalides");
        return;
      }

      const data = await res.json();
      // ✅ Sauvegarde des tokens JWT dans le localStorage
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("admin_user", JSON.stringify(data.user));

      // ✅ Redirection vers le dashboard
      window.location.href = "/dashboard";
    } catch {
      setServerError("Impossible de joindre le serveur");
    }
  }

  return (
    <Formik initialValues={{ username: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleLogin}>
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          {serverError && <p className="text-red-600 text-sm">{serverError}</p>}

          <div>
            <label htmlFor="username" className="block text-sm mb-1">
              Nom d&apos;utilisateur
            </label>
            <Field name="username" className="w-full rounded border px-3 py-2" />
            <ErrorMessage name="username" component="p" className="text-red-600 text-sm mt-1" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Mot de passe
            </label>
            <Field name="password" type="password" className="w-full rounded border px-3 py-2" />
            <ErrorMessage name="password" component="p" className="text-red-600 text-sm mt-1" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded px-4 py-2 bg-green-600 text-white font-medium disabled:opacity-60"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
