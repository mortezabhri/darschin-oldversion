import { useState, useEffect } from "react"
import Modal from "../components/Modal";
import TimeSelector from "../components/time-selector/TimePicker";
import { useSettings, SettingsContextTypes } from "../contexts/Settings";
import Counter from "../utils/Counter";
import { notifyError, notifySuccess } from "../utils/Tostify";
import { Add, Get } from "../utils/Storage";
import Random from "../utils/Random";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function sidebar({ rerendering }) {

       const { settings, dispatch } = useSettings();
       const { pathname } = useLocation();

       const [lesson, setLesson] = useState(null);
       const [description, setDescription] = useState(null);
       const [selectValue, setSelectValue] = useState(0);
       const [counterClick, setCounterClick] = useState(0);

       const [open, setOpen] = useState(false);
       const [openSetting, setOpenSetting] = useState(false);
       const [openAddPlan, setOpenAddPlan] = useState(false);

       return (
              <>
                     <section className="relative top-0 left-0 z-7">
                            {/* hamber icon */}
                            <div className="w-fit p-2 cursor-pointer" onClick={() => setOpen(prev => !prev)}>
                                   <svg xmlns="http://www.w3.org/2000/svg" className="size-12" viewBox="0 0 24 24" fill="none">
                                          <path d="M4 6H20M4 12H14M4 18H9" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                   </svg>
                            </div>
                            {/* content */}
                            <div style={{ position: window.innerWidth > 500 ? "absolute" : "fixed" }} className={`${open ? "translate-x-0" : "-translate-x-12/12"} h-screen w-10/12 bg-white top-0 left-0 transition-all ease-emphasized duration-300`}  >
                                   <svg className="size-12 absolute top-0 right-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setOpen(prev => !prev)}>
                                          <path d="M12 20.4C10.8969 20.4 9.80459 20.1827 8.78546 19.7606C7.76632 19.3384 6.84031 18.7197 6.0603 17.9397C5.28029 17.1597 4.66155 16.2337 4.23941 15.2145C3.81727 14.1954 3.6 13.1031 3.6 12C3.6 10.8969 3.81727 9.80459 4.23941 8.78546C4.66155 7.76632 5.28029 6.84031 6.0603 6.0603C6.84032 5.28029 7.76633 4.66155 8.78546 4.23941C9.8046 3.81727 10.8969 3.6 12 3.6C13.1031 3.6 14.1954 3.81727 15.2145 4.23941C16.2337 4.66155 17.1597 5.28029 17.9397 6.0603C18.7197 6.84032 19.3384 7.76633 19.7606 8.78546C20.1827 9.8046 20.4 10.8969 20.4 12C20.4 13.1031 20.1827 14.1954 19.7606 15.2145C19.3384 16.2337 18.7197 17.1597 17.9397 17.9397C17.1597 18.7197 16.2337 19.3384 15.2145 19.7606C14.1954 20.1827 13.1031 20.4 12 20.4L12 20.4Z" stroke="#2A4157" strokeOpacity="0.24" strokeWidth="1.2" />
                                          <path d="M9 9L15 15" stroke="#222222" strokeWidth="1.2" strokeLinecap="round" />
                                          <path d="M15 9L9 15" stroke="#222222" strokeWidth="1.2" strokeLinecap="round" />
                                   </svg>
                                   <div className="w-full font-morabba">
                                          <div className="w-full h-38 text-2xl flex justify-center " dir="rtl">
                                                 <h1 className="font-ghaf flex justify-center items-center text-3xl">با</h1>
                                                 <img src="./public/logos/DarsChinLogo-Black.png" className="object-cover -mr-3" alt="" />
                                                 <h1 className="font-ghaf flex justify-center items-center text-3xl -mr-4">به درسات نظم بده</h1>
                                          </div>
                                          <div className="w-full flex flex-col items-center justify-center gap-y-6 text-xl h-full -mt-4" dir="rtl">
                                                 {/* today plans */}
                                                 <Link
                                                        onClick={() => setOpen(prev => !prev)}
                                                        to="/"
                                                        className="inline-block w-8/10 cursor-pointer bg-neutral-200 shadow-xl py-2 rounded-lg text-center"
                                                 >
                                                        برنامه امروز
                                                 </Link>
                                                 {/* change settings */}
                                                 <button className="w-8/10 cursor-pointer bg-neutral-200 shadow-xl py-2 rounded-lg" onClick={() => setOpenSetting(prev => !prev)}>تنظیم تایم روز</button>
                                                 <Modal isOpen={openSetting} onClose={() => setOpenSetting(prev => !prev)}>
                                                        <div className="w-full rounded-xl bg-white mx-auto">
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
                                                 <button className="w-8/10 cursor-pointer bg-neutral-200 shadow-xl py-2 rounded-lg" onClick={() => setOpenAddPlan(prev => !prev)}>افزودن درس جدید</button>
                                                 <Modal isOpen={openAddPlan} onClose={() => setOpenAddPlan(prev => !prev)}>
                                                        <div className="w-full rounded-xl bg-white mx-auto" dir="rtl">
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
                                                                                    className="block w-full rounded-md border-1 outline-1 outline-neutral-300 border-neutral-300 bg-white px-3 py-2 shadow-sm focus:border-secondary focus:outline-secondary">
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
                                                        className="inline-block w-8/10 cursor-pointer bg-neutral-200 shadow-xl py-2 rounded-lg text-center"
                                                 >
                                                        نمایش تمام درس ها
                                                 </Link>
                                                 {/* FAQ */}
                                                 <Link
                                                        to="/faq"
                                                        className="w-8/10 cursor-pointer bg-neutral-200 shadow-xl py-2 rounded-lg text-center"
                                                        onClick={() => setOpen(prev => !prev)}
                                                 >
                                                        سوالات متداول</Link>
                                                 {/* download pdf */}
                                                 <button className="w-8/10 cursor-pointer bg-neutral-200 shadow-xl py-2 rounded-lg opacity-65" onClick={() => {
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
