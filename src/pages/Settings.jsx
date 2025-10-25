import { useState, useEffect } from "react"
import Modal from "../components/Modal";
import TimeSelector from "../components/time-selector/TimePicker";
import { useSettings, SettingsContextTypes } from "../contexts/Settings";
import { notifyError, notifySuccess, notifyWarn } from "../utils/Tostify";
import { Add, Get } from "../utils/Storage";
import { Link, useNavigate } from "react-router-dom";

export default function Settings() {

     const [openSetting, setOpenSetting] = useState(false);
     const { settings, dispatch } = useSettings();
     const redirect = useNavigate();

     const pdfDownloadHandler = () => {
          const toastLoadID = notifyWarn("عملیات درحال انجام...");
          Add("download_pdf_handler", toastLoadID);
          redirect("/plans");
     }

     const [mode, setMode] = useState(Get("them") ?? "light");
     useEffect(() => {
          if (mode === "dark") {
               document.body.classList.remove("light")
               document.body.classList.add("dark");
          } else if (mode === "light") {
               document.body.classList.remove("dark")
               document.body.classList.add("light");
          }
     }, [mode]);

     return (
          <div className="w-full mt-36">
               {/* svg box */}
               <div className="w-86 h-24 absolute top-0 right-0">
                    <div className="w-full h-full bg-gray-300 rounded-bl-full "></div>
                    <p className=" absolute top-8 right-28 text-2xl font-morabba-bold">تنظیمات</p>
               </div>
               {/* content */}
               <div className="w-full font-morabba font-[500] space-y-8">
                    {/* change settings */}
                    <div className="flex flex-col justify-center items-center">
                         <button className="w-8/10 text-lg cursor-pointer bg-neutral-200 dark:bg-neutral-400 dark:shadow-white/20 shadow-xl py-2 rounded-lg" onClick={() => setOpenSetting(prev => !prev)}>تنظیم تایم روز</button>
                         <Modal isOpen={openSetting} onClose={() => setOpenSetting(prev => !prev)}>
                              <div className="w-full rounded-xl bg-white dark:bg-neutral-700 mx-auto">
                                   <h1 className="w-full py-6 text-center font-morabba-bold text-2xl">تنظیم تایم روز</h1>
                                   <div className="w-full h-50 ">
                                        <TimeSelector
                                             callback={(e) => {
                                                  dispatch({ type: SettingsContextTypes.CHANGE_HOURS, startHour: e.from, endHour: e.to });
                                                  setOpenSetting(false);
                                                  notifySuccess("عملیات موفقیت آمیز بود");
                                             }}
                                             defaultStart={settings.startHour}
                                             defaultEnd={settings.endHour}
                                        />
                                   </div>
                              </div>
                         </Modal>
                    </div>
                    {/* change them mode */}
                    <div className="flex flex-col justify-center items-center">

                         {/* change mode */}
                         <button
                              onClick={() => {
                                   setMode(prev => prev === "light" ? "dark" : "light");
                                   Add("them", mode === "light" ? "dark" : "light");
                              }}
                              dir="rtl"
                              className="w-8/10 cursor-pointer bg-neutral-200 dark:bg-neutral-400 dark:shadow-white/20 shadow-xl py-1 text-lg rounded-lg gap-x-2 flex justify-center items-center"
                         >
                              تغییر مود
                              <span className="w-12 h-10 overflow-hidden">
                                   <svg
                                        style={{
                                             transform: mode === "light" ? "translateY(0px)" : "translateY(-40px)"
                                        }}
                                        xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-all" viewBox="0 0 24 24" fill="none">
                                        <path d="M7.28451 10.3333C7.10026 10.8546 7 11.4156 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C11.4156 7 10.8546 7.10026 10.3333 7.28451" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M12 2V4" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M12 20V22" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M4 12L2 12" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M22 12L20 12" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M19.7778 4.22266L17.5558 6.25424" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M4.22217 4.22266L6.44418 6.25424" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M6.44434 17.5557L4.22211 19.7779" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M19.7778 19.7773L17.5558 17.5551" className="stroke-neutral-700" strokeWidth="1.5" strokeLinecap="round" />
                                   </svg>
                                   <svg
                                        style={{
                                             transform: mode === "light" ? "translateY(0px)" : "translateY(-40px)"
                                        }}
                                        xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-all" viewBox="0 0 24 24" fill="none">
                                        <path className="fill-neutral-100" d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM7.37554 20.013C7.017 19.8056 6.5582 19.9281 6.3508 20.2866C6.14339 20.6452 6.26591 21.104 6.62446 21.3114L7.37554 20.013ZM2.68862 17.3755C2.89602 17.7341 3.35482 17.8566 3.71337 17.6492C4.07191 17.4418 4.19443 16.983 3.98703 16.6245L2.68862 17.3755ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447ZM12 21.25C10.3139 21.25 8.73533 20.7996 7.37554 20.013L6.62446 21.3114C8.2064 22.2265 10.0432 22.75 12 22.75V21.25ZM3.98703 16.6245C3.20043 15.2647 2.75 13.6861 2.75 12H1.25C1.25 13.9568 1.77351 15.7936 2.68862 17.3755L3.98703 16.6245Z" />
                                   </svg>
                              </span>
                         </button>
                    </div>
                    {/* download pdf */}
                    <div className="flex flex-col justify-center items-center">
                         {/* download pdf */}
                         <button
                              dir="rtl"
                              className="w-8/10 text-lg cursor-pointer bg-neutral-200 dark:bg-neutral-400 dark:shadow-white/30 shadow-xl py-2 rounded-lg "
                              onClick={pdfDownloadHandler}
                         >
                              دانلود لیست تمام درس ها در قالب PDF
                         </button>
                    </div>
               </div>
          </div>
     )
}
