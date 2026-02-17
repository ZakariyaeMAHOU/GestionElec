import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import { Users, CheckCircle, Clock, AlertCircle } from "lucide-react";

function Dashboard() {
   const navigate = useNavigate();
   const users = useSelector((state) => state.elec.users);
   const consumers = users.filter((user) => user?.role === "consumer");
   const subscriptions = [].concat.apply(
      [],
      consumers.map((c) =>
         (c?.subscriptions ?? []).map((subscription) => ({
            ...subscription,
            consumerName: c?.name,
         })),
      ),
   );
   const activeSubscriptions = subscriptions.filter(
      (s) => s?.status === "active",
   );
   const pendingSubscriptions = subscriptions.filter(
      (s) => s?.status === "pending",
   );

   const consumptionsUnpaid = consumers.reduce((total, consumer) => {
      return (
         total +
         (consumer.subscriptions || []).reduce((subTotal, sub) => {
            return (
               subTotal +
               (sub.consumptions || []).filter(
                  (c) => c.invoice?.status === "unpaid",
               ).length
            );
         }, 0)
      );
   }, 0);

   return (
      <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4 py-8 flex items-center justify-center">
         <div className="mx-auto max-w-6xl w-full">
            <div className="mb-12 text-center">
               <h1 className="text-4xl font-bold text-slate-900">
                  Tableau de bord admin
               </h1>
               <p className="text-slate-500 mt-2">
                  Vue rapide sur les activites et les comptes.
               </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
               <Link to="/admin/abonnees">
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                           <Users className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                           <p className="text-xs uppercase tracking-wide text-slate-400">
                              Les abonnés
                           </p>
                           <p className="text-3xl font-bold text-slate-900">
                              {consumers.length}
                           </p>
                        </div>
                     </div>
                  </div>
               </Link>
               <div
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm cursor-pointer hover:shadow-md hover:bg-slate-50 transition-all"
                  onClick={() =>
                     navigate("/admin/abonnements-actifs", {
                        state: { subscriptions: activeSubscriptions },
                     })
                  }
               >
                  <div className="flex items-center gap-4">
                     <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-100">
                        <CheckCircle className="h-7 w-7 text-emerald-600" />
                     </div>
                     <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                           Abonnements actifs
                        </p>
                        <p className="text-3xl font-bold text-slate-900">
                           {activeSubscriptions.length}
                        </p>
                     </div>
                  </div>
               </div>
               <div
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm cursor-pointer hover:shadow-md hover:bg-slate-50 transition-all"
                  onClick={() =>
                     navigate("/admin/abonnements-en-attente", {
                        state: { subscriptions: pendingSubscriptions },
                     })
                  }
               >
                  <div className="flex items-center gap-4">
                     <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-amber-100">
                        <Clock className="h-7 w-7 text-amber-600" />
                     </div>
                     <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                           Demandes en attente
                        </p>
                        <p className="text-3xl font-bold text-slate-900">
                           {pendingSubscriptions.length}
                        </p>
                     </div>
                  </div>
               </div>
               <div
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all cursor-pointer"
                  onClick={() => navigate("/admin/factures-impayees")}
               >
                  <div className="flex items-center gap-4">
                     <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-red-100">
                        <AlertCircle className="h-7 w-7 text-red-600" />
                     </div>
                     <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                           Factures impayées
                        </p>
                        <p className="text-3xl font-bold text-slate-900">
                           {consumptionsUnpaid}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Dashboard;
