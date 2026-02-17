import { createSlice } from "@reduxjs/toolkit";
import { data } from "../data/data";

function loadUserFromStorage() {
   try {
      const savedUser = localStorage.getItem("elec_user");
      return savedUser ? JSON.parse(savedUser) : null;
   } catch (error) {
      console.error("Error loading user from localStorage:", error);
      return null;
   }
}

function saveUserToStorage(user) {
   try {
      if (user) {
         localStorage.setItem("elec_user", JSON.stringify(user));
      } else {
         localStorage.removeItem("elec_user");
      }
   } catch (error) {
      console.error("Error saving user to localStorage:", error);
   }
}

const initialState = {
   users: data.users,
   user: loadUserFromStorage(),
   error: null,
};

const elecSlice = createSlice({
   name: "elec",
   initialState,
   reducers: {
      // auth
      login: (state, action) => {
         const { email, password } = action.payload;
         const user = state.users.find(
            (u) => u.email === email && u.password === password,
         );
         if (user) {
            state.user = user;
            state.error = null;
            saveUserToStorage(user);
         } else {
            state.error = "Email ou mot de passe incorrect";
         }
      },
      register: (state, action) => {
         const { name, email, phone, password } = action.payload;
         const newUser = {
            id: state.users.length + 1,
            name,
            email,
            phone,
            password,
            role: "consumer",
            subscriptions: [],
         };
         state.users.push(newUser);
         state.error = null;
      },
      logout: (state) => {
         state.user = null;
         state.error = null;
         saveUserToStorage(null);
      },
      clearError: (state) => {
         state.error = null;
      },

      // consumer
      addSubscription: (state, action) => {
         const { userId, type, start_date, end_date } = action.payload;
         const targetUserId = userId ?? state.user?.id;
         if (!targetUserId) return;

         const userIndex = state.users.findIndex((u) => u.id === targetUserId);
         if (userIndex === -1) return;

         const user = state.users[userIndex];
         const nextId = (user.subscriptions?.length || 0) + 1;
         const newSubscription = {
            userId: targetUserId,
            id: nextId,
            type,
            status: "pending",
            start_date,
            end_date,
            consumptions: [],
         };

         state.users[userIndex] = {
            ...user,
            subscriptions: [...(user.subscriptions || []), newSubscription],
         };

         if (state.user && state.user.id === targetUserId) {
            state.user = {
               ...state.user,
               subscriptions: [
                  ...(state.user.subscriptions || []),
                  newSubscription,
               ],
            };
            saveUserToStorage(state.user);
         }
      },
      updateProfile: (state, action) => {
         const { name, email, phone, password } = action.payload;
         if (!state.user) return;
         const userIndex = state.users.findIndex((u) => u.id === state.user.id);
         if (userIndex === -1) return;
         state.users[userIndex] = {
            ...state.users[userIndex],
            name,
            email,
            phone,
            password,
         };
         state.user = {
            ...state.user,
            name,
            email,
            phone,
            password,
         };
         saveUserToStorage(state.user);
      },
      // admin
      loginAdmin: (state, action) => {
         const { email, password } = action.payload;
         const matchedUser = state.users.find(
            (u) => u.email === email && u.password === password,
         );
         if (matchedUser?.role === "admin") {
            state.user = matchedUser;
            state.error = null;
            saveUserToStorage(matchedUser);
         } else if (matchedUser?.role === "consumer") {
            state.user = null;
            state.error = "Vous n'avez pas acces a l'espace admin.";
         } else {
            state.user = null;
            state.error = "Email ou mot de passe incorrect";
         }
      },
      updateConsumer: (state, action) => {
         const { id, name, email, phone, password } = action.payload;
         const userIndex = state.users.findIndex((u) => u.id === id);
         if (userIndex === -1) return;
         const current = state.users[userIndex];
         const nextUser = {
            ...current,
            name,
            email,
            phone,
         };
         if (password) {
            nextUser.password = password;
         }
         state.users[userIndex] = nextUser;
         if (state.user && state.user.id === id) {
            state.user = nextUser;
            saveUserToStorage(state.user);
         }
         state.error = null;
      },
      deleteConsumer: (state, action) => {
         const { id } = action.payload;
         const nextUsers = state.users.filter((u) => u.id !== id);
         if (nextUsers.length === state.users.length) return;
         state.users = nextUsers;
         if (state.user && state.user.id === id) {
            state.user = null;
            saveUserToStorage(null);
         }
         state.error = null;
      },
      updateSubscriptionStatus: (state, action) => {
         const { userId, subscriptionId, status } = action.payload;
         const userIndex = state.users.findIndex((u) => u.id === userId);
         if (userIndex === -1) return;
         const user = state.users[userIndex];
         const subs = user.subscriptions || [];
         const subIndex = subs.findIndex((s) => s.id === subscriptionId);
         if (subIndex === -1) return;

         const nextSubs = subs.map((s, idx) =>
            idx === subIndex ? { ...s, status } : s,
         );

         state.users[userIndex] = {
            ...user,
            subscriptions: nextSubs,
         };

         if (state.user && state.user.id === userId) {
            state.user = {
               ...state.user,
               subscriptions: nextSubs,
            };
            saveUserToStorage(state.user);
         }

         state.error = null;
      },
      removeSubscription: (state, action) => {
         const { userId, subscriptionId } = action.payload;
         const targetUserId = userId ?? state.user?.id;
         if (!targetUserId) return;

         const userIndex = state.users.findIndex((u) => u.id === targetUserId);
         if (userIndex === -1) return;

         const user = state.users[userIndex];
         const nextSubs = (user.subscriptions || []).filter(
            (s) => s.id !== subscriptionId,
         );

         state.users[userIndex] = {
            ...user,
            subscriptions: nextSubs,
         };

         if (state.user && state.user.id === targetUserId) {
            state.user = {
               ...state.user,
               subscriptions: nextSubs,
            };
            saveUserToStorage(state.user);
         }

         state.error = null;
      },
      updateInvoiceStatus: (state, action) => {
         const { userId, subscriptionId, consumptionId, invoiceId, status } =
            action.payload;
         const userIndex = state.users.findIndex(
            (u) => u.id === Number(userId),
         );
         if (userIndex === -1) return;

         const user = state.users[userIndex];
         const subIndex = (user.subscriptions || []).findIndex(
            (s) => s.id === Number(subscriptionId),
         );
         if (subIndex === -1) return;

         const subscription = user.subscriptions[subIndex];
         const consIndex = (subscription.consumptions || []).findIndex(
            (c) => c.id === consumptionId,
         );
         if (consIndex === -1) return;

         const updatedConsumptions = subscription.consumptions.map((c, idx) => {
            if (idx === consIndex && c.invoice && c.invoice.id === invoiceId) {
               return {
                  ...c,
                  invoice: {
                     ...c.invoice,
                     status,
                  },
               };
            }
            return c;
         });

         const updatedSubscriptions = user.subscriptions.map((s, idx) => {
            if (idx === subIndex) {
               return {
                  ...s,
                  consumptions: updatedConsumptions,
               };
            }
            return s;
         });

         state.users[userIndex] = {
            ...user,
            subscriptions: updatedSubscriptions,
         };

         if (state.user && state.user.id === Number(userId)) {
            state.user = {
               ...state.user,
               subscriptions: updatedSubscriptions,
            };
            saveUserToStorage(state.user);
         }

         state.error = null;
      },
   },
});

export const {
   login,
   logout,
   // consumer
   register,
   clearError,
   addSubscription,
   updateProfile,
   // admin
   loginAdmin,
   updateConsumer,
   deleteConsumer,
   updateSubscriptionStatus,
   removeSubscription,
   updateInvoiceStatus,
} = elecSlice.actions;
export default elecSlice.reducer;
