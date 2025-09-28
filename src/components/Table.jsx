import { Add, Get } from "../utils/Storage";
import { useSettings } from "../contexts/Settings";
import Random from "../utils/Random";
import { notifyError, notifySuccess } from "../utils/Tostify";
import { useState } from "react";
import Modal from "./Modal";

export default function Table({ day, updater }) {

       // DELETE MODAL CONTENT
       const [showDeleteModal, setShowDeleteModal] = useState(false);
       const [deleteID, setDeleteID] = useState(null);
       // RERENDERING TABLES
       const [isUpdate, setIsUpdate] = useState(0);
       // DESCRIPTION MODAL CONTENT
       const [openDescription, setOpenDescription] = useState(false);
       const [description, setDescription] = useState(null);

       const daysOfWeek = [
              "شنبه",
              "یک شنبه",
              "دو شنبه",
              "سه شنبه",
              "چهار شنبه",
              "پنج شنبه",
              "جمعه",
       ]
       const deletePlan = id => {
              const otherPlan = Get("plans").filter(item => item.id !== Number(id));
              // console.log(id)
              Add("plans", otherPlan);
              setIsUpdate(prev => prev + 1);
              notifySuccess("تایم مورد نظر با موفقیت حذف شد!");
       }
       const { settings } = useSettings();
       const findFreeTimes2 = (startTime, endTime, busyTimes, day) => {
              // sorting with time
              busyTimes.sort((a, b) => a.start - b.start);

              let freeTimes = [];
              let current = startTime;

              for (let i = 0; i < busyTimes.length; i++) {
                     let busy = busyTimes[i];

                     // out of time rang
                     if (busy.start < startTime || busy.end > endTime) {
                            const allPlans = Get("plans")
                            Add("plans", allPlans.filter(item => item.id !== busy.id))
                            notifyError("درس وارد شده بدلیل خارج بودن محدوده زمانی حذف شد")
                            return;
                            /*
                            console.log(allPlans.filter(item => item.id !== busy.id));
                            console.log(busy.id)
                            throw new Error(`بازه ${busy.start}-${busy.end} خارج از محدوده است`);
                            */
                     }

                     // conflict with last data
                     if (i > 0 && busy.start < busyTimes[i - 1].end) {
                            const allPlans = Get("plans")
                            Add("plans", allPlans.filter(item => item.id !== busy.id))
                            notifyError("درس وارد شده بدلیل تداخل حذف شد")
                            return;
                            /*
                            throw new Error(
                                   `تداخل بین بازه ${busyTimes[i - 1].start}-${busyTimes[i - 1].end} و ${busy.start}-${busy.end}`
                            );
                            */
                     }

                     // remove all spaces between times
                     if (busy.start > current) {
                            freeTimes.push({ name: " ", start: current, end: busy.start, hours: busy.start - current, day, id: Random(Get("plans")) });
                     }

                     current = busy.end;
              }

              // remove all spaces from last data
              if (current < endTime) {
                     freeTimes.push({ name: " ", start: current, end: endTime, hours: endTime - current, day, id: Random(Get("plans")) });
              }

              return freeTimes;
       }
       let cuttedPlans = [];
       let plans = Get("plans");
       if (plans) {
              plans = plans.filter(item => Number(item.day) === Number(day));// GET TODAY NUMBER OF THE WEEK
              cuttedPlans = plans && plans.concat(findFreeTimes2(settings.startHour, settings.endHour, plans, day))
       };

       // console.clear()
       // console.log(Get("plans"))
       // console.log(settings)
       // console.log(plans)
       // console.log(cuttedPlans)

       return (
              <>
                     {/* DELETE MODAL */}
                     <Modal onClose={() => setShowDeleteModal(prev => !prev)} isOpen={showDeleteModal} >
                            <h1 className="w-full py-4 px-2 text-2xl font-morabba text-center text-red-500">
                                   آیا از حذف این تایم اطمینان دارید؟
                            </h1>
                            <div className="py-4 flex justify-center gap-x-2">
                                   <button className="w-3/10 p-2 bg-red-300 rounded-xl font-morabba cursor-pointer" onClick={() => setShowDeleteModal(prev => !prev)}>منصرف شدم</button>
                                   <button onClick={() => {
                                          deletePlan(deleteID);
                                          setShowDeleteModal(prev => !prev);
                                   }} className="cursor-pointer w-7/10 p-2 bg-green-300 rounded-xl font-morabba">آره ، حذفش کن</button>
                            </div>
                     </Modal>
                     {/* DESCRIPTION MODAL */}
                     <Modal onClose={() => setOpenDescription(prev => !prev)} isOpen={openDescription} >
                            <div className="w-full p-4 text-center text-2xl font-morabba">
                                   {description}
                            </div>
                     </Modal>
                     {/* CONTENT */}
                     <div className="w-full overflow-hidden relative">
                            {/* today */}
                            <h1 className="w-full border border-b-0 border-neutral-400 rounded-t-2xl py-3 text-center text-2xl font-morabba-bold bg-neutral-200">
                                   {daysOfWeek[Number(day)]}
                            </h1>
                            {/* plans */}
                            <div className="w-full flex" dir="rtl">
                                   {/* times */}
                                   <div className="w-1/6 border border-t-0 border-neutral-400">
                                          {
                                                 settings.counter.map(item => (
                                                        <div key={Math.random() * 10000} className="h-12 border-t border-neutral-400 flex justify-center items-center font-gothic">
                                                               {item}
                                                        </div>
                                                 ))
                                          }
                                   </div>
                                   {/* plans */}
                                   <div className="w-full border-t border-neutral-400 font-morabba">
                                          {
                                                 settings.counter.map(time => (
                                                        cuttedPlans.map(plan => (
                                                               (time === Number(plan.start) && Number(plan.day) === day) && (
                                                                      <div
                                                                             key={plan.id}
                                                                             style={{
                                                                                    height: (plan.hours * 3) + "rem"
                                                                             }}
                                                                             className={`${plan.lesson && "bg-green-100"} relative border border-t-0 border-r-0 border-neutral-400 flex justify-center items-center `}
                                                                      >
                                                                             {plan.lesson && (
                                                                                    <>
                                                                                           {/* title */}
                                                                                           <p>{plan.lesson}</p>
                                                                                           {/* show info */}
                                                                                           <svg
                                                                                                  onClick={() => {
                                                                                                         setDescription(plan.description)
                                                                                                         setOpenDescription(prev => !prev);
                                                                                                  }}
                                                                                                  xmlns="http://www.w3.org/2000/svg" className="size-6 absolute top-0 left-8 m-2 stroke-cyan-600 cursor-pointer" viewBox="0 0 24 24" fill="none">
                                                                                                  <g>
                                                                                                         <path id="Vector" d="M12 11V16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 8V8.1L11.9502 8.1002V8H12.0498Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                                  </g>
                                                                                           </svg>
                                                                                           {/* delete */}
                                                                                           <svg data-plan-id={plan.id} onClick={(e) => {
                                                                                                  setDeleteID(e.currentTarget.dataset.planId);
                                                                                                  setShowDeleteModal(prev => !prev);
                                                                                           }} xmlns="http://www.w3.org/2000/svg" className="size-6 absolute top-0 left-0 m-2 stroke-red-400 cursor-pointer" viewBox="0 0 24 24" fill="none">
                                                                                                  <g>
                                                                                                         <path id="Vector" d="M14 16H20M21 10V9C21 7.89543 20.1046 7 19 7H5C3.89543 7 3 7.89543 3 9V11C3 12.1046 3.89543 13 5 13H11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                                  </g>
                                                                                           </svg>

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
