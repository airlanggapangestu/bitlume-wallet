import { Button } from "@/core/components/ui/button";
import { Shield, ArrowLeft, AlertTriangle, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function UnauthorizedPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoBack = () => {
    setIsRedirecting(true);
    // Simulate redirect - replace with actual navigation
    setTimeout(() => {
      window.history.back();
      // or window.location.href = "/login"
    }, 1000);
  };

  const handleLogin = () => {
    setIsRedirecting(true);
    // Simulate redirect to login - replace with actual navigation
    setTimeout(() => {
      // window.location.href = "/login"
      console.log("Redirecting to login...");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-red-500 relative overflow-hidden flex justify-center">
      {/* Background geometric shapes */}
      <motion.div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300 border-4 border-black" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 12 }} transition={{ duration: 1, type: "spring", bounce: 0.6 }} />
      <motion.div className="absolute top-40 right-20 w-24 h-24 bg-blue-500 border-4 border-black rounded-full" initial={{ scale: 0, x: 100 }} animate={{ scale: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} whileHover={{ scale: 1.2, rotate: 360 }} />
      <motion.div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-500 border-4 border-black" initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: -45 }} transition={{ duration: 1, delay: 0.4, type: "spring" }} />
      <motion.div className="absolute bottom-20 right-10 w-16 h-40 bg-purple-500 border-4 border-black" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.8, delay: 0.6 }} whileHover={{ scaleY: 1.1 }} />

      {/* Main Content */}
      <div className="container mt-20 mx-auto px-4 py-20 relative z-10">
        <div className="max-w-2xl  mx-auto text-center">
          {/* Error Icon */}
          <motion.div className="mb-8" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <motion.div className="bg-black border-8 border-white p-8 inline-block transform -rotate-2" animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
                <Lock className="h-24 w-24 md:h-32 md:w-32 text-red-500" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}>
            <motion.span className="block" whileHover={{ rotate: 2, scale: 1.05 }}>
              ACCESS
            </motion.span>
            <motion.span className="block bg-black text-red-500 px-4 py-2 border-4 border-white inline-block mt-4 transform rotate-1" whileHover={{ rotate: -2, scale: 1.05 }}>
              DENIED
            </motion.span>
          </motion.h1>

          {/* Help Text */}
          <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.4 }}>
            <p className="text-white font-bold text-sm">Need help? Contact support or check your login credentials</p>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative elements */}
      <motion.div className="absolute bottom-0 left-0 w-full h-8 bg-black" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 1.6 }} />
      <motion.div className="absolute bottom-8 left-0 w-full h-4 bg-yellow-300" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 1.8 }} />
    </div>
  );
}
