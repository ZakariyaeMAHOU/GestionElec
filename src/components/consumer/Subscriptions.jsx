import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Subscription from "./Subscription";
import { removeSubscription } from "../../features/elecSlice";

function Subscriptions() {
   const consumer = useSelector((state) => state.elec.user);
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const subscriptions = consumer?.subscriptions || [];

   const handleShowConsumption = (subscriptionId) => {
      navigate(`/abonnement/${subscriptionId}/consommations`);
   };

   const handleCancelSubscription = (subscriptionId) => {
      if (!consumer) return;
      if (!window.confirm("Confirmer l'annulation de la demande ?")) return;
      dispatch(
         removeSubscription({
            userId: consumer.id,
            subscriptionId,
         }),
      );
   };

   return (
      <div className="container mx-auto px-4 py-8">
         {/* Header */}
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
               Mes abonnements
            </h1>
            <p className="text-gray-500">
               Gérez et consultez tous vos abonnements électriques
            </p>
         </div>

         {/* Subscriptions */}
         {subscriptions.length === 0 ? (
            <div className="rounded-lg border bg-white shadow-sm p-12 text-center">
               <p className="text-gray-500">Aucun abonnement trouvé</p>
            </div>
         ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {subscriptions.map((subscription) => (
                  <Subscription
                     key={subscription.id}
                     subscription={subscription}
                     onShowConsumption={handleShowConsumption}
                     onCancel={handleCancelSubscription}
                  />
               ))}
            </div>
         )}

         {/* New Subscription Request */}
         <div
            className="mt-8 rounded-lg border-2 border-dashed border-primary bg-white shadow-sm cursor-pointer flex flex-col items-center justify-center p-8 transition-all hover:shadow-lg"
            onClick={() =>
               navigate("/abonnements/demande", {
                  state: { userId: consumer.id },
               })
            }
         >
            <h2 className="text-xl font-bold text-center">
               Demander un abonnement
            </h2>
            <p className="text-sm text-gray-500 text-center">
               Cliquez ici pour créer une nouvelle demande
            </p>
            <button className="mt-4 border rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100">
               + Nouvelle Demande
            </button>
         </div>
      </div>
   );
}

export default Subscriptions;
