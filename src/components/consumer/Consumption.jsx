import { Calendar, DollarSign, Download } from "lucide-react";

function Consumption({ c }) {
   const handleDownloadInvoice = (invoiceId) => {
      console.log(`Téléchargement de la facture #${invoiceId}...`);
   };
   const getInvoiceStatusLabel = (status) => {
      if (status === "paid") return "Payee";
      if (status === "unpaid") return "Impayee";
      return "N/D";
   };

   const hasInvoice = c.invoice !== null && c.invoice !== undefined;

   return (
      <div
         key={c.id}
         className="rounded-lg border bg-white shadow-sm transition-all hover:shadow-lg"
      >
         {/* Header */}
         <div className="p-4 border-b">
            <div className="flex items-center justify-between">
               <h2 className="text-lg font-semibold">Consommation {c.month}</h2>
               <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                     !hasInvoice
                        ? "bg-amber-100 text-amber-700"
                        : c.invoice?.status === "paid"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                  }`}
               >
                  {!hasInvoice
                     ? "En cours"
                     : getInvoiceStatusLabel(c.invoice?.status)}
               </span>
            </div>
            <p className="text-sm text-gray-500">{c.kwh} kWh consommés</p>
         </div>

         {/* Content */}
         <div className="p-4 space-y-4">
            {!hasInvoice ? (
               <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-center">
                  <p className="text-sm text-amber-800 font-medium">
                     Facture en attente
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                     La facture sera générée à la debut du mois prochain
                  </p>
               </div>
            ) : (
               <>
                  <div className="flex items-center gap-3">
                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                     </div>
                     <div>
                        <p className="text-xs text-gray-500">Montant</p>
                        <p className="text-lg font-bold text-gray-900">
                           {c.invoice?.amount &&
                           Number.isFinite(Number(c.invoice.amount))
                              ? `${Number(c.invoice.amount).toFixed(2)} MAD`
                              : "N/D"}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
                        <Calendar className="h-4 w-4 text-yellow-600" />
                     </div>
                     <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">
                           {c.invoice?.created_at || "N/D"}
                        </p>
                     </div>
                  </div>

                  {/* Actions */}
                  <button
                     onClick={() => handleDownloadInvoice(c.invoice?.id)}
                     className="w-full flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-100"
                  >
                     <Download className="h-4 w-4" />
                     Télécharger la facture
                  </button>
               </>
            )}
         </div>
      </div>
   );
}

export default Consumption;
