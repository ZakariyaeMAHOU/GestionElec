import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

const Footer = () => {
   const footerLinks = [
      { to: "/about", label: "À propos" },
      { to: "/contact", label: "Contact" },
      { to: "/privacy", label: "Politique de confidentialité" },
      { to: "/terms", label: "Conditions d'utilisation" },
   ];

   return (
      <footer className="border-t border-border bg-card bg-gray-100">
         <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
               <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                     <img
                        src={logo}
                        alt="Gestion-Elec logo"
                        className="h-6 w-6"
                     />
                  </div>
                  <span className="text-sm text-muted-foreground">
                     © 2026 Gestion-Elec. Tous droits réservés.
                  </span>
               </div>

               <div className="flex flex-wrap items-center justify-center gap-6">
                  {footerLinks.map((link) => (
                     <Link
                        key={link.to}
                        to={link.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                     >
                        {link.label}
                     </Link>
                  ))}
               </div>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
