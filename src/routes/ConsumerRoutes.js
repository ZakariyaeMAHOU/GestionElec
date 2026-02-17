import { Routes, Route } from "react-router-dom";

import Login from "../components/consumer/Login";
import Register from "../components/consumer/Register";
import Dashboard from "../components/consumer/Dashboard";
import Subscriptions from "../components/consumer/Subscriptions";
import Consumptions from "../components/consumer/Consumptions";
import AddSubscription from "../components/consumer/AddSubscription";
import Profile from "../components/Profile";

// route protection
import PrivateRoute from "./PrivateRoute";

const ConsumerRoutes = () => {
   return (
      <Routes>
         <Route path="/connexion" element={<Login />} />
         <Route path="/inscription" element={<Register />} />
         <Route
            path="/tableau-de-bord"
            element={
               <PrivateRoute>
                  <Dashboard />
               </PrivateRoute>
            }
         />
         <Route
            path="/abonnements"
            element={
               <PrivateRoute>
                  <Subscriptions />
               </PrivateRoute>
            }
         />
         <Route
            path="/abonnement/:subscriptionId/consommations"
            element={
               <PrivateRoute>
                  <Consumptions />
               </PrivateRoute>
            }
         />
         <Route
            path="/abonnements/demande"
            element={
               <PrivateRoute>
                  <AddSubscription />
               </PrivateRoute>
            }
         />
         <Route
            path="/profil"
            element={
               <PrivateRoute>
                  <Profile />
               </PrivateRoute>
            }
         />
      </Routes>
   );
};

export default ConsumerRoutes;
