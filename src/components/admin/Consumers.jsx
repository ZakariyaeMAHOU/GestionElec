import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteConsumer } from "../../features/elecSlice";
import { ArrowLeft } from "lucide-react";

function Consumers() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { users } = useSelector((state) => state.elec);

   function handleDelete(consumer) {
      const ok = window.confirm(
         `Supprimer l'abonné ${consumer.name || ""} ? Cette action est irreversible.`,
      );
      if (!ok) return;
      dispatch(deleteConsumer({ id: consumer.id }));
   }

   const consumers = useMemo(() => {
      return (users || []).filter((u) => u.role === "consumer");
   }, [users]);

   return (
      <div className="min-h-[calc(100vh-8rem)] bg-background px-4 py-8">
         <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-foreground">
                     Abonnés
                  </h1>
                  <p className="text-sm text-muted-foreground">
                     Gestion des comptes abonnés, modification et abonnements.
                  </p>
               </div>
               <button
                  onClick={() => navigate("/admin/tableau-de-bord")}
                  className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-100"
               >
                  <ArrowLeft className="h-4 w-4" />
                  Retour à la tableau de bord
               </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
               <div className="grid grid-cols-12 gap-2 border-b border-border bg-muted/30 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <div className="col-span-3">Nom</div>
                  <div className="col-span-4">Email</div>
                  <div className="col-span-2">Telephone</div>
                  <div className="col-span-3 text-right">Actions</div>
               </div>
               <div className="divide-y divide-border">
                  {consumers.map((consumer) => (
                     <div
                        key={consumer.id}
                        className="grid grid-cols-12 gap-2 px-4 py-3 text-sm text-foreground"
                     >
                        <div className="col-span-3 truncate font-medium text-foreground">
                           {consumer.name}
                        </div>
                        <div className="col-span-4 truncate text-muted-foreground">
                           {consumer.email}
                        </div>
                        <div className="col-span-2 whitespace-nowrap text-muted-foreground">
                           {consumer.phone}
                        </div>
                        <div className="col-span-3 flex flex-wrap justify-end gap-2">
                           <button
                              className="inline-flex items-center justify-center rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
                              onClick={() =>
                                 navigate(
                                    `/admin/abonnees/${consumer.id}/modifier`,
                                    { state: { consumer } },
                                 )
                              }
                           >
                              Modifier
                           </button>
                           <button
                              type="button"
                              onClick={() => handleDelete(consumer)}
                              className="inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                           >
                              Supprimer
                           </button>
                           <button
                              className="inline-flex items-center justify-center rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-white hover:bg-primary/90"
                              onClick={() =>
                                 navigate(
                                    `/admin/abonnees/${consumer.id}/abonnements`,
                                    { state: { consumer } },
                                 )
                              }
                           >
                              Abonnements
                           </button>
                        </div>
                     </div>
                  ))}
                  {!consumers.length && (
                     <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                        Aucun abonné trouvé.
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}

export default Consumers;
