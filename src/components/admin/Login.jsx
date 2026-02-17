import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin, clearError } from "../../features/elecSlice";
import logo from "../../assets/logo.svg";
import { Mail, Lock, AlertCircle } from "lucide-react";

function Login() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { user, error } = useSelector((state) => state.elec);
   const [roleError, setRoleError] = useState(null);

   const [champs, setChamps] = useState({
      email: "",
      password: "",
   });

   useEffect(() => {
      if (user) {
         if (user.role === "admin") {
            navigate("/admin/tableau-de-bord");
         } else if (user.role === "consumer") {
            setRoleError("Vous n'avez pas acces a l'espace admin.");
         }
      }
   }, [user, navigate]);

   useEffect(() => {
      return () => {
         dispatch(clearError());
      };
   }, [dispatch]);

   function handleChange(e) {
      setChamps({ ...champs, [e.target.name]: e.target.value });
      if (error) dispatch(clearError());
      if (roleError) setRoleError(null);
   }

   const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(clearError());
      if (roleError) setRoleError(null);
      dispatch(loginAdmin(champs));
   };

   const errorMessage =
      error?.error ||
      error?.message ||
      (typeof error === "string" ? error : null);

   const displayError = roleError || errorMessage;

   return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
         <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-md">
            <div className="text-center mb-6">
               <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                  <img
                     src={logo}
                     alt="Gestion-Elec logo"
                     className="h-10 w-10"
                  />
               </div>
               <h2 className="text-2xl font-bold">Espace Admin</h2>
               <p className="text-muted-foreground">
                  Connectez-vous à votre compte administrateur
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               {displayError && (
                  <div className="rounded-lg border border-red-300 bg-red-50 p-3 flex items-start gap-2">
                     <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                     <p className="text-sm text-red-600 font-medium">
                        {displayError}
                     </p>
                  </div>
               )}

               <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                     Adresse e-mail
                  </label>
                  <div className="relative">
                     <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                     <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="admin@gmail.com"
                        value={champs.email}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                     Mot de passe
                  </label>
                  <div className="relative">
                     <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                     <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="12345678"
                        value={champs.password}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                     />
                  </div>
               </div>

               <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90 disabled:opacity-50"
               >
                  Se connecter
               </button>
            </form>

            <div className="mt-4 text-center">
               <Link
                  to="/connexion"
                  className="text-xs text-muted-foreground hover:text-primary"
               >
                  Connexion abonné →
               </Link>
            </div>
         </div>
      </div>
   );
}

export default Login;
