"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2500}
      hideProgressBar
      newestOnTop
      closeOnClick
      draggable={false}
      pauseOnHover={false}
      theme="light"
      style={{
        fontSize: "14px",
        fontWeight: 500,
        borderRadius: "8px",
        padding: "10px 16px",
      }}
    />
  );
}
