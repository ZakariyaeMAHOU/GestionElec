import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateProfile, clearError } from "../features/elecSlice";
import { User, Mail, Phone, LogOut, Lock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

function Profile() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { user, users, error } = useSelector((state) => state.elec);

   const [updateMode, setUpdateMode] = useState(false);
   const [champs, setChamps] = useState({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
      confirmPassword: "",
   });

   const [validationErrors, setValidationErrors] = useState({});
   const [success, setSuccess] = useState("");

   useEffect(() => {
      if (user) {
         setChamps({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            password: "",
            confirmPassword: "",
         });
      }
   }, [user]);

   function handleChange(e) {
      const { name, value } = e.target;
      setChamps({ ...champs, [name]: value });

      if (error) dispatch(clearError());
      setSuccess("");

      setValidationErrors((prev) => {
         const copy = { ...prev };
         delete copy[name];
         return copy;
      });
   }

   function handleUpdate(e) {
      e.preventDefault();

      if (!updateMode) {
         setUpdateMode(true);
         return;
      }

      const errs = {};
      if (!champs.name.trim()) errs.name = "Nom obligatoire";

      if (!champs.email.trim()) errs.email = "Email obligatoire";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champs.email))
         errs.email = "Format email invalide";

      if (!champs.phone.trim()) errs.phone = "Numero de telephone obligatoire";
      else if (!/^[0-9]{10}$/.test(champs.phone))
         errs.phone = "Le numero de telephone doit avoir 10 chiffres";

      if (!champs.password) errs.password = "Mot de passe obligatoire";
      else if (champs.password.length < 6)
         errs.password = "Mot de passe minimum 6 caracteres";

      if (!champs.confirmPassword)
         errs.confirmPassword = "Confirmation du mot de passe obligatoire";
      else if (champs.password !== champs.confirmPassword)
         errs.confirmPassword = "Les mots de passe ne correspondent pas";

      const emailExists = users?.some(
         (u) => u.email === champs.email && u.id !== user.id,
      );
      const phoneExists = users?.some(
         (u) => u.phone === champs.phone && u.id !== user.id,
      );

      if (emailExists) errs.email = "Email deja utilise";
      if (phoneExists) errs.phone = "Numero de telephone deja utilise";

      if (Object.keys(errs).length) {
         setValidationErrors(errs);
         return;
      }

      dispatch(clearError());
      dispatch(updateProfile({ id: user.id, ...champs }));
      setSuccess("Profil mis à jour avec succès");
      setUpdateMode(false);
   }

   async function handleLogout(e) {
      e.preventDefault();
      await dispatch(logout());
      navigate("/");
   }

   const errorMessage =
      error?.message || (typeof error === "string" ? error : null);

   return (
      <div className="container mx-auto px-4 py-8">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
            <p className="text-gray-500">Voir vos informations personnelles</p>
         </div>

         <div className="mx-auto max-w-2xl rounded-lg border bg-white shadow-sm">
            <div className="p-6 border-b flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                     <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                     <h2 className="text-xl font-bold">{user?.name}</h2>
                     <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
               </div>

               <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-md bg-red-600 text-white px-4 py-2 hover:bg-red-700"
               >
                  <LogOut className="h-4 w-4" />
                  Se déconnecter
               </button>
            </div>

            <div className="p-6">
               <form className="space-y-6">
                  {errorMessage && (
                     <div className="rounded-lg border border-red-300 bg-red-50 p-3 flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <p className="text-sm text-red-600 font-medium">
                           {errorMessage}
                        </p>
                     </div>
                  )}

                  {success && (
                     <div className="rounded-lg border border-green-300 bg-green-50 p-3">
                        <p className="text-sm text-green-600 font-medium">
                           {success}
                        </p>
                     </div>
                  )}

                  {/* Name */}
                  <div>
                     <label className="text-sm font-medium">Nom complet</label>
                     <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                           name="name"
                           value={champs.name}
                           onChange={handleChange}
                           readOnly={user.role === "consumer" || !updateMode}
                           className={`flex h-10 w-full rounded-md border px-3 py-2 pl-10 focus:ring-2 ${
                              validationErrors.name
                                 ? "border-red-600 focus:ring-red-600"
                                 : updateMode
                                   ? "focus:ring-blue-600"
                                   : "bg-gray-100 cursor-not-allowed"
                           }`}
                        />
                     </div>
                     {validationErrors.name && (
                        <p className="text-xs text-red-600 mt-1">
                           {validationErrors.name}
                        </p>
                     )}
                  </div>

                  {/* Email */}
                  <div>
                     <label className="text-sm font-medium">
                        Adresse e-mail
                     </label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                           name="email"
                           value={champs.email}
                           onChange={handleChange}
                           readOnly={!updateMode}
                           className={`flex h-10 w-full rounded-md border px-3 py-2 pl-10 focus:ring-2 ${
                              validationErrors.email
                                 ? "border-red-600 focus:ring-red-600"
                                 : updateMode
                                   ? "focus:ring-blue-600"
                                   : "bg-gray-100 cursor-not-allowed"
                           }`}
                        />
                     </div>
                     {validationErrors.email && (
                        <p className="text-xs text-red-600 mt-1">
                           {validationErrors.email}
                        </p>
                     )}
                  </div>

                  {/* Phone */}
                  <div>
                     <label className="text-sm font-medium">
                        Numéro de téléphone
                     </label>
                     <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                           name="phone"
                           value={champs.phone}
                           onChange={handleChange}
                           readOnly={!updateMode}
                           className={`flex h-10 w-full rounded-md border px-3 py-2 pl-10 focus:ring-2 ${
                              validationErrors.phone
                                 ? "border-red-600 focus:ring-red-600"
                                 : updateMode
                                   ? "focus:ring-blue-600"
                                   : "bg-gray-100 cursor-not-allowed"
                           }`}
                        />
                     </div>
                     {validationErrors.phone && (
                        <p className="text-xs text-red-600 mt-1">
                           {validationErrors.phone}
                        </p>
                     )}
                  </div>

                  {/* Passwords */}
                  {updateMode && (
                     <>
                        <div>
                           <label className="text-sm font-medium">
                              Mot de passe
                           </label>
                           <div className="relative">
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                              <input
                                 name="password"
                                 type="password"
                                 value={champs.password}
                                 onChange={handleChange}
                                 className={`flex h-10 w-full rounded-md border px-3 py-2 pl-10 focus:ring-2 ${
                                    validationErrors.password
                                       ? "border-red-600 focus:ring-red-600"
                                       : "focus:ring-blue-600"
                                 }`}
                              />
                           </div>
                           {validationErrors.password && (
                              <p className="text-xs text-red-600 mt-1">
                                 {validationErrors.password}
                              </p>
                           )}
                        </div>

                        <div>
                           <label className="text-sm font-medium">
                              Confirmer le mot de passe
                           </label>
                           <div className="relative">
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                              <input
                                 name="confirmPassword"
                                 type="password"
                                 value={champs.confirmPassword}
                                 onChange={handleChange}
                                 className={`flex h-10 w-full rounded-md border px-3 py-2 pl-10 focus:ring-2 ${
                                    validationErrors.confirmPassword
                                       ? "border-red-600 focus:ring-red-600"
                                       : "focus:ring-blue-600"
                                 }`}
                              />
                           </div>
                           {validationErrors.confirmPassword && (
                              <p className="text-xs text-red-600 mt-1">
                                 {validationErrors.confirmPassword}
                              </p>
                           )}
                        </div>
                     </>
                  )}

                  <button
                     type="button"
                     onClick={handleUpdate}
                     className="w-full rounded-md bg-primary text-white px-4 py-2 font-medium hover:bg-white hover:text-primary border border-primary"
                  >
                     {updateMode
                        ? "Enregistrer les modifications"
                        : "Mettre à jour les informations"}
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
}

export default Profile;
