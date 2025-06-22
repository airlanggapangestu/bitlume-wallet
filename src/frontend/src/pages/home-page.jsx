"use client";

import { Button } from "@/core/components/ui/button";
import { ArrowRight, Shield, Zap, Target, Brain, CheckCircle } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { useAuth } from "@/core/providers/auth-provider";
import { useNavigate } from "react-router";

export default function Component() {
  const { handleLogin, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  console.log("a", isAuthenticated);

  useEffect(() => {
    // logout();
  }, []);

  const containerRef = useRef(null);
  const howItWorksRef = useRef(null);

  const handleScrollTo = () => {
    howItWorksRef.current?.scrollIntoView({
      behavior: "smooth", // smooth scroll
      block: "start", // posisi section di atas viewport
    });
  };

  function handleLaunchWallet() {
    if (!isAuthenticated) {
      handleLogin();
    } else {
      navigate("/dashboard");
    }
  }

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div ref={containerRef} className="relative">
      {/* HERO SECTION */}
      <div className="min-h-screen bg-yellow-300 relative overflow-hidden">
        {/* Animated background geometric shapes */}
        <motion.div className="absolute top-20 left-10 w-32 h-32 bg-red-500 border-4 border-black" style={{ y, rotate }} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 12 }} transition={{ duration: 1, type: "spring", bounce: 0.6 }} />
        <motion.div className="absolute top-40 right-20 w-24 h-24 bg-blue-500 border-4 border-black rounded-full" initial={{ scale: 0, x: 100 }} animate={{ scale: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} whileHover={{ scale: 1.2, rotate: 360 }} />
        <motion.div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-500 border-4 border-black" initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: -45 }} transition={{ duration: 1, delay: 0.4, type: "spring" }} style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]) }} />
        <motion.div className="absolute bottom-20 right-10 w-16 h-40 bg-purple-500 border-4 border-black" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.8, delay: 0.6 }} whileHover={{ scaleY: 1.1 }} />

        {/* Main hero content */}
        <div className="container mx-auto px-4 py-20 mt-14 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated Main heading */}
            <div className="mb-8">
              <motion.h1 className="text-6xl md:text-8xl font-black leading-none" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
                <motion.span className="block text-black" initial={{ x: -100, rotate: -10 }} animate={{ x: 0, rotate: -1 }} transition={{ duration: 0.8, delay: 0.6 }} whileHover={{ rotate: 2, scale: 1.05 }}>
                  BITLUME
                </motion.span>
                <motion.span className="block text-white bg-black px-4 py-2 border-4 border-black inline-block mt-4" initial={{ x: 100, rotate: 10 }} animate={{ x: 0, rotate: 1 }} transition={{ duration: 0.8, delay: 0.8 }} whileHover={{ rotate: -2, scale: 1.05 }}>
                  WALLET
                </motion.span>
              </motion.h1>
            </div>

            {/* Animated Subheading */}
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 1 }} className="mb-12">
              <p className="text-xl md:text-2xl font-bold text-black max-w-2xl mx-auto leading-tight">
                The ONLY Bitcoin wallet that
                <br />
                <motion.span className="bg-red-500 text-white px-2 py-1 border-2 border-black inline-block mt-2" initial={{ rotate: -5 }} animate={{ rotate: 1 }} whileHover={{ rotate: 5, scale: 1.1 }}>
                  ANALYZES BEFORE YOU SEND
                </motion.span>
              </p>
            </motion.div>

            {/* Animated CTA Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 mt-20" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 1.4 }}>
              <motion.div whileHover={{ scale: 1.05, rotate: -1 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleLaunchWallet} size="lg" className="bg-red-500 hover:bg-red-600 text-white border-4 border-black font-black text-lg px-8 py-6 shadow-[8px_8px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
                  LAUNCH WALLET
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, rotate: 1 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleScrollTo} variant="outline" size="lg" className="bg-white hover:bg-gray-100 text-black border-4 border-black font-black text-lg px-8 py-6 shadow-[8px_8px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] transition-all">
                  SEE HOW IT WORKS
                  <Shield className="ml-2 h-6 w-6" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Animated Bottom decorative elements */}
        <motion.div className="absolute bottom-0 left-0 w-full h-8 bg-black" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 2 }} />
        <motion.div className="absolute bottom-8 left-0 w-full h-4 bg-red-500" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 2.2 }} />
      </div>

      {/* HOW IT WORKS SECTION */}
      <div ref={howItWorksRef} className="min-h-screen bg-black relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div className="absolute top-10 right-10 w-40 h-40 bg-yellow-300 border-4 border-white" initial={{ scale: 0, rotate: 45 }} whileInView={{ scale: 1, rotate: 0 }} transition={{ duration: 1, type: "spring" }} viewport={{ once: true }} />
        <motion.div className="absolute bottom-20 left-20 w-32 h-32 bg-red-500 border-4 border-white rounded-full" initial={{ scale: 0, x: -100 }} whileInView={{ scale: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} />
        <motion.div className="absolute top-1/2 left-10 w-6 h-60 bg-green-500 border-4 border-white" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} transition={{ duration: 1, delay: 0.4 }} viewport={{ once: true }} />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Title */}
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
              <motion.h2 className="text-5xl md:text-7xl font-black text-white mb-6" initial={{ scale: 0.5 }} whileInView={{ scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
                <motion.span className="block" whileHover={{ rotate: 2, scale: 1.05 }}>
                  HOW IT
                </motion.span>
                <motion.span className="block bg-yellow-300 text-black px-4 py-2 border-4 border-white inline-block mt-4" initial={{ rotate: -5 }} whileInView={{ rotate: 2 }} whileHover={{ rotate: -2, scale: 1.05 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}>
                  WORKS
                </motion.span>
              </motion.h2>
            </motion.div>

            {/* Process Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  step: "01",
                  title: "ENTER ADDRESS",
                  desc: "Input the Bitcoin address you want to send funds to",
                  bg: "bg-red-500",
                  icon: Target,
                  rotate: -2,
                },
                {
                  step: "02",
                  title: "AI ANALYSIS",
                  desc: "Our AI scans the address history for any illegal activity or suspicious patterns",
                  bg: "bg-blue-500",
                  icon: Brain,
                  rotate: 1,
                },
                {
                  step: "03",
                  title: "SAFE TRANSFER",
                  desc: "Once verified clean, your Bitcoin is sent securely to the destination",
                  bg: "bg-green-500",
                  icon: CheckCircle,
                  rotate: -1,
                },
              ].map((step, index) => (
                <motion.div key={index} className={`${step.bg} border-4 border-white p-8 text-center`} initial={{ opacity: 0, y: 100, rotate: step.rotate * 10 }} whileInView={{ opacity: 1, y: 0, rotate: step.rotate }} transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }} whileHover={{ rotate: 0, scale: 1.05 }} viewport={{ once: true }}>
                  <div className="text-6xl font-black text-white mb-4">{step.step}</div>
                  <step.icon className="h-16 w-16 mx-auto mb-4 text-white" />
                  <h3 className="text-2xl font-black text-white mb-4">{step.title}</h3>
                  <p className="text-white font-bold leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            <motion.div className="text-center my-32" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 1 }} viewport={{ once: true }}>
              <motion.div className="mb-8">
                <h3 className="text-3xl font-black text-white mb-4">READY TO SECURE YOUR BITCOIN?</h3>
                <p className="text-xl text-white font-bold">Join the future of safe Bitcoin transactions</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, rotate: -1 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-yellow-300 hover:bg-yellow-400 text-black border-4 border-white font-black text-xl px-12 py-8 shadow-[12px_12px_0px_0px_#ffffff] hover:shadow-[6px_6px_0px_0px_#ffffff] transition-all">
                  LAUNCH BITLUME WALLET
                  <ArrowRight className="ml-3 h-8 w-8" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom decorative stripes */}
        <motion.div className="absolute bottom-0 left-0 w-full h-6 bg-yellow-300" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1, delay: 1.2 }} viewport={{ once: true }} />
        <motion.div className="absolute bottom-6 left-0 w-full h-6 bg-red-500" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1, delay: 1.4 }} viewport={{ once: true }} />
      </div>
    </div>
  );
}
