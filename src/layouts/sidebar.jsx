import { useState, useEffect } from "react"
import Modal from "../components/Modal";
import TimeSelector from "../components/time-selector/TimePicker";
import { useSettings, SettingsContextTypes } from "../contexts/Settings";
import Counter from "../utils/Counter";
import { notifyError, notifySuccess } from "../utils/Tostify";
import { Add, Get } from "../utils/Storage";
import Random from "../utils/Random";
import { Link } from "react-router-dom";

export default function sidebar({ rerendering }) {

       const { settings, dispatch } = useSettings();

       const [lesson, setLesson] = useState(null);
       const [description, setDescription] = useState(null);
       const [selectValue, setSelectValue] = useState(0);
       const [counterClick, setCounterClick] = useState(0);

       const [open, setOpen] = useState(false);
       const [openSetting, setOpenSetting] = useState(false);
       const [openAddPlan, setOpenAddPlan] = useState(false);
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
              <>
                     <section className="relative top-0 left-0 z-7">
                            {/* hamber icon */}
                            <div className="w-fit p-2 cursor-pointer" onClick={() => setOpen(prev => !prev)}>
                                   <svg xmlns="http://www.w3.org/2000/svg" className="size-12" viewBox="0 0 24 24" fill="none">
                                          <path d="M4 6H20M4 12H14M4 18H9" className="stroke-neutral-900 dark:stroke-neutral-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                   </svg>
                            </div>
                            {/* content */}
                            <div style={{ position: window.innerWidth > 500 ? "absolute" : "fixed" }} className={`${open ? "translate-x-0" : "-translate-x-12/12"} h-screen w-10/12 bg-white dark:bg-neutral-700 top-0 left-0 transition-all ease-emphasized duration-300`}  >
                                   <svg className="size-12 absolute top-0 right-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setOpen(prev => !prev)}>
                                          <path d="M12 20.4C10.8969 20.4 9.80459 20.1827 8.78546 19.7606C7.76632 19.3384 6.84031 18.7197 6.0603 17.9397C5.28029 17.1597 4.66155 16.2337 4.23941 15.2145C3.81727 14.1954 3.6 13.1031 3.6 12C3.6 10.8969 3.81727 9.80459 4.23941 8.78546C4.66155 7.76632 5.28029 6.84031 6.0603 6.0603C6.84032 5.28029 7.76633 4.66155 8.78546 4.23941C9.8046 3.81727 10.8969 3.6 12 3.6C13.1031 3.6 14.1954 3.81727 15.2145 4.23941C16.2337 4.66155 17.1597 5.28029 17.9397 6.0603C18.7197 6.84032 19.3384 7.76633 19.7606 8.78546C20.1827 9.8046 20.4 10.8969 20.4 12C20.4 13.1031 20.1827 14.1954 19.7606 15.2145C19.3384 16.2337 18.7197 17.1597 17.9397 17.9397C17.1597 18.7197 16.2337 19.3384 15.2145 19.7606C14.1954 20.1827 13.1031 20.4 12 20.4L12 20.4Z" stroke="#2A4157" strokeOpacity="0.24" strokeWidth="1.2" />
                                          <path d="M9 9L15 15" stroke="#222222" strokeWidth="1.2" strokeLinecap="round" />
                                          <path d="M15 9L9 15" stroke="#222222" strokeWidth="1.2" strokeLinecap="round" />
                                   </svg>
                                   <div className="w-full font-morabba">
                                          {/* logo */}
                                          <div className="w-full h-38 text-2xl flex justify-center " dir="rtl">
                                                 <h1 className="font-ghaf flex justify-center items-center text-3xl text-black dark:text-white">با</h1>
                                                 <img src={`${Get("them") === "dark" ? "./public/logos/DarsChinLogo-White.png" : "./public/logos/DarsChinLogo-Black.png"}`} className="object-cover -mr-3" alt="" />
                                                 <h1 className="font-ghaf flex justify-center items-center text-3xl -mr-4 text-black dark:text-white">به درسات نظم بده</h1>
                                          </div>
                                          <div className="w-full flex flex-col items-center justify-center gap-y-6 text-xl h-full -mt-4" dir="rtl">
                                                 {/* today plans */}
                                                 <Link
                                                        onClick={() => setOpen(prev => !prev)}
                                                        to="/"
                                                        className="inline-block w-8/10 cursor-pointer bg-neutral-200 dark:bg-neutral-400 shadow-xl py-2 rounded-lg text-center"
                                                 >
                                                        برنامه امروز
                                                 </Link>
                                                 {/* change settings */}
                                                 <button className="w-8/10 cursor-pointer bg-neutral-200 dark:bg-neutral-400 shadow-xl py-2 rounded-lg" onClick={() => setOpenSetting(prev => !prev)}>تنظیم تایم روز</button>
                                                 <Modal isOpen={openSetting} onClose={() => setOpenSetting(prev => !prev)}>
                                                        <div className="w-full rounded-xl bg-white dark:bg-neutral-700 mx-auto">
                                                               <h1 className="w-full py-6 text-center font-morabba-bold text-2xl">تنظیم تایم روز</h1>
                                                               <div className="w-full h-50 ">
                                                                      <TimeSelector
                                                                             callback={(e) => {
                                                                                    dispatch({ type: SettingsContextTypes.CHANGE_HOURS, startHour: e.from, endHour: e.to });
                                                                                    setOpen(false);
                                                                                    setOpenSetting(false);
                                                                                    notifySuccess("عملیات موفقیت آمیز بود");
                                                                             }}
                                                                             defaultStart={settings.startHour}
                                                                             defaultEnd={settings.endHour}
                                                                      />
                                                               </div>
                                                        </div>
                                                 </Modal>
                                                 {/* add plan */}
                                                 <button className="w-8/10 cursor-pointer bg-neutral-200 dark:bg-neutral-400 shadow-xl py-2 rounded-lg" onClick={() => setOpenAddPlan(prev => !prev)}>افزودن درس جدید</button>
                                                 <Modal isOpen={openAddPlan} onClose={() => setOpenAddPlan(prev => !prev)}>
                                                        <div className="w-full rounded-xl bg-white dark:bg-neutral-700 mx-auto" dir="rtl">
                                                               <h1 className="w-full py-6 text-center font-morabba-bold text-3xl">افزودن درس جدید</h1>
                                                               <div className="py-4">
                                                                      {/* name */}
                                                                      <div className="w-full font-morabba mb-2">
                                                                             <label htmlFor="name" className="block mb-2 ">
                                                                                    نام درس
                                                                             </label>
                                                                             <input
                                                                                    autoComplete="off"
                                                                                    onChange={e => setLesson(e.target.value)}
                                                                                    defaultValue={lesson}
                                                                                    id="name" type="text" placeholder="برنامه سازی" className="w-full py-2 transition-all outline outline-neutral-300 text-base rounded text-gray-900 placeholder:text-gray-400 focus:outline-secondary focus:outline-1 px-2" />
                                                                      </div>
                                                                      {/* desc */}
                                                                      <div className="w-full font-morabba mb-2">
                                                                             <label htmlFor="name" className="block mb-2 ">
                                                                                    توضیحات
                                                                             </label>
                                                                             <input
                                                                                    autoComplete="off"
                                                                                    onChange={e => setDescription(e.target.value)}
                                                                                    defaultValue={description}
                                                                                    id="name" type="text" placeholder="کلاس 1112 ، طبقه دوم" className="w-full py-2 transition-all outline outline-neutral-300 text-base rounded text-gray-900 placeholder:text-gray-400 focus:outline-secondary focus:outline-1 px-2" />
                                                                      </div>
                                                                      {/* select box */}
                                                                      <div className="w-full font-morabba">
                                                                             <label htmlFor="simple-select" className="block mb-2 ">
                                                                                    انتخاب روز هفته
                                                                             </label>
                                                                             <select id="simple-select"
                                                                                    defaultValue={selectValue}
                                                                                    onChange={e => setSelectValue(e.target.value)}
                                                                                    className="block w-full rounded-md border-1 outline-1 outline-neutral-300 border-neutral-300 bg-white dark:bg-neutral-700 px-3 py-2 shadow-sm focus:border-secondary focus:outline-secondary">
                                                                                    <option value={0}>شنبه</option>
                                                                                    <option value={1}>یکشنبه</option>
                                                                                    <option value={2}>دوشنبه</option>
                                                                                    <option value={3}>سه شنبه</option>
                                                                                    <option value={4}>چهار شنبه</option>
                                                                                    <option value={5}>پنج شنبه</option>
                                                                                    <option value={6}>جمعه</option>
                                                                             </select>
                                                                      </div>
                                                               </div>
                                                               <div className="w-full h-50 ">
                                                                      <TimeSelector
                                                                             callback={e => {
                                                                                    if (!lesson || !description) {
                                                                                           notifyError("ابتدا فیلد ها رو پر کنید");
                                                                                           return;
                                                                                    }
                                                                                    const data = {
                                                                                           start: e.from,
                                                                                           end: e.to,
                                                                                           day: selectValue,
                                                                                           lesson: lesson,
                                                                                           description: description,
                                                                                           hours: Counter(e.from, e.to).length,
                                                                                           id: Random((Get("plans") ?? []))
                                                                                    };
                                                                                    const lastPlans = Get("plans");
                                                                                    if (lastPlans) {
                                                                                           Add("plans", [
                                                                                                  ...lastPlans,
                                                                                                  data
                                                                                           ])
                                                                                    } else {
                                                                                           Add("plans", [data]);
                                                                                    }
                                                                                    notifySuccess("عملیات موفقیت آمیز بود");
                                                                                    rerendering();
                                                                             }}
                                                                             defaultStart="08"
                                                                             defaultEnd="10"
                                                                      />
                                                               </div>
                                                        </div>
                                                 </Modal>
                                                 {/* all plans */}
                                                 <Link
                                                        onClick={() => setOpen(prev => !prev)}
                                                        to="/plans"
                                                        className="inline-block w-8/10 cursor-pointer bg-neutral-200 dark:bg-neutral-400 shadow-xl py-2 rounded-lg text-center"
                                                 >
                                                        نمایش تمام درس ها
                                                 </Link>
                                                 {/* FAQ */}
                                                 <Link
                                                        to="/faq"
                                                        className="w-8/10 cursor-pointer bg-neutral-200 dark:bg-neutral-400 shadow-xl py-2 rounded-lg text-center"
                                                        onClick={() => setOpen(prev => !prev)}
                                                 >
                                                        سوالات متداول
                                                 </Link>
                                                 {/* change mode */}
                                                 <button
                                                        onClick={() => {
                                                               setMode(prev => prev === "light" ? "dark" : "light");
                                                               Add("them", mode === "light" ? "dark" : "light");
                                                        }}
                                                        className="w-8/10 cursor-pointer bg-neutral-200 dark:bg-neutral-400 shadow-xl py-2 rounded-lg gap-x-2 flex justify-center items-center"
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
                                                 {/* download pdf */}
                                                 <button className="w-8/10 cursor-pointer bg-neutral-200 shadow-xl py-2 rounded-lg opacity-70 dark:opacity-45" onClick={() => {
                                                        switch (counterClick) {
                                                               case 0: setCounterClick(prev => prev + 1); return notifySuccess("نوشتم بزودی گلم :)");
                                                               case 1: setCounterClick(prev => prev + 1); return notifySuccess("آقااا ، نوشتم بزودی 😐");
                                                               case 2: setCounterClick(prev => prev + 1); return notifySuccess("مثل اینکه ول کن نیستی! 😡");
                                                               case 3: setCounterClick(prev => prev + 1); return notifySuccess("نمیخوای بس کنی؟!🤬");
                                                               case 4: setCounterClick(prev => prev + 1); return notifySuccess(" دستت عادت کرده ها، لُرد همستر 😂");
                                                               case 5: setCounterClick(prev => prev + 1); return notifySuccess("اصلا بیخیال!همینطوری ادامه بده");
                                                        }
                                                 }}>
                                                        دانلودلیست تمام درس ها در قالب PDF (بزودی)
                                                 </button>
                                          </div>
                                   </div>
                            </div>
                     </section>
                     {/* bg dark */}
                     <div className={`${open ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-all ease-emphasized duration-300 backdrop-blur-sm absolute top-0 left-0 w-screen h-full bg-black/50 z-3`} onClick={() => setOpen(prev => !prev)}></div>
              </>
       )
}
