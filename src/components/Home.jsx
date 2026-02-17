import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import heroBg from "../assets/hero-bg.jpg";
import { Zap, BarChart3, FileText, Shield, ArrowRight } from "lucide-react";

function Home() {
   const user = useSelector((state) => state.elec.user);

   const features = [
      {
         icon: BarChart3,
         title: "Suivre la consommation",
         description:
            "Surveillez votre consommation d'électricité avec des graphiques détaillés.",
      },
      {
         icon: FileText,
         title: "Gérer les factures",
         description:
            "Consultez, téléchargez et suivez toutes vos factures en un seul endroit.",
      },
      {
         icon: Shield,
         title: "Sécurisé & Fiable",
         description:
            "Vos données sont protégées avec une sécurité de niveau entreprise.",
      },
   ];

   return (
      <div className="flex flex-col">
         {/* Hero Section */}
         <section className="relative overflow-hidden py-20 lg:py-32">
            <div
               className="absolute inset-0 bg-cover bg-center"
               style={{ backgroundImage: `url(${heroBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60" />
            <div className="container relative mx-auto px-4">
               <div className="mx-auto max-w-3xl text-center">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground">
                     <Zap className="h-4 w-4" />
                     Gestion énergétique intelligente
                  </div>
                  <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
                     Prenez le contrôle de votre consommation électrique
                  </h1>
                  <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
                     Surveillez votre consommation, gérez vos factures et
                     optimisez votre consommation d'énergie avec notre tableau
                     de bord convivial. Commencez à économiser dès aujourd'hui.
                  </p>
                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                     {!user ? (
                        <>
                           <Link to="/inscription">
                              <button className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-lg font-medium text-white hover:bg-primary/90">
                                 Commencer <ArrowRight className="h-4 w-4" />
                              </button>
                           </Link>
                           <Link to="/connexion">
                              <button className="inline-flex items-center rounded-md border border-primary-foreground/30 bg-transparent px-6 py-3 text-lg font-medium text-primary-foreground hover:bg-white hover:text-primary border border-primary">
                                 Se connecter
                              </button>
                           </Link>
                        </>
                     ) : (
                        <Link
                           to={
                              user.role === "admin"
                                 ? "/admin/tableau-de-bord"
                                 : "/tableau-de-bord"
                           }
                        >
                           <button className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-lg font-medium text-white hover:bg-white hover:text-primary border border-primary">
                              Aller au tableau de bord{" "}
                              <ArrowRight className="h-4 w-4" />
                           </button>
                        </Link>
                     )}
                  </div>
               </div>
            </div>
         </section>

         {/* Features Section */}
         <section className="py-20">
            <div className="container mx-auto px-4">
               <div className="mb-12 text-center">
                  <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                     Pourquoi choisir Gestion-Elec ?
                  </h2>
                  <p className="mx-auto max-w-2xl text-muted-foreground">
                     Notre plateforme fournit tout ce dont vous avez besoin pour
                     gérer votre consommation électrique de manière efficace.
                  </p>
               </div>
               <div className="grid gap-8 md:grid-cols-3">
                  {features.map((feature) => (
                     <div
                        key={feature.title}
                        className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg"
                     >
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                           <feature.icon className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-foreground">
                           {feature.title}
                        </h3>
                        <p className="text-muted-foreground">
                           {feature.description}
                        </p>
                     </div>
                  ))}
               </div>
            </div>
         </section>
      </div>
   );
}

export default Home;
