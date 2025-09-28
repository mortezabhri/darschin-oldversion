//------FIRST : PASTE <ToastContainer /> IN JSX COMPONENT------------
import { toast, Flip } from 'react-toastify';

export const notifyError = (msg) => toast.error(msg, {
       position: "top-right",
       autoClose: 2000,
       hideProgressBar: false,
       closeOnClick: true,
       pauseOnHover: false,
       draggable: true,
       progress: undefined,
       theme: "light",
       transition: Flip,
       pauseOnFocusLoss : false,
       className : "!font-morabba border border-neutral-300"
});
export const notifySuccess = (msg) => toast.success(msg, {
       position: "top-right",
       autoClose: 2000,
       hideProgressBar: false,
       closeOnClick: true,
       pauseOnHover: false,
       draggable: true,
       progress: undefined,
       theme: "light",
       transition: Flip,
       pauseOnFocusLoss : false,
       className : "!font-morabba border border-neutral-300"
});