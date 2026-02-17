import { useSelector } from "react-redux";
import { BarChart3, FileText, TrendingUp, AlertCircle } from "lucide-react";

const Dashboard = () => {
   const consumer = useSelector((state) => state.elec.user);

   const subscriptions = consumer?.subscriptions || [];
   const consumptions = subscriptions.flatMap((sub) => sub.consumptions || []);

   const invoices = consumptions
      .map((con) => con.invoice)
      .filter((inv) => inv !== null && inv !== undefined);

   const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;
   const unpaidInvoices = invoices.filter(
      (inv) => inv.status === "unpaid",
   ).length;
   const latestInvoice = invoices[0];

   const totalConsumption = consumptions.reduce((acc, c) => acc + c.kwh, 0);

   const stats = [
      {
         title: "Consommation totale",
         value: `${totalConsumption} kWh`,
         icon: TrendingUp,
         color: "text-primary",
         bgColor: "bg-primary/10",
      },
      {
         title: "Factures payees",
         value: paidInvoices.toString(),
         icon: FileText,
         color: "text-green-600",
         bgColor: "bg-green-100",
      },
      {
         title: "Factures impayees",
         value: unpaidInvoices.toString(),
         icon: AlertCircle,
         color: "text-red-600",
         bgColor: "bg-red-100",
      },
      {
         title: "Moyenne mensuelle",
         value: `${Math.round(totalConsumption / (consumptions.length || 1))} kWh`,
         icon: BarChart3,
         color: "text-blue-600",
         bgColor: "bg-blue-100",
      },
   ];

   const getInvoiceStatusLabel = (status) => {
      if (status === "paid") return "Payee";
      if (status === "unpaid") return "Impayee";
      return "N/D";
   };

   return (
      <div className="container mx-auto px-4 py-8">
         {/* Header */}
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
               Tableau de bord
            </h1>
            <p className="text-gray-500">
               Bienvenue, {consumer?.name} ! Voici un aperçu de votre
               consommation d'énergie.
            </p>
         </div>

         {/* Stats */}
         <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
               <div
                  key={stat.title}
                  className="rounded-lg border bg-white shadow-sm p-4 transition-all hover:shadow-md flex items-center gap-4"
               >
                  <div
                     className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}
                  >
                     <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                     <p className="text-sm text-gray-500">{stat.title}</p>
                     <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                     </p>
                  </div>
               </div>
            ))}
         </div>

         {/* Latest Invoice */}
         <div className="grid gap-6 lg:grid-cols-1">
            <div className="rounded-lg border bg-white shadow-sm">
               <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold">Dernière facture</h3>
                  <p className="text-sm text-gray-500">
                     Votre facture la plus récente
                  </p>
               </div>
               <div className="p-6">
                  {latestInvoice ? (
                     <div className="space-y-6 bg-blue-50 p-4 rounded-md">
                        <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-500">Mois</span>
                           <span className="font-medium">
                              {
                                 consumptions.find(
                                    (c) => c.invoice?.id === latestInvoice.id,
                                 )?.month
                              }
                           </span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-500">
                              Montant
                           </span>
                           <span className="text-2xl font-bold text-primary">
                              {parseFloat(latestInvoice.amount).toFixed(2)} MAD
                           </span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-500">Date</span>
                           <span className="font-medium">
                              {latestInvoice.created_at}
                           </span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-500">Statut</span>
                           <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                 latestInvoice.status === "paid"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                           >
                              {getInvoiceStatusLabel(latestInvoice.status)}
                           </span>
                        </div>
                     </div>
                  ) : (
                     <p className="text-center text-gray-500">
                        Aucune facture trouvée
                     </p>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
