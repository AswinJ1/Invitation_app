"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CertificateForm } from "./certificate-form";
import ParticlesBackground from "./ParticlesBackground";

const CertificateFormContainer = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative z-10">
        {/* <ParticlesBackground/> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
        <div className="flex justify-center items-center gap-4 mb-4">
  <img
    src="/amrita.png"
    alt="Logo"
    className="w-40 h-20 object-contain"
  />
  <img
    src="/icpc_foundation.png"
    alt="Logo"
    className="w-48 h-24 object-contain relative -mt-2"
  />
</div>


          <h1 className="text-3xl font-bold text-black mb-2 drop-shadow-lg">
           Verify Invitation          </h1>
          <p className="text-black text-opacity-90">
            Enter your details to verify and download your Invitation Card
          </p>
        </motion.div>

        <motion.div
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="p-6 md:p-8">
          
            <CertificateForm />
          </div>
        </motion.div>
        
        <motion.div
          className="mt-6 text-center text-sm text-black text-opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p>Having trouble? &nbsp; Mail to <a href="mailto:icpc@am.amrita.edu" className="text-black underline hover:text-gray-600 transition-colors">icpc@am.amrita.edu</a></p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CertificateFormContainer;
