import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConsumerRoutes from "./routes/ConsumerRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Fouter";

import Home from "./components/Home";

function App() {
   return (
      <BrowserRouter>
         <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
               <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/*" element={<ConsumerRoutes />} />
                  <Route path="/admin/*" element={<AdminRoutes />} />
               </Routes>
            </main>
            <Footer />
         </div>
      </BrowserRouter>
   );
}

export default App;
