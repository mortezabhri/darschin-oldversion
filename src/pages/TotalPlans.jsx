import { useEffect, useRef, useState } from 'react'
import Table from '../components/Table'
import { Del, Get } from '../utils/Storage'
import { toast } from 'react-toastify'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { notifyError } from '../utils/Tostify';

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
     // download pdf
     const downloadPdf = async () => {
          const element = pdfRef.current;

          // گرفتن snapshot از DOM
          const canvas = await html2canvas(element, { scale: 1 });
          const imgData = canvas.toDataURL("image/png");

          // ساخت PDF
          const pdf = new jsPDF("p", "px", "a1");
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();

          const imgWidth = pageWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // اگر تصویر بلندتر از یک صفحه بود، صفحه اضافه کن
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft > 0) {
               position = heightLeft - imgHeight;
               pdf.addPage();
               pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
               heightLeft -= pageHeight;
          }

          // دانلود فایل
          pdf.save("dars-chin.mbahri.ir.pdf");

          // show toast and delete localstorage data (download_pdf_handler)
          const toastLoadID = Get("download_pdf_handler");
          toast.update(toastLoadID, {
               isLoading: false,
               type: "success",
               autoClose: 3000,
               render: "فایل پی دی اف با موفقیت ذخیره شد 👌 "
          })
          Del("download_pdf_handler");

          // update after download pdf
          setUpdateAfterPdf(prev => prev + 1);
     };

     const [updateAfterPdf, setUpdateAfterPdf] = useState(0)
     const counterTableRendering = useRef(0);
     const pdfRef = useRef(null)

     useEffect(() => {
          if (counterTableRendering.current >= 7) {
               if (Get("download_pdf_handler")) {
                    notifyError("برچسب ها در پی دی اف نمایش داده نمیشوند");
                    setTimeout(() => downloadPdf(), 1000)
               }
          }
     }, [counterTableRendering.current])

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
               <div className={`${Get("download_pdf_handler") && "px-6 pt-2 bg-quaternary dark:bg-neutral-700"} mt-38 flex flex-col gap-y-8 pb-8`} ref={pdfRef}>
                    {
                         NumberOfDaysOfTheWeek.map(item => {
                              counterTableRendering.current++;
                              return <Table day={item} key={item} />
                         })
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
