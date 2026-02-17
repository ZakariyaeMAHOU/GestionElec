import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, clearError, logout } from "../../features/elecSlice";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/logo.svg";
import { Mail, Lock, User, Phone, Loader2, AlertCircle } from "lucide-react";

const Register = () => {
   const [champs, setChamps] = useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
   });

   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { error, currentUser, users, isLoading } = useSelector(
      (state) => state.elec,
   );
   const [validationErrors, setValidationErrors] = useState({});

   useEffect(() => {
      if (currentUser) navigate("/tableau-de-bord");
   }, [currentUser, navigate]);

   useEffect(() => {
      return () => {
         dispatch(clearError());
      };
   }, [dispatch]);

   function handleChange(e) {
      setChamps({ ...champs, [e.target.name]: e.target.value });
      if (error) dispatch(clearError());
      setValidationErrors((prev) => {
         const copy = { ...prev };
         delete copy[e.target.name];
         return copy;
      });
   }

   const handleSubmit = async (e) => {
      e.preventDefault();

      const errs = {};
      if (!champs.name.trim()) errs.name = "Nom obligatoire";
      if (!champs.email.trim()) errs.email = "Email obligatoire";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champs.email))
         errs.email = "Format email invalide";
      if (!champs.phone.trim()) errs.phone = "Numero de telephone obligatoire";
      else if (!/^[0-9]{10}$/.test(champs.phone))
         errs.phone = "Le numero de telephone doit avoir 10 chiffres";
      if (!champs.password || champs.password.length < 6)
         errs.password = "Mot de passe minimum 6 caracteres";
      if (champs.password !== champs.confirmPassword)
         errs.confirmPassword = "Les mots de passe ne correspondent pas";

      const emailExists = users.some((u) => u.email === champs.email);
      const phoneExists = users.some((u) => u.phone === champs.phone);
      if (emailExists) errs.email = "Email deja utilise";
      if (phoneExists) errs.phone = "Numero de telephone deja utilise";

      if (Object.keys(errs).length) {
         setValidationErrors(errs);
         return;
      }

      dispatch(clearError());
      const result = await dispatch(register(champs));

      if (result.type === "elec/register") {
         dispatch(logout());
         navigate("/connexion", {
            state: { success: "Compte cree avec succes" },
         });
      }
   };

   const errorMessage =
      error?.message || (typeof error === "string" ? error : null);

   return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
         {/* Card */}
         <div className="w-full max-w-md rounded-lg border bg-white shadow animate-scale-in">
            {/* Header */}
            <div className="text-center p-6">
               <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                  <img
                     src={logo}
                     alt="Gestion-Elec logo"
                     className="h-10 w-10"
                  />
               </div>
               <h2 className="text-2xl font-semibold">Creer un compte</h2>
               <p className="text-sm text-gray-500">
                  Rejoignez Gestion-Elec pour gerer votre energie
               </p>
            </div>

            {/* Content */}
            <div className="p-6 pt-0">
               <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                     <div className="rounded-lg border border-red-300 bg-red-50 p-3 flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-600 font-medium">
                           {errorMessage}
                        </p>
                     </div>
                  )}

                  {/* Full Name */}
                  <div className="space-y-2">
                     <label
                        htmlFor="name"
                        className={`text-sm font-medium ${validationErrors.name ? "text-red-600" : ""}`}
                     >
                        Nom complet
                     </label>
                     <div className="relative">
                        <User
                           className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${validationErrors.name ? "text-red-600" : "text-gray-400"}`}
                        />
                        <input
                           id="name"
                           name="name"
                           type="text"
                           placeholder="Jean Dupont"
                           value={champs.name}
                           onChange={handleChange}
                           className={`flex h-10 w-full rounded-md border px-3 py-2 pl-10 focus:outline-none focus:ring-2 ${validationErrors.name ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-primary"}`}
                        />
                        {validationErrors.name && (
                           <p className="text-xs text-red-600 mt-1">
                              {validationErrors.name}
                           </p>
                        )}
                     </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                     <label
                        htmlFor="email"
                        className={`text-sm font-medium ${validationErrors.email ? "text-red-600" : ""}`}
                     >
                        Adresse e-mail
                     </label>
                     <div className="relative">
                        <Mail
                           className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${validationErrors.email ? "text-red-600" : "text-gray-400"}`}
                        />
                        <input
                           id="email"
                           name="email"
                           type="email"
                           placeholder="exemple@email.com"
                           value={champs.email}
                           onChange={handleChange}
                           className={`flex h-10 w-full rounded-md border px-3 py-2 pl-10 focus:outline-none focus:ring-2 ${validationErrors.email ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-primary"}`}
                        />
                        {validationErrors.email && (
                           <p className="text-xs text-red-600 mt-1">
                              {validationErrors.email}
                           </p>
                        )}
                     </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                     <label
                        htmlFor="phone"
                        className={`text-sm font-medium ${validationErrors.phone ? "text-red-600" : ""}`}
                     >
                        Numero de telephone
                     </label>
                     <div className="relative">
                        <Phone
                           className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${validationErrors.phone ? "text-red-600" : "text-gray-400"}`}
                        />
                        <input
                           id="phone"
                           name="phone"
                           type="tel"
                           placeholder="0612345678"
                           value={champs.phone}
                           onChange={handleChange}
                           className={`flex h-10 w-full rounded-md border px-3 py-2 pl-10 focus:outline-none focus:ring-2 ${validationErrors.phone ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-primary"}`}
                        />
                        {validationErrors.phone && (
                           <p className="text-xs text-red-600 mt-1">
                              {validationErrors.phone}
                           </p>
                        )}
                     </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                     <label
                        htmlFor="password"
                        className={`text-sm font-medium ${validationErrors.password ? "text-red-600" : ""}`}
                     >
                        Mot de passe
                     </label>
                     <div className="relative">
                        <Lock
                           className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${validationErrors.password ? "text-red-600" : "text-gray-400"}`}
                        />
                        <input
                           id="password"
                           name="password"
                           type="password"
                           placeholder="••••••••"
                           value={champs.password}
                           onChange={handleChange}
                           className={`flex h-10 w-full rounded-md border px-3 py-2 pl-10 focus:outline-none focus:ring-2 ${validationErrors.password ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-primary"}`}
                        />
                        {validationErrors.password && (
                           <p className="text-xs text-red-600 mt-1">
                              {validationErrors.password}
                           </p>
                        )}
                     </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                     <label
                        htmlFor="confirmPassword"
                        className={`text-sm font-medium ${validationErrors.confirmPassword ? "text-red-600" : ""}`}
                     >
                        Confirmer le mot de passe
                     </label>
                     <div className="relative">
                        <Lock
                           className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                              validationErrors.confirmPassword
                                 ? "text-red-600"
                                 : "text-gray-400"
                           }`}
                        />
                        <input
                           id="confirmPassword"
                           name="confirmPassword"
                           type="password"
                           placeholder="••••••••"
                           value={champs.confirmPassword}
                           onChange={handleChange}
                           className={`flex h-10 w-full rounded-md border px-3 py-2 pl-10 focus:outline-none focus:ring-2 ${
                              validationErrors.confirmPassword
                                 ? "border-red-600 focus:ring-red-600"
                                 : "border-gray-300 focus:ring-primary"
                           }`}
                        />
                        {validationErrors.confirmPassword && (
                           <p className="text-xs text-red-600 mt-1">
                              {validationErrors.confirmPassword}
                           </p>
                        )}
                     </div>
                  </div>

                  {/* Submit Button */}
                  <button
                     type="submit"
                     disabled={isLoading}
                     className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90 disabled:opacity-50 w-full"
                  >
                     {isLoading ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Creation du compte...
                        </>
                     ) : (
                        "Creer un compte"
                     )}
                  </button>
               </form>

               {/* Footer */}
               <div className="mt-6 text-center text-sm text-gray-500">
                  Deja un compte ?{" "}
                  <Link
                     to="/connexion"
                     className="font-medium text-primary hover:underline"
                  >
                     Se connecter
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Register;
