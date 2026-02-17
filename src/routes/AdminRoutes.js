import { Routes, Route } from "react-router-dom";

import Login from "../components/admin/Login";
import Profile from "../components/Profile";
import Dashboard from "../components/admin/Dashboard";
import Consumers from "../components/admin/Consumers";
import UpdateConsumer from "../components/admin/UpdateConsumer";
import Subscriptions from "../components/admin/Subscriptions";
import ActiveSubscriptions from "../components/admin/ActiveSubscriptions";
import PendingSubscription from "../components/admin/PendingSubscription";
import UnpaidInvioces from "../components/admin/UnpaidInvioces";

// route protection
import PrivateRoute from "./PrivateRoute";
import Consumptions from "../components/admin/Consumptions";

const AdminRoutes = () => {
   return (
      <Routes>
         <Route path="/connexion" element={<Login />} />
         <Route
            path="/profil"
            element={
               <PrivateRoute>
                  <Profile />
               </PrivateRoute>
            }
         />
         <Route
            path="/tableau-de-bord"
            element={
               <PrivateRoute>
                  <Dashboard />
               </PrivateRoute>
            }
         />
         <Route
            path="/abonnees"
            element={
               <PrivateRoute>
                  <Consumers />
               </PrivateRoute>
            }
         />
         <Route
            path="/abonnees/:id/modifier"
            element={
               <PrivateRoute>
                  <UpdateConsumer />
               </PrivateRoute>
            }
         />
         <Route
            path="/abonnees/:id/abonnements"
            element={
               <PrivateRoute>
                  <Subscriptions />
               </PrivateRoute>
            }
         />
         <Route
            path="/abonnements-actifs"
            element={
               <PrivateRoute>
                  <ActiveSubscriptions />
               </PrivateRoute>
            }
         />
         <Route
            path="/abonnements-en-attente"
            element={
               <PrivateRoute>
                  <PendingSubscription />
               </PrivateRoute>
            }
         />
         <Route
            path="/abonnees/:consumerId/abonnements/:subscriptionId/consommations"
            element={
               <PrivateRoute>
                  <Consumptions />
               </PrivateRoute>
            }
         />
         <Route
            path="/factures-impayees"
            element={
               <PrivateRoute>
                  <UnpaidInvioces />
               </PrivateRoute>
            }
         />
      </Routes>
   );
};

export default AdminRoutes;
