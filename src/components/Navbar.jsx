import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/elecSlice";
import { useState } from "react";
// Logo
import logo from "../assets/logo.svg";
// Icons
import { Menu, X, User } from "lucide-react";

function Navbar() {
   const user = useSelector((state) => state.elec.user);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

   const handleLogout = async () => {
      await dispatch(logout());
      navigate("/");
   };

   const consumerLinks = [
      { to: "/tableau-de-bord", label: "Tableau de bord" },
      { to: "/abonnements", label: "Abonnements" },
   ];

   const adminLinks = [
      { to: "/admin/tableau-de-bord", label: "Tableau de bord" },
      { to: "/admin/abonnees", label: "Liste des Abonnés" },
   ];

   const links = user?.role === "consumer" ? consumerLinks : adminLinks;
   const displayName = user?.name;

   return (
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
         <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
               <Link
                  to={user?.role === "admin" ? "/admin/tableau-de-bord" : "/"}
                  className="flex items-center gap-2"
               >
                  <img
                     src={logo}
                     alt="Gestion-Elec logo"
                     className="h-10 w-10"
                  />
                  <span className="text-xl font-bold text-gray-900">
                     Gestion Élec
                  </span>
               </Link>

               {/* Desktop Links */}
               <div className="hidden items-center gap-6 md:flex">
                  <Link to="/">
                     <button className="text-gray-600 hover:text-primary text-sm font-medium">
                        Accueil
                     </button>
                  </Link>
                  {user &&
                     links.map((link) => (
                        <Link key={link.to} to={link.to}>
                           <button className="text-gray-600 hover:text-primary text-sm font-medium">
                              {link.label}
                           </button>
                        </Link>
                     ))}
               </div>

               {/* Desktop Auth */}
               <div className="hidden items-center gap-4 md:flex">
                  {user ? (
                     <>
                        <span className="text-sm text-gray-500">
                           Bienvenue,{" "}
                           <span className="font-medium text-gray-900">
                              {displayName}
                           </span>
                        </span>
                        <button
                           onClick={() =>
                              navigate({
                                 pathname:
                                    user.role === "admin"
                                       ? "/admin/profil"
                                       : "/profil",
                              })
                           }
                           className="flex items-center justify-center rounded-full p-2 hover:bg-gray-100"
                        >
                           <User className="h-6 w-6 text-gray-700" />
                        </button>
                     </>
                  ) : (
                     <>
                        <Link to="/connexion">
                           <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">
                              Se connecter
                           </button>
                        </Link>
                        <Link to="/inscription">
                           <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">
                              S'inscrire
                           </button>
                        </Link>
                     </>
                  )}
               </div>

               {/* Mobile Menu Button */}
               <button
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               >
                  {mobileMenuOpen ? (
                     <X className="h-6 w-6 text-gray-700" />
                  ) : (
                     <Menu className="h-6 w-6 text-gray-700" />
                  )}
               </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
               <div className="border-t border-gray-200 py-4 md:hidden">
                  <div className="flex flex-col gap-4">
                     {user &&
                        links.map((link) => (
                           <Link
                              key={link.to}
                              to={link.to}
                              className="text-sm font-medium text-gray-600 hover:text-primary"
                              onClick={() => setMobileMenuOpen(false)}
                           >
                              {link.label}
                           </Link>
                        ))}
                     <div className="border-t border-gray-200 pt-4">
                        {user ? (
                           <div className="flex flex-col gap-2">
                              <button
                                 onClick={() => {
                                    navigate("/profil");
                                    setMobileMenuOpen(false);
                                 }}
                                 className="w-full flex items-center justify-center gap-2 border rounded-md px-3 py-2 hover:bg-gray-100"
                              >
                                 <User className="h-4 w-4" />
                                 Profil
                              </button>
                              <button
                                 onClick={handleLogout}
                                 className="w-full border rounded-md px-3 py-2 hover:bg-gray-100"
                              >
                                 Se déconnecter
                              </button>
                           </div>
                        ) : (
                           <div className="flex flex-col gap-2">
                              <Link
                                 to="/connexion"
                                 onClick={() => setMobileMenuOpen(false)}
                              >
                                 <button className="w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                                    Se connecter
                                 </button>
                              </Link>
                              <Link
                                 to="/inscription"
                                 onClick={() => setMobileMenuOpen(false)}
                              >
                                 <button className="w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                                    S'inscrire
                                 </button>
                              </Link>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            )}
         </div>
      </nav>
   );
}

export default Navbar;
