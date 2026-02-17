import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
   AlertCircle,
   CheckCircle,
   Lock,
   Mail,
   Phone,
   User,
} from "lucide-react";
import { clearError, updateConsumer } from "../../features/elecSlice";

function UpdateConsumer() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const location = useLocation();
   const { users, error } = useSelector((state) => state.elec);

   const consumer = location.state?.consumer || null;

   const [champs, setChamps] = useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
   });
   const [validationErrors, setValidationErrors] = useState({});
   const [success, setSuccess] = useState("");

   useEffect(() => {
      if (consumer) {
         setChamps({
            name: consumer.name || "",
            email: consumer.email || "",
            phone: consumer.phone || "",
            password: "",
            confirmPassword: "",
         });
      }
   }, [consumer]);

   function handleChange(e) {
      const { name, value } = e.target;
      setChamps((prev) => ({ ...prev, [name]: value }));

      if (error) dispatch(clearError());
      if (success) setSuccess("");

      setValidationErrors((prev) => {
         const copy = { ...prev };
         delete copy[name];
         return copy;
      });
   }

   function handleSubmit(e) {
      e.preventDefault();

      const errs = {};
      if (!champs.name.trim()) errs.name = "Nom obligatoire";

      if (!champs.email.trim()) errs.email = "Email obligatoire";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champs.email))
         errs.email = "Format email invalide";

      if (!champs.phone.trim()) errs.phone = "Telephone obligatoire";
      else if (!/^[0-9]{10}$/.test(champs.phone))
         errs.phone = "Le telephone doit avoir 10 chiffres";

      if (champs.password && champs.password.length < 6)
         errs.password = "Mot de passe minimum 6 caracteres";

      if (champs.password && champs.password !== champs.confirmPassword)
         errs.confirmPassword = "Les mots de passe ne correspondent pas";

      const emailExists = users?.some(
         (u) => u.email === champs.email && u.id !== consumer?.id,
      );
      const phoneExists = users?.some(
         (u) => u.phone === champs.phone && u.id !== consumer?.id,
      );

      if (emailExists) errs.email = "Email deja utilise";
      if (phoneExists) errs.phone = "Telephone deja utilise";

      if (Object.keys(errs).length) {
         setValidationErrors(errs);
         return;
      }

      dispatch(clearError());
      dispatch(
         updateConsumer({
            id: consumer.id,
            name: champs.name,
            email: champs.email,
            phone: champs.phone,
            password: champs.password || null,
         }),
      );
      setSuccess("Profil mis a jour");
      setChamps((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      navigate("/admin/abonnees");
   }

   if (!consumer)
      return (
         <div className="min-h-[calc(100vh-8rem)] bg-background px-4 py-10">
            <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-6 shadow-sm">
               <h1 className="text-xl font-semibold text-foreground">
                  Aucun abonné trouvé
               </h1>
               <p className="mt-2 text-sm text-muted-foreground">
                  Revenez a la liste des abonnés pour selectionner un compte.
               </p>
               <button
                  onClick={() => navigate("/admin/abonnees")}
                  className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
               >
                  Retour a la liste
               </button>
            </div>
         </div>
      );

   const errorMessage =
      error?.message || (typeof error === "string" ? error : null);

   return (
      <div className="min-h-[calc(100vh-8rem)] bg-background px-4 py-8">
         <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-5">
               <h1 className="text-2xl font-bold text-foreground">
                  Modifier abonné
               </h1>
               <p className="text-sm text-muted-foreground">
                  Mise a jour des informations du compte.
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
               {errorMessage && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-2">
                     <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                     <p className="text-sm text-red-600 font-medium">
                        {errorMessage}
                     </p>
                  </div>
               )}

               {success && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 flex items-start gap-2">
                     <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                     <p className="text-sm text-emerald-700 font-medium">
                        {success}
                     </p>
                  </div>
               )}

               <div className="overflow-x-auto">
                  <table className="w-full border-separate border-spacing-0">
                     <tbody className="text-sm">
                        <tr className="align-top">
                           <th className="w-1/3 px-3 py-3 text-left font-medium text-foreground">
                              Nom complet
                           </th>
                           <td className="px-3 py-3">
                              <div className="relative">
                                 <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                 <input
                                    name="name"
                                    value={champs.name}
                                    onChange={handleChange}
                                    className={`h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                       validationErrors.name
                                          ? "border-red-300"
                                          : "border-border"
                                    }`}
                                 />
                              </div>
                              {validationErrors.name && (
                                 <p className="mt-1 text-xs text-red-600">
                                    {validationErrors.name}
                                 </p>
                              )}
                           </td>
                        </tr>

                        <tr className="align-top border-t border-border">
                           <th className="w-1/3 px-3 py-3 text-left font-medium text-foreground">
                              Adresse e-mail
                           </th>
                           <td className="px-3 py-3">
                              <div className="relative">
                                 <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                 <input
                                    name="email"
                                    value={champs.email}
                                    onChange={handleChange}
                                    className={`h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                       validationErrors.email
                                          ? "border-red-300"
                                          : "border-border"
                                    }`}
                                 />
                              </div>
                              {validationErrors.email && (
                                 <p className="mt-1 text-xs text-red-600">
                                    {validationErrors.email}
                                 </p>
                              )}
                           </td>
                        </tr>

                        <tr className="align-top border-t border-border">
                           <th className="w-1/3 px-3 py-3 text-left font-medium text-foreground">
                              Telephone
                           </th>
                           <td className="px-3 py-3">
                              <div className="relative">
                                 <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                 <input
                                    name="phone"
                                    value={champs.phone}
                                    onChange={handleChange}
                                    className={`h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                       validationErrors.phone
                                          ? "border-red-300"
                                          : "border-border"
                                    }`}
                                 />
                              </div>
                              {validationErrors.phone && (
                                 <p className="mt-1 text-xs text-red-600">
                                    {validationErrors.phone}
                                 </p>
                              )}
                           </td>
                        </tr>

                        <tr className="align-top border-t border-border">
                           <th className="w-1/3 px-3 py-3 text-left font-medium text-foreground">
                              Mot de passe (optionnel)
                           </th>
                           <td className="px-3 py-3">
                              <div className="relative">
                                 <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                 <input
                                    name="password"
                                    type="password"
                                    value={champs.password}
                                    onChange={handleChange}
                                    className={`h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                       validationErrors.password
                                          ? "border-red-300"
                                          : "border-border"
                                    }`}
                                 />
                              </div>
                              {validationErrors.password && (
                                 <p className="mt-1 text-xs text-red-600">
                                    {validationErrors.password}
                                 </p>
                              )}
                           </td>
                        </tr>

                        <tr className="align-top border-t border-border">
                           <th className="w-1/3 px-3 py-3 text-left font-medium text-foreground">
                              Confirmer le mot de passe
                           </th>
                           <td className="px-3 py-3">
                              <div className="relative">
                                 <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                 <input
                                    name="confirmPassword"
                                    type="password"
                                    value={champs.confirmPassword}
                                    onChange={handleChange}
                                    className={`h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                       validationErrors.confirmPassword
                                          ? "border-red-300"
                                          : "border-border"
                                    }`}
                                 />
                              </div>
                              {validationErrors.confirmPassword && (
                                 <p className="mt-1 text-xs text-red-600">
                                    {validationErrors.confirmPassword}
                                 </p>
                              )}
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>

               <div className="flex flex-wrap items-center gap-3">
                  <button
                     type="submit"
                     className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                  >
                     Enregistrer
                  </button>
                  <button
                     type="button"
                     onClick={() => navigate(-1)}
                     className="inline-flex items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                  >
                     Annuler
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}

export default UpdateConsumer;
