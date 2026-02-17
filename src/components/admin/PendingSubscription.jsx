import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updateSubscriptionStatus } from "../../features/elecSlice";
import { ArrowLeft } from "lucide-react";

function PendingSubscription() {
   const location = useLocation();
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [subscriptions, setSubscriptions] = useState(
      location.state?.subscriptions ?? [],
   );

   const getStatusLabel = (status) => {
      if (status === "active") return "actif";
      if (status === "pending") return "en attente";
      if (status === "rejected") return "refuse";
      return "-";
   };

   const handleStatusChange = (subscription, nextStatus) => {
      const confirmMessage =
         nextStatus === "active"
            ? "Confirmer l'activation de cet abonnement ?"
            : "Confirmer le refus de cet abonnement ?";

      if (!window.confirm(confirmMessage)) return;

      if (subscription?.userId && subscription?.id) {
         dispatch(
            updateSubscriptionStatus({
               userId: subscription.userId,
               subscriptionId: subscription.id,
               status: nextStatus,
            }),
         );
      }

      setSubscriptions((prev) =>
         prev.map((item) =>
            item?.id === subscription?.id
               ? { ...item, status: nextStatus }
               : item,
         ),
      );
   };

   const renderStatusBadge = (status) => {
      if (status === "active") {
         return (
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
               Actif
            </span>
         );
      }
      if (status === "rejected") {
         return (
            <span className="rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">
               Refuse
            </span>
         );
      }
      return (
         <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
            En attente
         </span>
      );
   };

   return (
      <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4 py-8">
         <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                     Abonnements en attente
                  </h1>
                  <p className="text-sm text-slate-500">
                     Total: {subscriptions.length}
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

            {subscriptions.length === 0 ? (
               <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-slate-500">
                  Aucun abonnement en attente pour le moment.
               </div>
            ) : (
               <div className="grid gap-4 sm:grid-cols-2">
                  {subscriptions.map((subscription, index) => (
                     <div
                        key={
                           subscription?.id ??
                           `${subscription?.userId ?? "sub"}-${index}`
                        }
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                     >
                        <div className="flex items-start justify-between">
                           <div>
                              <p className="text-sm font-semibold text-slate-900">
                                 {subscription?.type ?? "Abonnement"}
                              </p>
                              <p className="text-xs text-slate-500">
                                 Statut: {getStatusLabel(subscription?.status)}
                              </p>
                           </div>
                           {renderStatusBadge(
                              subscription?.status ?? "pending",
                           )}
                        </div>

                        <div className="mt-3 space-y-1 text-sm text-slate-600">
                           <p>
                              Client:{" "}
                              {subscription?.consumerName ??
                                 subscription?.userId ??
                                 "-"}
                           </p>
                           <p>Type: {subscription?.type ?? "-"}</p>
                           <p>Debut: {subscription?.start_date ?? "-"}</p>
                           <p>Fin: {subscription?.end_date ?? "-"}</p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                           {subscription?.status !== "pending" ? (
                              <p className="text-xs text-slate-400">
                                 Action deja appliquee.
                              </p>
                           ) : null}
                           <button
                              type="button"
                              onClick={() =>
                                 handleStatusChange(subscription, "active")
                              }
                              disabled={subscription?.status !== "pending"}
                              className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                           >
                              Activer
                           </button>
                           <button
                              type="button"
                              onClick={() =>
                                 handleStatusChange(subscription, "rejected")
                              }
                              disabled={subscription?.status !== "pending"}
                              className="rounded-md bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                           >
                              Refuser
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}

export default PendingSubscription;
