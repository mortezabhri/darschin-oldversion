import { Route, Routes } from "react-router-dom";
import { useReducer } from "react";
import Sidebar from "./layouts/sidebar";
import { SettingsProvider } from "./contexts/Settings";
import { ToastContainer } from "react-toastify";
import { Get } from "./utils/Storage";
import { useNavigate } from "react-router-dom"

//PAGES
import Home from "./pages/Home";
import TotalPlans from "./pages/TotalPlans";
import FAQ from "./pages/FAQ";
import Welcome from "./pages/welcome";
import { useEffect } from "react";

function App() {

       const navigate = useNavigate();
       useEffect(() => {
              if (!Get("welcome")) {
                     navigate("/welcome");
              }
       }, [])

       const [, forceUpdate] = useReducer(x => x + 1, 0);

       return (
              <SettingsProvider>
                     <section className="min-w-xs max-w-lg mx-auto select-none bg-quaternary min-h-screen relative overflow-x-hidden">
                            <ToastContainer rtl style={{zIndex : 9999999}}/>
                            <Sidebar rerendering={forceUpdate} />
                            <Routes>
                                   <Route path="/" element={<Home />} />
                                   <Route path="/plans" element={<TotalPlans />} />
                                   <Route path="/faq" element={<FAQ />} />
                                   <Route path="/welcome" element={<Welcome />} />
                            </Routes>
                     </section>
              </SettingsProvider>
       )
}

export default App
