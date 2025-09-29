import React, { useState } from 'react'
import Table from '../components/Table'

export default function TotalPlans() {

       const NumberOfDaysOfTheWeek = [
              0,
              1,
              2,
              3,
              4,
              5,
              6
       ]


       return (
              <section className='w-full px-4'>
                     <div className='absolute top-20 left-0 w-full' dir='rtl'>
                            <div className='w-full flex justify-center scale-y-300 scale-x-120'>
                                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                                          <path className='fill-primary' fillOpacity="1" d="M0,0L80,10.7C160,21,320,43,480,80C640,117,800,171,960,192C1120,213,1280,203,1360,197.3L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
                                   </svg>
                            </div>
                            <h1 className='absolute -top-4 right-0 mr-2 xsl:mr-4 text-2xl font-morabba-bold'>لیست تمام درس ها</h1>
                     </div>
                     <div className='mt-38 flex flex-col gap-y-8 pb-8'>
                            {
                                   NumberOfDaysOfTheWeek.map(item => (
                                          <Table day={item} key={item} />
                                   ))
                            }
                     </div>
                     <div className="absolute -bottom-0 w-full px-4" dir='rtl'>
                            <p className='text-sm font-morabba text-left dark:text-white' >
                                   ساخته شده با💛 توسط <a target={'_blank'} href='http://mbahri.ir' className='font-gothic-bold underline'>MBahri.ir</a>
                            </p>
                     </div>
              </section>
       )
}
