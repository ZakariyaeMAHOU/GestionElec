import { Check, X } from "lucide-react";

function Subscription({ subscription, onShowConsumption, onCancel }) {
   if (!subscription) return null;
   const isPending = subscription.status === "pending";
   const getStatusLabel = (status) => {
      if (status === "active") return "Actif";
      if (status === "pending") return "En attente";
      if (status === "rejected") return "Refuse";
      return "N/D";
   };
   return (
      <div className="relative rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg p-6">
         {/* Badge */}
         <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span
               className={`px-3 py-1 rounded-full text-xs font-medium ${
                  subscription.status === "active"
                     ? "bg-green-600 text-white"
                     : subscription.status === "pending"
                       ? "bg-yellow-500 text-white"
                       : "bg-gray-400 text-white"
               }`}
            >
               {getStatusLabel(subscription.status)}
            </span>
         </div>

         {/* Header */}
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
               {subscription.type || "Abonnement"}
            </h2>
            <div
               className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  subscription.status === "active"
                     ? "bg-green-100 text-green-600"
                     : "bg-gray-200 text-gray-500"
               }`}
            >
               {subscription.status === "active" ? (
                  <Check className="h-5 w-5" />
               ) : (
                  <X className="h-5 w-5" />
               )}
            </div>
         </div>

         {/* Description */}
         <div className="text-sm text-gray-500 space-y-1">
            <span className="block">
               Début: {subscription.start_date || "N/D"}
            </span>
            <span className="block">Fin: {subscription.end_date || "N/D"}</span>
         </div>

         {/* Button */}
         <div className="mt-4 space-y-2">
            <button
               onClick={() =>
                  onShowConsumption && onShowConsumption(subscription.id)
               }
               className="w-full border rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100"
            >
               Voir les consommations
            </button>
            {isPending && (
               <button
                  onClick={() => onCancel && onCancel(subscription.id)}
                  className="w-full border border-red-200 bg-red-50 rounded-md px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
               >
                  Annuler la demande
               </button>
            )}
         </div>
      </div>
   );
}

export default Subscription;
