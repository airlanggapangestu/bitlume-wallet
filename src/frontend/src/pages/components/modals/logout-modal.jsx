import { motion } from "framer-motion";
import { Cross, Search, X } from "lucide-react";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <motion.div className="fixed inset-0 bg-black/50 flex items-center pb-40 justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-red-500 border-8 border-black p-6 md:p-8 max-w-md w-full transform rotate-1 shadow-[20px_20px_0px_0px_#000000]" initial={{ scale: 0, rotate: 10 }} animate={{ scale: 1, rotate: 1 }} exit={{ scale: 0, rotate: 10 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end items-start">
          <motion.button onClick={onClose} className="bg-white border-4 border-black p-2 md:p-3 hover:bg-gray-100 transform hover:scale-105 transition-all" whileHover={{ rotate: 5 }} whileTap={{ scale: 0.95 }}>
            <X className="h-3 w-3 md:h-6 md:w-6 text-black" />
          </motion.button>
        </div>
        {/* Modal Header */}
        <div className="text-center mb-6 mt-8">
          <motion.div className="bg-yellow-300 border-4 border-black p-4 mb-4 transform -rotate-2 hover:cursor-pointer hover:bg-yellow-400" onClick={onConfirm} animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
            <h2 className="text-2xl md:text-3xl font-black text-black">CONFIRM LOGOUT</h2>
          </motion.div>
          <p className="text-white font-bold text-sm md:text-base">Are you sure you want to logout from your Bitlume wallet?</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
