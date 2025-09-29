import GetDataToday from "../utils/getDateToday";
import Table from "../components/Table";



export default function Home() {

       return (
              <>
                     <section>
                            {/* circle on top */}
                            <div className="size-36 scale-400 bg-tertiary dark:bg-secondary rounded-full absolute -top-10 left-1/2 -translate-x-1/2 shadow-lg"></div>
                            {/* header */}
                            <header className="w-full h-56 relative -top-2 flex justify-around items-center text-neutral-900 dark:text-neutral-200" dir="rtl">
                                   {/* titles */}
                                   <div>
                                          <h1 className="text-5xl font-morabba-bold">{GetDataToday("weekday")}</h1>
                                          <h4 className="text-2xl mt-4 font-morabba text-center" dir="rtl">{GetDataToday()}</h4>
                                   </div>
                                   {/* icon */}
                                   <div className="relative -translate-y-4">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="size-34" viewBox="0 0 24 24" fill="none">
                                                 <path d="M3 10C3 8.11438 3 7.17157 3.58579 6.58579C4.17157 6 5.11438 6 7 6H17C18.8856 6 19.8284 6 20.4142 6.58579C21 7.17157 21 8.11438 21 10V11H3V10Z" className="stroke-neutral-900 dark:stroke-neutral-200" strokeOpacity="0.24" strokeWidth="1.2" />
                                                 <rect x="3" y="6" width="18" height="15" rx="2" className="stroke-neutral-900 dark:stroke-neutral-200" strokeWidth="1.2" />
                                                 <path d="M7 3L7 8" className="stroke-neutral-900 dark:stroke-neutral-200" strokeWidth="1.2" strokeLinecap="round" />
                                                 <path d="M17 3L17 8" className="stroke-neutral-900 dark:stroke-neutral-200" strokeWidth="1.2" strokeLinecap="round" />
                                          </svg>
                                          <p className="absolute top-19 left-0 w-full text-center font-morabba-bold text-2xl">{GetDataToday("day")} / {GetDataToday("monthNumeric")}</p>
                                   </div>
                            </header>
                            {/* main */}
                            <main className="w-full relative font-morabba px-8 mt-14 mb-8">
                                   <Table day={(new Date().getDay() + 1) % 7} />
                            </main>
                     </section>
              </>
       )
}
