import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updateSubscriptionStatus } from "../../features/elecSlice";
import { Eye, ArrowLeft } from "lucide-react";

function Subscriptions() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const location = useLocation();
   const consumerId = location.state?.consumer?.id || null;
   const consumer = useSelector((state) =>
      state.elec.users.find((u) => u.id === consumerId),
   );

   const subscriptions = useMemo(() => {
      return consumer?.subscriptions || [];
   }, [consumer]);

   function handleStatus(subscriptionId, status) {
      if (!consumer) return;
      const confirmMessage =
         status === "active"
            ? "Confirmer l'activation de cet abonnement ?"
            : "Confirmer le refus de cet abonnement ?";
      if (!window.confirm(confirmMessage)) return;
      dispatch(
         updateSubscriptionStatus({
            userId: consumer.id,
            subscriptionId,
            status,
         }),
      );
   }

   function renderStatus(status) {
      const base =
         "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold";
      if (status === "active") {
         return `${base} bg-emerald-100 text-emerald-700`;
      }
      if (status === "pending") {
         return `${base} bg-amber-100 text-amber-700`;
      }
      if (status === "rejected") {
         return `${base} bg-red-100 text-red-700`;
      }
      return `${base} bg-muted text-muted-foreground`;
   }

   function getStatusLabel(status) {
      if (status === "pending") return "en attente";
      if (status === "rejected") return "refuse";
      if (status === "active") return "actif";
      return status;
   }

   if (!consumer)
      return (
         <div className="min-h-[calc(100vh-8rem)] bg-background px-4 py-10">
            <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-6 shadow-sm">
               <h1 className="text-xl font-semibold text-foreground">
                  Aucun abonné trouvé
               </h1>
               <p className="mt-2 text-sm text-muted-foreground">
                  Revenez a la liste des abonnés pour selectionner un compte.
               </p>
               <button
                  onClick={() => navigate("/admin/abonnees")}
                  className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
               >
                  Retour a la liste
               </button>
            </div>
         </div>
      );

   return (
      <div className="min-h-[calc(100vh-8rem)] bg-background px-4 py-8">
         <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-foreground">
                     Abonnements de {consumer.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                     Gestion des abonnements et des statuts.
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

            {!subscriptions.length && (
               <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                  Aucun abonnement trouvé pour cet abonné.
               </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
               {subscriptions.map((sub) => (
                  <div
                     key={sub.id}
                     className="rounded-xl border border-border bg-card p-5 shadow-sm"
                  >
                     <div className="flex items-start justify-between gap-3">
                        <div>
                           <h2 className="text-lg font-semibold text-foreground">
                              {sub.type}
                           </h2>
                           <p className="mt-1 text-sm text-muted-foreground">
                              {sub.start_date} - {sub.end_date}
                           </p>
                        </div>
                        <span className={renderStatus(sub.status)}>
                           {getStatusLabel(sub.status)}
                        </span>
                     </div>

                     <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                           Consommations: {sub.consumptions?.length || 0}
                        </span>
                     </div>

                     <div className="mt-5 flex flex-wrap items-center gap-2">
                        <button
                           type="button"
                           disabled={sub.status !== "pending"}
                           onClick={() => handleStatus(sub.id, "active")}
                           className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium text-white ${
                              sub.status === "pending"
                                 ? "bg-emerald-600 hover:bg-emerald-700"
                                 : "bg-emerald-300 cursor-not-allowed"
                           }`}
                        >
                           Accepter
                        </button>
                        <button
                           type="button"
                           disabled={sub.status !== "pending"}
                           onClick={() => handleStatus(sub.id, "rejected")}
                           className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium ${
                              sub.status === "pending"
                                 ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                                 : "bg-red-50 text-red-300 border border-red-100 cursor-not-allowed"
                           }`}
                        >
                           Refuser
                        </button>
                        <button
                           type="button"
                           onClick={() =>
                              navigate(
                                 `/admin/abonnees/${consumer.id}/abonnements/${sub.id}/consommations`,
                                 {
                                    state: { consumer, subscription: sub },
                                 },
                              )
                           }
                           className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                        >
                           <Eye className="h-3.5 w-3.5" />
                           Voir les consommations
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}

export default Subscriptions;
