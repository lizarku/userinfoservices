'use client';

import React from 'react';
import { toast, ToastContainer as ReactToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function showToast(type: 'info' | 'error' | 'warning', message: string, options?: ToastOptions) {
  switch (type) {
    case 'info':
      toast.info(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'warning':
      toast.warning(message, options);
      break;
    default:
      toast(message, options);
  }
}

export function ToastRoot() {
  return <ReactToastContainer position="top-right" autoClose={2000} />;
} 