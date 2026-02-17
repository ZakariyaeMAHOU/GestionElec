import { configureStore } from "@reduxjs/toolkit";
import elecReducer from "./features/elecSlice";

const store = configureStore({
   reducer: {
      elec: elecReducer,
   },
});

export default store;
