import { Route, Routes } from "react-router-dom";
import { useReducer } from "react";
import Sidebar from "./layouts/sidebar";
import { SettingsProvider } from "./contexts/Settings";
import { ToastContainer } from "react-toastify";
import { Get } from "./utils/Storage";
import { useNavigate } from "react-router-dom"
import { useEffect , useRef } from "react";
import { PlanProvider } from "./contexts/Plans";
import NewVersion from "./components/NewVersion";


// PAGES
import Home from "./pages/Home";
import TotalPlans from "./pages/TotalPlans";
import FAQ from "./pages/FAQ";
import Welcome from "./pages/welcome";
import Settings from "./pages/Settings";

function App() {

     const navigate = useNavigate();

     useEffect(() => {
          if (!Get("welcome")) {
               navigate("/welcome");
          }
          if (Get("them") === "dark") {
               document.body.classList.remove("light")
               document.body.classList.add("dark");
          } else if (Get("them") === "light") {
               document.body.classList.remove("dark")
               document.body.classList.add("light");
          }
     }, [])


     return (
          <PlanProvider>
               <SettingsProvider>
                    <section className="min-w-xs max-w-lg mx-auto select-none bg-quaternary dark:bg-neutral-600 transition-all min-h-screen relative overflow-x-hidden">
                         <NewVersion />
                         <ToastContainer rtl style={{ zIndex: 9999999 }} />
                         <Sidebar />
                         <div className="py-6"></div>
                         <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/plans" element={<TotalPlans />} />
                              <Route path="/faq" element={<FAQ />} />
                              <Route path="/welcome" element={<Welcome />} />
                              <Route path="/settings" element={<Settings />} />
                         </Routes>
                    </section>
               </SettingsProvider>
          </PlanProvider>
     )
}

export default App ;
