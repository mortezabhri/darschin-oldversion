import { createPortal } from "react-dom";
import { memo, useEffect, useState } from "react";
import { Add, Del, Get } from "../utils/Storage";

const NewVersion = () => {

     // ___SET THIS VERSION___
     const ThisVersion = "1.5.2";

     const [closed, setClosed] = useState(false);

     useEffect(() => {
          // Check version
          if (Get("welcome") === true && (!Get("version") || Get("version") !== ThisVersion)) {
               Del("version");
               Add("version", ThisVersion);
               setClosed(true);
          }
     }, [])

     return (
          closed && (
               <div
                    className="fixed min-w-xs max-w-lg mx-auto inset-0 bg-black/60 flex items-center justify-center z-99999 animate-fadeInBg"
               >
                    <div
                         className="bg-white dark:bg-neutral-700 w-full text-black dark:text-white rounded-t-[5rem] shadow-lg p-6 absolute bottom-0 left-0 animate-fadeIn"
                    >
                         <button
                              className="absolute top-6 right-8 cursor-pointer border rounded-full size-9 text-gray-400 "
                              onClick={() => setClosed(false)}
                         >
                              ✕
                         </button>
                         <div className="w-full font-morabba-bold" dir="rtl">
                              <h1 className="text-center text-2xl py-6"> تغییرات ورژن جدید ({ThisVersion}) </h1>
                              <ul className="font-morabba py-4 text-lg list-disc px-6 space-y-2.5">
                                   <li>
                                        <p>افزودن منو به هر درس با قابلیت های جدید </p>
                                   </li>
                                   <li>
                                        <p>تغییر حالت و مکان منوی کناری</p>
                                   </li>
                                   <li>
                                        <p>قابلیت افزودن برچسب زمان دار به هر درس </p>
                                   </li>
                                   <li>
                                        <p>دریافت فایل PDF تمام درس ها (با کمترین حجم)</p>
                                   </li>
                                   <li>
                                        <p> رفع خطاهای جزیی ، بهینه سازی بهتر و اشغال منابع کمتر</p>
                                   </li>
                              </ul>
                         </div>
                    </div>
               </div>
          )
     );
};

export default memo(NewVersion);
