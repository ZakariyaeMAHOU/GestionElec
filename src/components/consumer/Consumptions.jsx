import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";
import Consumption from "./Consumption";

function Consumptions() {
   const { subscriptionId } = useParams();
   const navigate = useNavigate();

   const { user, error } = useSelector((state) => state.elec);

   const subscription = (user?.subscriptions || []).find(
      (s) => String(s.id) === String(subscriptionId),
   );
   const consumptions = subscription?.consumptions || [];

   if (error) {
      return (
         <div className="container mx-auto px-4 py-8">
            <div className="rounded-lg border bg-white shadow-sm p-12 text-center">
               <p className="text-red-500">Erreur: {error}</p>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8">
         {/* Header */}
         <div className="mb-8 flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-gray-900">
                  Consommations de l’abonnement : {subscription?.type}
               </h1>
               <p className="text-gray-500">
                  Historique des consommations mensuelles
               </p>
            </div>
            <button
               onClick={() => navigate("/abonnements")}
               className="flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-100"
            >
               <ArrowLeft className="mr-2 h-4 w-4" />
               Retour
            </button>
         </div>

         {/* Content */}
         {consumptions.length === 0 ? (
            <div className="rounded-lg border bg-white shadow-sm p-12 text-center">
               <FileText className="mb-4 h-12 w-12 text-gray-400 mx-auto" />
               <p className="text-gray-500">Aucune consommation trouvée</p>
            </div>
         ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {consumptions.map((c) => (
                  <Consumption key={c.id} c={c} />
               ))}
            </div>
         )}
      </div>
   );
}

export default Consumptions;
