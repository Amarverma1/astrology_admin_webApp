// app/lib/toast.ts
import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseConfig: ToastOptions = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  theme: "light",
  style: {
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "8px",
    padding: "10px 16px",
  },
};

export const showSuccess = (msg: string) => toast.success(msg, baseConfig);
export const showError = (msg: string) => toast.error(msg, baseConfig);
export const showInfo = (msg: string) => toast.info(msg, baseConfig);
export const showWarning = (msg: string) => toast.warning(msg, baseConfig);

export { toast };
