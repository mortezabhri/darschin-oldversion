import { Route, Routes } from "react-router-dom";
import { useReducer } from "react";
import Sidebar from "./layouts/sidebar";
import { SettingsProvider } from "./contexts/Settings";
import { ToastContainer } from "react-toastify";

//PAGES
import Home from "./pages/Home";
import TotalPlans from "./pages/TotalPlans";
import FAQ from "./pages/FAQ";

function App() {

       const [, forceUpdate] = useReducer(x => x + 1, 0);

       return (
              <SettingsProvider>
                     <section className="min-w-xs max-w-lg mx-auto select-none bg-quaternary min-h-screen relative overflow-x-hidden">
                            <ToastContainer rtl />
                            <Sidebar rerendering={forceUpdate} />
                            <Routes>
                                   <Route path="/" element={<Home />} />
                                   <Route path="/plans" element={<TotalPlans />} />
                                   <Route path="/faq" element={<FAQ />} />
                            </Routes>
                     </section>
              </SettingsProvider>
       )
}

export default App
