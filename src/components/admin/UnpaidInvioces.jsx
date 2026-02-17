import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateInvoiceStatus } from "../../features/elecSlice";
import { ArrowLeft, Check } from "lucide-react";

function UnpaidInvioces() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const users = useSelector((state) => state.elec.users);

   // Get all consumptions with unpaid invoices
   const unpaidConsumptions = useMemo(() => {
      const result = [];
      users.forEach((user) => {
         user.subscriptions?.forEach((sub) => {
            sub.consumptions?.forEach((consumption) => {
               if (
                  consumption.invoice &&
                  consumption.invoice.status === "unpaid"
               ) {
                  result.push({
                     userId: user.id,
                     userName: user.name,
                     subscriptionId: sub.id,
                     subscriptionName: sub.type,
                     consumption,
                  });
               }
            });
         });
      });
      return result;
   }, [users]);

   const handleMarkAsPaid = (
      userId,
      subscriptionId,
      consumptionId,
      invoiceId,
   ) => {
      const confirmed = window.confirm("Marquer cette facture comme payée ?");
      if (confirmed) {
         dispatch(
            updateInvoiceStatus({
               userId,
               subscriptionId,
               consumptionId,
               invoiceId,
               status: "paid",
            }),
         );
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
         {/* Header with back button */}
         <div className="mb-8 flex items-center justify-between">
            <div>
               <h1 className="text-4xl font-bold text-slate-900">
                  Factures impayées
               </h1>
               <p className="mt-2 text-slate-600">
                  Total: {unpaidConsumptions.length} facture
                  {unpaidConsumptions.length !== 1 ? "s" : ""}
               </p>
            </div>
            <button
               onClick={() => navigate("/admin/tableau-de-bord")}
               className="flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 transition-all hover:bg-slate-300"
            >
               <ArrowLeft className="h-5 w-5" />
               Retour
            </button>
         </div>

         {/* Consumptions List */}
         {unpaidConsumptions.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-12 text-center">
               <p className="text-slate-600">Aucune facture impayée</p>
            </div>
         ) : (
            <div className="grid gap-4">
               {unpaidConsumptions.map((item) => (
                  <div
                     key={`${item.userId}-${item.subscriptionId}-${item.consumption.id}`}
                     className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                  >
                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Consumer & Subscription Info */}
                        <div className="space-y-2">
                           <p className="text-sm text-slate-600">
                              Consommateur
                           </p>
                           <p className="text-lg font-semibold text-slate-900">
                              {item.userName}
                           </p>
                           <p className="text-sm text-slate-600">Abonnement</p>
                           <p className="text-lg font-semibold text-slate-900">
                              {item.subscriptionName}
                           </p>
                        </div>

                        {/* Consumption Details */}
                        <div className="space-y-2">
                           <p className="text-sm text-slate-600">
                              Mois de consommation
                           </p>
                           <p className="text-lg font-semibold text-slate-900">
                              {item.consumption.month}
                           </p>
                           <p className="text-sm text-slate-600">
                              Consommation (kWh)
                           </p>
                           <p className="text-xl font-bold text-blue-600">
                              {item.consumption.kwh}
                           </p>
                        </div>
                     </div>

                     {/* Invoice Details */}
                     <div className="mt-6 border-t border-slate-200 pt-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                           <div>
                              <p className="text-sm text-slate-600">Montant</p>
                              <p className="text-2xl font-bold text-slate-900">
                                 {item.consumption.invoice.amount} DH
                              </p>
                           </div>
                           <div>
                              <p className="text-sm text-slate-600">Statut</p>
                              <p className="mt-1 inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                                 Impayée
                              </p>
                           </div>
                           <div>
                              <p className="text-sm text-slate-600">
                                 Date de création
                              </p>
                              <p className="text-slate-900">
                                 {item.consumption.invoice.created_at}
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* Action Button */}
                     <div className="mt-6 flex justify-end">
                        <button
                           onClick={() =>
                              handleMarkAsPaid(
                                 item.userId,
                                 item.subscriptionId,
                                 item.consumption.id,
                                 item.consumption.invoice.id,
                              )
                           }
                           className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2 font-semibold text-white transition-all hover:bg-green-600"
                        >
                           <Check className="h-5 w-5" />
                           Marquer comme payée
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

export default UnpaidInvioces;
