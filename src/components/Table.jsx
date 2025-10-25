import { Add, Get } from "../utils/Storage";
import { useSettings } from "../contexts/Settings";
import Random from "../utils/Random";
import { notifyError, notifySuccess } from "../utils/Tostify";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import Badge from "./badge";
import { formatDatePlusDaysFrom } from "../utils/getDateToday";
import { GetNextWeekDateRange, GetThisWeekDateRange } from "../utils/GetWeekRange";
// import { getWeekSaturdayToFriday } from "../utils/GetWeekRange";
import { usePlans, PlanTypeContext } from "../contexts/Plans";
import HamberMenu from "../components/HamberMenu";
import Counter from "../utils/Counter";
import TimeSelector from "../components/time-selector/TimePicker";

export default function ({ day }) {

     // DELETE MODAL CONTENT
     const [showDeleteModal, setShowDeleteModal] = useState(false);
     const [deleteID, setDeleteID] = useState(null);
     // DESCRIPTION MODAL CONTENT
     const [openDescription, setOpenDescription] = useState(false);
     const [description, setDescription] = useState(null);
     //BADGE MODAL
     const [openBadge, setOpenBadge] = useState(false); // open modal badge create
     const [titleBadeg, setTitleBadeg] = useState(null); // title input
     const [descBadeg, setDescBadeg] = useState(null); // desc input
     const [idBadge, setIdBadge] = useState(null); // id badge clicked
     const [dateBadge, setDateBadge] = useState("all"); // when badge showing (radio buttons)
     const inputChars = useRef();
     const thisWeek = GetThisWeekDateRange();
     const nextWeek = GetNextWeekDateRange();
     // OPEN HAMBER MENU
     const [openHamber, setOpenHamber] = useState(0);
     // EDIT PLAN
     const [openEditModal, setOpenEditModal] = useState(false);
     const [editLesson, seteditLesson] = useState(null);
     const [editPlanID, setEditPlanID] = useState(null);
     const [editDescription, setEditDescription] = useState(null);
     const [editSelectValue, setEditSelectValue] = useState(0);
     const [defaultStartTimeEditPlan, setDefaultStartTimeEditPlan] = useState(0)
     const [defaultEndTimeEditPlan, setDefaultEndTimeEditPlan] = useState(0)
     // CUTTED PLANS
     const [cuttedPlans, setCuttedPlans] = useState([])

     const { plans_context, dispatch_Plan_Context } = usePlans();

     const handleEditPlan = (planID) => {
          const plan = Get("plans").filter(item => item.id === planID)[0]
          seteditLesson(plan.lesson)
          setEditDescription(plan.description)
          setEditSelectValue(plan.day)
          setDefaultStartTimeEditPlan(plan.start)
          setDefaultEndTimeEditPlan(plan.end)
          setEditPlanID(planID)
          setOpenEditModal(prev => !prev)
     }

     const daysOfWeek = [
          "شنبه",
          "یک شنبه",
          "دو شنبه",
          "سه شنبه",
          "چهار شنبه",
          "پنج شنبه",
          "جمعه",
     ]

     const { settings } = useSettings();
     const findFreeTimes2 = useCallback((startTime, endTime, busyTimes, day) => {
          // sorting with time
          busyTimes.sort((a, b) => a.start - b.start);

          let freeTimes = [];
          let current = Number(startTime);

          for (let i = 0; i < busyTimes.length; i++) {
               let busy = busyTimes[i];

               // out of time rang
               if (Number(busy.start) < Number(startTime) || Number(busy.end) > Number(endTime)) {
                    dispatch_Plan_Context({
                         type: PlanTypeContext.DELETE_PLAN,
                         planID: busy.id
                    })
                    notifyError("درس وارد شده بدلیل خارج بودن محدوده زمانی حذف شد")
                    return;
               }

               // conflict with last data
               if (i > 0 && Number(busy.start) < Number(busyTimes[i - 1].end)) {
                    dispatch_Plan_Context({
                         type: PlanTypeContext.DELETE_PLAN,
                         planID: busy.id
                    })
                    notifyError("درس وارد شده بدلیل تداخل حذف شد")
                    return;
               }

               // remove all spaces between times
               if (Number(busy.start) > current) {
                    freeTimes.push({ name: " ", start: current, end: Number(busy.start), hours: Number(busy.start) - current, day, id: Random(Get("plans")) });
               }

               current = Number(busy.end);
          }

          // remove all spaces from last data
          if (current < endTime) {
               freeTimes.push({ name: " ", start: current, end: endTime, hours: endTime - current, day, id: Random(Get("plans")) });
          }

          return freeTimes;
     })
     // get all plan from localstorage (in context)
     // let cuttedPlans = [];
     let plans = [];
     useEffect(() => {
          plans = plans_context
          if (plans) {
               plans = plans.filter(item => Number(item.day) === Number(day));// GET TODAY NUMBER OF THE WEEK
               const emptyPlansPlusWithAllPlans = plans && plans.concat(findFreeTimes2(settings.startHour, settings.endHour, plans, day))
               setCuttedPlans(emptyPlansPlusWithAllPlans.filter(Boolean))
          };
     }, [plans_context])

     //badge functions
     const approvedBadge = () => {
          //Empty errors
          if (titleBadeg === null) {
               notifyError("فیلد نام لازمه!");
               return;
          }
          const allPlansWithoutThisID = Get("plans").filter(item => item.id !== idBadge);
          const thisID = Get("plans").filter(item => item.id === idBadge)[0];

          // maximum length badges
          let countBadgesInDay = 0;
          let countBadgesInDay_nextWeek = 0;
          // date === "this week" or "all days"
          if (thisID.badges && (dateBadge === "all" || thisWeek.includes(dateBadge))) {
               countBadgesInDay = thisID.badges.filter(item => thisWeek.includes(item.date)).length + thisID.badges.filter(item => item.date === "all").length;
          }
          // date === "next week"
          if (thisID.badges && (dateBadge === "all" || nextWeek.includes(dateBadge))) {
               countBadgesInDay_nextWeek = thisID.badges.filter(item => nextWeek.includes(item.date)).length + thisID.badges.filter(item => item.date === "all").length;
          }

          if (countBadgesInDay >= 3) {
               notifyError("تعداد برچسب ها باید کمتر از 3 تا باشه")
               return;
          }
          if (countBadgesInDay_nextWeek >= 3) {
               notifyError("تعداد برچسب های هفته بعدت هم باید کمتر از 3 تا باشه")
               return;
          }

          const thisBadge = {
               name: titleBadeg,
               description: descBadeg,
               date: dateBadge,
               id: Math.floor(Math.random() * thisID.id)
          }

          let badges = [];
          if (thisID.badges) {
               badges = thisID.badges;
               badges.push(thisBadge);
          } else {
               badges.push(thisBadge);
          }
          allPlansWithoutThisID.push({
               ...thisID,
               badges
          })
          dispatch_Plan_Context({
               type: PlanTypeContext.ADD_FULL_DATA_PLAN,
               fullData: allPlansWithoutThisID
          })
          notifySuccess("برچسب افزوده شد");
          setOpenBadge(false);
          setDateBadge(null)
          setIdBadge(null);
          setTitleBadeg(null)
          setDescBadeg(null)
     }

     useEffect(() => {
          if (inputChars.current) {
               inputChars.current.textContent = `${titleBadeg.length}/10`
               if (titleBadeg.length >= 10) {
                    inputChars.current.classList.add("text-red-900-m")
               } else {

                    inputChars.current.classList.remove("text-red-900-m")
               }
          }
     }, [titleBadeg])

     // console.log(formatDatePlusDaysFrom(new Date().toLocaleDateString(), 7))
     // console.log(getWeekSaturdayToFriday("2025/10/19"))
     // console.log(getWeekSaturdayToFriday())
     // console.log(formatDatePlusDaysFrom(new Date()))
     // console.log(idBadge  )

     return (
          <>
               {/* DELETE MODAL */}
               <Modal onClose={() => setShowDeleteModal(prev => !prev)} isOpen={showDeleteModal} >
                    <h1 className="w-full py-4 px-2 text-2xl font-morabba text-center text-red-500">
                         آیا از حذف این درس اطمینان دارید؟
                    </h1>
                    <div className="py-4 flex justify-center gap-x-2">
                         <button className="w-3/10 p-2 bg-red-300 dark:text-black rounded-xl font-morabba cursor-pointer" onClick={() => setShowDeleteModal(prev => !prev)}>منصرف شدم</button>
                         <button onClick={() => {
                              dispatch_Plan_Context({
                                   type: PlanTypeContext.DELETE_PLAN,
                                   planID: deleteID
                              })
                              setShowDeleteModal(prev => !prev);
                         }} className="cursor-pointer w-7/10 p-2 bg-green-300 rounded-xl font-morabba dark:text-black">آره ، حذفش کن</button>
                    </div>
               </Modal>
               {/* BADEG MODAL (CREATE)*/}
               <Modal onClose={() => setOpenBadge(prev => !prev)} isOpen={openBadge}>
                    <h1 className="w-full pt-4 pb-6 px-2 text-2xl font-morabba text-center text-amber-600" dir="rtl">
                         ایجاد برچسب جدید برای {(idBadge && Get("plans").filter(item => item.id === idBadge)) && Get("plans").filter(item => item.id === idBadge)[0].lesson}
                    </h1>
                    <div className="w-full">
                         <div className="w-full font-morabba mb-2" dir="rtl">
                              <label htmlFor="name" className="block mb-2 ">
                                   نام برچسب *
                              </label>
                              <input
                                   maxLength={10}
                                   autoComplete="off"
                                   onChange={e => setTitleBadeg(e.target.value)}
                                   defaultValue={titleBadeg}
                                   type="text" placeholder="20 د ، تاخیر" className="w-full py-2 transition-all outline outline-neutral-300 text-base rounded text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 focus:outline-secondary focus:outline-1 px-2"
                              />
                              <span className="mt-2 inline-block" ref={inputChars}>0/10</span>
                         </div>
                         <div className="w-full font-morabba mb-6" dir="rtl">
                              <label htmlFor="name" className="block mb-2 ">
                                   توضیحات برچسب
                              </label>
                              <input
                                   autoComplete="off"
                                   onChange={e => setDescBadeg(e.target.value)}
                                   defaultValue={descBadeg}
                                   type="text" placeholder="20 دقیقه تاخیر در شروع کلاس" className="w-full py-2 transition-all outline outline-neutral-300 text-base rounded text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 focus:outline-secondary focus:outline-1 px-2"
                              />
                         </div>
                         <div className="w-full font-morabba mb-2" dir="rtl">
                              <label htmlFor="name" className="block mb-2 ">
                                   تاریخ اعمال برچسب
                              </label>
                              <div className="py-1 w-full flex justify-start gap-x-10 items-center">
                                   <div className="flex gap-x-2">
                                        <label htmlFor="1">این هفته</label>
                                        <input type="radio" name="okTime" id="1" onChange={() => setDateBadge(formatDatePlusDaysFrom(new Date().toLocaleDateString()))} />
                                   </div>
                                   <div className="flex gap-x-2">
                                        <label htmlFor="2">هفته بعد</label>
                                        <input type="radio" name="okTime" id="2" onChange={() => setDateBadge(formatDatePlusDaysFrom(new Date().toLocaleDateString(), 7))} />
                                   </div>
                                   <div className="flex gap-x-2">
                                        <label htmlFor="3">همه هفته ها</label>
                                        <input type="radio" defaultChecked name="okTime" id="3" onChange={() => setDateBadge("all")} />
                                   </div>
                              </div>
                         </div>
                         <button
                              onClick={() => approvedBadge()}
                              className="mt-6 w-full bg-green-300 py-1.5 text-center font-morabba text-base text-black rounded-lg cursor-pointer">تایید</button>
                    </div>
               </Modal>
               {/* DESCRIPTION MODAL */}
               <Modal onClose={() => setOpenDescription(prev => !prev)} isOpen={openDescription} >
                    <div className="w-full p-4 text-center text-2xl font-morabba">
                         {description}
                    </div>
               </Modal>
               {/* EDIT PLAN MODAL */}
               <Modal isOpen={openEditModal} onClose={() => setOpenEditModal(prev => !prev)}>
                    <div className="w-full rounded-xl bg-white dark:bg-neutral-700 mx-auto" dir="rtl">
                         <h1 className="w-full pt-4 text-center font-morabba-bold text-2xl">ویرایش در س {editLesson}</h1>
                         <div className="py-4">
                              {/* name */}
                              <div className="w-full font-morabba mb-2">
                                   <label htmlFor="name" className="block mb-2 ">
                                        نام درس
                                   </label>
                                   <input
                                        autoComplete="off"
                                        onChange={e => seteditLesson(e.target.value)}
                                        defaultValue={editLesson}
                                        id="name" type="text" placeholder="برنامه سازی" className="w-full py-2 transition-all outline outline-neutral-300 text-base rounded text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 focus:outline-secondary focus:outline-1 px-2" />
                              </div>
                              {/* desc */}
                              <div className="w-full font-morabba mb-2">
                                   <label htmlFor="name" className="block mb-2 ">
                                        توضیحات
                                   </label>
                                   <input
                                        autoComplete="off"
                                        onChange={e => setEditDescription(e.target.value)}
                                        defaultValue={editDescription}
                                        id="name" type="text" placeholder="کلاس 1112 ، طبقه دوم" className="w-full py-2 transition-all outline outline-neutral-300 text-base rounded text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 focus:outline-secondary focus:outline-1 px-2" />
                              </div>
                              {/* select box */}
                              <div className="w-full font-morabba">
                                   <label htmlFor="simple-select" className="block mb-2 ">
                                        انتخاب روز هفته
                                   </label>
                                   <select id="simple-select"
                                        defaultValue={editSelectValue}
                                        onChange={e => setEditSelectValue(e.target.value)}
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
                                        //show empty error
                                        if (!editLesson || !editDescription) {
                                             notifyError("ابتدا فیلد ها رو پر کنید");
                                             return;
                                        }
                                        //saving data
                                        const data = {
                                             start: e.from,
                                             end: e.to,
                                             day: editSelectValue,
                                             lesson: editLesson,
                                             description: editDescription,
                                             hours: Counter(e.from, e.to).length,
                                             id: Random((Get("plans") ?? []))
                                        };

                                        // console.log(data)
                                        // return

                                        //add plan
                                        dispatch_Plan_Context({
                                             type: PlanTypeContext.EDIT_PLAN,
                                             planId: editPlanID,
                                             editingData: data
                                        })

                                        setOpenEditModal(false);

                                   }}
                                   defaultStart={defaultStartTimeEditPlan}
                                   defaultEnd={defaultEndTimeEditPlan}
                              />
                         </div>
                    </div>
               </Modal>
               {/* CONTENT */}
               <div className="w-full overflow-hidden relative">
                    {/* today */}
                    <h1 className="w-full border border-b-0 border-neutral-300 rounded-t-2xl py-3 text-center text-2xl font-morabba-bold bg-neutral-300 dark:bg-secondary dark:border-neutral-400 dark:text-white">
                         {daysOfWeek[Number(day)]}
                         <HamberMenu
                              onClose={() => setOpenHamber(prev => !prev)}
                              open={openHamber}
                              className="absolute top-[18px] left-3"
                         />
                    </h1>

                    {/* wattermark in pdf */}
                    {
                         Get("download_pdf_handler") && (
                              <div
                              style={{
                                   transform : "rotate(45deg)"
                              }} 
                              className="absolute top-1/2 -translate-1/2 left-1/2 z-9999 text-4xl w-[20rem] pointer-events-none opacity-10">
                                   <p className="text-black dark:text-white">dars-chin.mbahri.ir</p>
                              </div>
                         )
                    }

                    {/* plans */}
                    <div className="w-full flex" dir="rtl">
                         {/* times */}
                         <div className="w-1/6 border border-t-0 border-neutral-300 dark:border-neutral-500">
                              {
                                   settings.counter.map(item => (
                                        <div key={Math.random() * 10000} className="h-12 border-t border-neutral-300 dark:border-neutral-500 flex justify-center items-center font-gothic dark:text-white">
                                             {item}
                                        </div>
                                   ))
                              }
                         </div>
                         {/* plans */}
                         <div className="w-full border-t border-neutral-300 dark:border-neutral-500 font-morabba">

                              {
                                   settings.counter.map(time => (
                                        cuttedPlans.map(plan => (
                                             (time === Number(plan.start) && Number(plan.day) === day) && (
                                                  <div
                                                       key={plan.id}
                                                       style={{
                                                            height: (plan.hours * 3) + "rem"
                                                       }}
                                                       className={`${plan.lesson && "bg-green-100 dark:bg-neutral-500"} dark:text-white relative border border-t-0 border-r-0 border-neutral-300 dark:border-neutral-500 dark:border-b-neutral-500 flex justify-center items-center `}
                                                  >

                                                       {plan.lesson && (
                                                            <>
                                                                 {/* hamber menu  */}
                                                                 <div className={`${openHamber ? "w-32" : "w-0"} overflow-hidden flex transition-all h-8 absolute top-0 left-0`}>
                                                                      {/* options */}
                                                                      <div className="w-28 h-8 ">
                                                                           {/* delete plan */}
                                                                           <svg
                                                                                data-plan-id={plan.id}
                                                                                onClick={(e) => {
                                                                                     setDeleteID(e.currentTarget.dataset.planId);
                                                                                     setShowDeleteModal(prev => !prev);
                                                                                }}
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                className="size-6 absolute top-2 left-4 stroke-red-400 cursor-pointer" viewBox="0 0 24 24" fill="none">
                                                                                <g>
                                                                                     <path id="Vector" d="M14 16H20M21 10V9C21 7.89543 20.1046 7 19 7H5C3.89543 7 3 7.89543 3 9V11C3 12.1046 3.89543 13 5 13H11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                </g>
                                                                           </svg>
                                                                           {/* badge create */}
                                                                           {
                                                                                plan.hours > 1 && (
                                                                                     <svg
                                                                                          onClick={() => {
                                                                                               setIdBadge(plan.id);
                                                                                               setOpenBadge(prev => !prev);
                                                                                          }}
                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                          className="size-6 absolute top-1.5 left-12 stroke-amber-600 cursor-pointer" viewBox="0 0 24 24" fill="none">
                                                                                          <g>
                                                                                               <path id="Vector" d="M5 17H8M8 17H11M8 17V14M8 17V20M14 21H15C16.1046 21 17 20.1046 17 19V5C17 3.89543 16.1046 3 15 3H13C11.8954 3 11 3.89543 11 5V11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                          </g>
                                                                                     </svg>
                                                                                )
                                                                           }
                                                                           {/* edit plan */}
                                                                           <svg
                                                                                onClick={() => handleEditPlan(plan.id)}
                                                                                className="size-6 absolute top-1.5 left-21 stroke-purple-700 cursor-pointer" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                           </svg>
                                                                      </div>
                                                                 </div>
                                                                 {/* title */}
                                                                 <p>{plan.lesson}</p>
                                                                 {/* show info */}
                                                                 <svg
                                                                      onClick={() => {
                                                                           setDescription(plan.description)
                                                                           setOpenDescription(prev => !prev);
                                                                      }}
                                                                      xmlns="http://www.w3.org/2000/svg" className={`${openHamber ? "left-30" : "left-2"} transition-all ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] size-6 absolute top-1.5 stroke-cyan-600 cursor-pointer`} viewBox="0 0 24 24" fill="none">
                                                                      <g>
                                                                           <path id="Vector" d="M12 11V16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 8V8.1L11.9502 8.1002V8H12.0498Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                      </g>
                                                                 </svg>
                                                                 {/* badge show */}
                                                                 {
                                                                      (plan.badges && !Get("download_pdf_handler")) && (
                                                                           <div
                                                                                style={{
                                                                                     transform: "rotate(270deg)"
                                                                                }}
                                                                                className="w-24 h-32 absolute top-1/2 -translate-y-1/2 right-6 flex flex-col justify-end gap-4 items-center overflow-hidden cursor-pointer">
                                                                                {
                                                                                     plan.badges.map(item => {
                                                                                          if (thisWeek.includes(item.date) || item.date === "all") return <Badge key={Math.random() * 100} description={item.description} title={item.name} badgeID={item.id} lessonID={plan.id} />
                                                                                     })
                                                                                }
                                                                           </div>
                                                                      )
                                                                 }
                                                            </>
                                                       )}

                                                  </div>
                                             )
                                        ))
                                   ))
                              }
                         </div>
                    </div>
               </div>
          </>
     )
} 
