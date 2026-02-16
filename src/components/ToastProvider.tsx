"use client";

import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#0f172a',
          borderRadius: '1rem',
          fontWeight: 'bold',
          fontSize: '14px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
      }}
    />
  );
};

export default ToastProvider;