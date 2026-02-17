import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute({ children }) {
   const user = useSelector((state) => state.elec.user);
   if (!user) {
      return <Navigate to="/" replace />;
   }
   return children;
}

export default PrivateRoute;
