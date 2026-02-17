import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSubscription } from "../../features/elecSlice";

function AddSubscription() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const userId = useSelector((state) => state.elec.user?.id);

   const [formData, setFormData] = useState({
      userId: userId || null,
      type: "",
      duration: "",
   });

   const [errors, setErrors] = useState({});

   function handleChange(e) {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: null }));
   }

   const handleSubmit = (e) => {
      e.preventDefault();

      const errs = {};
      if (!formData.type) errs.type = "Veuillez choisir un type d’abonnement";
      if (!formData.duration) errs.duration = "Veuillez choisir une durée";

      if (Object.keys(errs).length) {
         setErrors(errs);
         return;
      }

      // calculer dates automatiquement selon durée
      const startDate = new Date();
      let endDate = new Date(startDate);

      switch (formData.duration) {
         case "6mois":
            endDate.setMonth(endDate.getMonth() + 6);
            break;
         case "1an":
            endDate.setFullYear(endDate.getFullYear() + 1);
            break;
         case "2ans":
            endDate.setFullYear(endDate.getFullYear() + 2);
            break;
         case "3ans":
            endDate.setFullYear(endDate.getFullYear() + 3);
            break;
         default:
            break;
      }

      const payload = {
         userId: formData.userId,
         type: formData.type,
         start_date: startDate.toISOString().split("T")[0],
         end_date: endDate.toISOString().split("T")[0],
      };

      dispatch(addSubscription(payload));
      navigate("/abonnements");
   };

   function handleCancel(e) {
      e.preventDefault();
      navigate(-1);
   }

   return (
      <div className="container mx-auto px-4 py-8">
         <div className="rounded-lg border bg-white shadow-sm p-6">
            <div className="mb-6">
               <h2 className="text-xl font-bold">Demande d’abonnement</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               {/* Type */}
               <div>
                  <label className="block text-sm font-medium">Type</label>
                  <select
                     name="type"
                     value={formData.type}
                     onChange={handleChange}
                     className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                        errors.type
                           ? "border-red-500 focus:ring-red-500"
                           : "focus:ring-primary"
                     }`}
                  >
                     <option value="">-- Choisir un type --</option>
                     <option value="Résidentiel">Résidentiel</option>
                     <option value="Commercial">Commercial</option>
                     <option value="Industriel">Industriel</option>
                     <option value="Agricole">Agricole</option>
                     <option value="Solaire">Solaire</option>
                     <option value="Premium">Premium</option>
                  </select>
                  {errors.type && (
                     <p className="text-xs text-red-600 mt-1">{errors.type}</p>
                  )}
               </div>

               {/* Durée */}
               <div>
                  <label className="block text-sm font-medium">Durée</label>
                  <select
                     name="duration"
                     value={formData.duration}
                     onChange={handleChange}
                     className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                        errors.duration
                           ? "border-red-500 focus:ring-red-500"
                           : "focus:ring-primary"
                     }`}
                  >
                     <option value="">-- Choisir une durée --</option>
                     <option value="6mois">6 mois</option>
                     <option value="1an">1 an</option>
                     <option value="2ans">2 ans</option>
                     <option value="3ans">3 ans</option>
                  </select>
                  {errors.duration && (
                     <p className="text-xs text-red-600 mt-1">
                        {errors.duration}
                     </p>
                  )}
               </div>

               {/* Actions */}
               <div className="flex gap-2">
                  <button
                     type="submit"
                     className="flex-1 rounded-md bg-primary text-white px-4 py-2 font-medium hover:bg-primary/90"
                  >
                     Envoyer la demande
                  </button>
                  <button
                     type="button"
                     onClick={handleCancel}
                     className="flex-1 rounded-md border px-4 py-2 font-medium hover:bg-gray-100"
                  >
                     Annuler
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}

export default AddSubscription;
