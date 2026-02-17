import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
   Calendar,
   DollarSign,
   ArrowLeft,
   FileText,
   CheckCircle,
} from "lucide-react";
import { updateInvoiceStatus } from "../../features/elecSlice";

function Consumptions() {
   const { consumerId, subscriptionId } = useParams();
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const users = useSelector((state) => state.elec.users);

   const consumer = users.find((u) => String(u.id) === String(consumerId));
   const subscription = consumer?.subscriptions?.find(
      (s) => String(s.id) === String(subscriptionId),
   );
   const consumptions = subscription?.consumptions || [];

   const handleMarkAsPaid = (consumptionId, invoiceId) => {
      if (!window.confirm("Confirmer le paiement de cette facture ?")) return;
      dispatch(
         updateInvoiceStatus({
            userId: consumerId,
            subscriptionId,
            consumptionId,
            invoiceId,
            status: "paid",
         }),
      );
   };

   const getInvoiceStatusLabel = (status) => {
      if (status === "paid") return "Payée";
      if (status === "unpaid") return "Impayée";
      return "N/D";
   };

   if (!consumer || !subscription) {
      return (
         <div className="container mx-auto px-4 py-8">
            <div className="rounded-lg border bg-white shadow-sm p-12 text-center">
               <p className="text-red-500">Abonné ou abonnement introuvable</p>
               <button
                  onClick={() => navigate(-1)}
                  className="mt-4 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-100"
               >
                  Retour
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-[calc(100vh-8rem)] bg-background px-4 py-8">
         <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                     Consommations de {consumer.name}
                  </h1>
                  <p className="text-gray-500 mt-1">
                     Abonnement : {subscription.type} ({subscription.start_date}{" "}
                     - {subscription.end_date})
                  </p>
               </div>
               <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-100"
               >
                  <ArrowLeft className="h-4 w-4" />
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
                  {consumptions.map((c) => {
                     const hasInvoice =
                        c.invoice !== null && c.invoice !== undefined;

                     return (
                        <div
                           key={c.id}
                           className="rounded-lg border bg-white shadow-sm transition-all hover:shadow-lg"
                        >
                           {/* Header */}
                           <div className="p-4 border-b">
                              <div className="flex items-center justify-between">
                                 <h2 className="text-lg font-semibold">
                                    Consommation {c.month}
                                 </h2>
                                 <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                       !hasInvoice
                                          ? "bg-amber-100 text-amber-700"
                                          : c.invoice?.status === "paid"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                    }`}
                                 >
                                    {!hasInvoice
                                       ? "En cours"
                                       : getInvoiceStatusLabel(
                                            c.invoice?.status,
                                         )}
                                 </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                 {c.kwh} kWh consommés
                              </p>
                           </div>

                           {/* Content */}
                           <div className="p-4 space-y-4">
                              {hasInvoice ? (
                                 <>
                                    <div className="flex items-center gap-3">
                                       <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                          <DollarSign className="h-4 w-4 text-blue-600" />
                                       </div>
                                       <div>
                                          <p className="text-xs text-gray-500">
                                             Montant
                                          </p>
                                          <p className="text-lg font-bold text-gray-900">
                                             {c.invoice?.amount &&
                                             Number.isFinite(
                                                Number(c.invoice.amount),
                                             )
                                                ? `${Number(c.invoice.amount).toFixed(2)} MAD`
                                                : "N/D"}
                                          </p>
                                       </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                       <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
                                          <Calendar className="h-4 w-4 text-yellow-600" />
                                       </div>
                                       <div>
                                          <p className="text-xs text-gray-500">
                                             Date
                                          </p>
                                          <p className="font-medium text-gray-900">
                                             {c.invoice?.created_at || "N/D"}
                                          </p>
                                       </div>
                                    </div>

                                    {/* Actions */}
                                    {c.invoice?.status === "unpaid" && (
                                       <button
                                          onClick={() =>
                                             handleMarkAsPaid(
                                                c.id,
                                                c.invoice?.id,
                                             )
                                          }
                                          className="w-full flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                                       >
                                          <CheckCircle className="h-4 w-4" />
                                          Marquer comme payée
                                       </button>
                                    )}
                                 </>
                              ) : (
                                 <div className="text-center py-4">
                                    <p className="text-sm text-gray-500">
                                       Facture non générée
                                    </p>
                                 </div>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            )}
         </div>
      </div>
   );
}

export default Consumptions;
