"use client";

import { Button } from "@/core/components/ui/button";
import { Wallet, Activity, Compass, Gift, Settings, Search, ArrowUpRight, ArrowDownLeft, RefreshCw, CreditCard, Bitcoin, Zap, Globe, DollarSign, TrendingUp, Copy, X, QrCode, CheckCircle2, AlertTriangle, Shield, Loader2, Send, Menu, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/core/providers/auth-provider";
import { bitcoin } from "declarations/bitcoin";
import { backend } from "declarations/backend";
import LogoutModal from "./components/modals/logout-modal";

export default function DashboardAssets() {
  const { user, identity, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("assets");
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [sendAddress, setSendAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [analysisState, setAnalysisState] = useState("idle"); // idle, analyzing, safe, unsafe
  const [sendState, setSendState] = useState("idle"); // idle, sending, sent
  const [analysisResult, setAnalysisResult] = useState(null);
  const [bitcoinAddress, setBitcoinAddress] = useState(null);
  const [logoutModal, setLogoutModal] = useState(false);

  const [showLoadingModal, setShowLoadingModal] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // Keep sidebar open on desktop
      } else {
        setSidebarOpen(false); // Close sidebar on mobile
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!user) {
      generateBitcoinAddress();
    } else {
      setBitcoinAddress(user.bitcoin_address);
    }
  }, [user]);

  const sidebarItems = [
    { id: "assets", icon: Wallet, label: "ASSETS", active: true },
    { id: "activity", icon: Activity, label: "ACTIVITY" },
    { id: "settings", icon: Settings, label: "SETTINGS" },
    { id: "logout", icon: LogOut, label: "LOGOUT", onClick: () => setLogoutModal(true) },
  ];

  const tokens = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      network: "Bitcoin • Internet Computer",
      balance: "0.00234567",
      value: "$1,247.89",
      icon: Bitcoin,
      color: "bg-orange-500",
      change: "+5.2%",
    },
    {
      symbol: "ICP",
      name: "Internet Computer",
      network: "Internet Computer",
      balance: "125.45",
      value: "$892.15",
      icon: Globe,
      color: "bg-purple-500",
      change: "+2.1%",
    },
  ];

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(bitcoinAddress);
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const analyzeAddress = async () => {
    setAnalysisState("analyzing");

    // Simulate AI analysis - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Simulate random result for demo - replace with actual analysis
    const isSafe = Math.random() > 0.3; // 70% chance of being safe

    if (isSafe) {
      setAnalysisState("safe");
      setAnalysisResult({
        status: "safe",
        confidence: "98%",
        message: "Address appears clean with no suspicious activity detected.",
      });
    } else {
      setAnalysisState("unsafe");
      setAnalysisResult({
        status: "unsafe",
        confidence: "95%",
        message: "WARNING: This address has been linked to suspicious activities including fraud and money laundering.",
        risks: ["Linked to known scam addresses", "High-risk transaction patterns", "Flagged by security databases"],
      });
    }
  };

  const sendBitcoin = async () => {
    setSendState("sending");

    // Simulate sending transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSendState("sent");

    // Reset after showing success
    setTimeout(() => {
      closeSendModal();
    }, 3000);
  };

  const closeSendModal = () => {
    setShowSendModal(false);
    setSendAddress("");
    setSendAmount("");
    setAnalysisState("idle");
    setSendState("idle");
    setAnalysisResult(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const generateBitcoinAddress = async () => {
    setShowLoadingModal(true);
    const principal = identity.getPrincipal();
    const bitcoinResponse = await bitcoin.get_p2pkh_address_for(principal);
    const backendResponse = await backend.create_user(bitcoinResponse);
    // const
    setShowLoadingModal(false);

    console.log("response", backendResponse);
  };

  return (
    <div className="min-h-screen bg-yellow-300 flex relative">
      {/* Mobile Backdrop */}
      <AnimatePresence>{isMobile && sidebarOpen && <motion.div className="fixed inset-0 bg-black/50 z-40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} />}</AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <motion.div className={`${isMobile ? "fixed" : "relative"} w-80 bg-black border-r-8 border-black p-4 md:p-6 z-50 h-full md:h-auto`} initial={isMobile ? { x: -320 } : { x: -100, opacity: 0 }} animate={isMobile ? { x: 0 } : { x: 0, opacity: 1 }} exit={isMobile ? { x: -320 } : { x: -100, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
            {/* Logo */}
            <motion.div className="mb-8 md:mb-12" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="bg-yellow-300 border-4 border-white p-3 md:p-4 transform -rotate-2">
                <h1 className="text-xl md:text-2xl font-black text-black">BITLUME</h1>
                <p className="text-xs md:text-sm font-bold text-black">WALLET</p>
              </div>
            </motion.div>

            {/* Navigation */}
            <nav className="space-y-3 md:space-y-4">
              {sidebarItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  className={`w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 border-4 border-white font-black text-left transition-all transform hover:scale-105 ${item.id === activeTab ? "bg-red-500 text-white rotate-1 shadow-[6px_6px_0px_0px_#ffffff]" : `${item.color ?? "bg-white text-black hover:bg-gray-100"} -rotate-1 hover:rotate-0`}`}
                  onClick={
                    item.onClick ||
                    (() => {
                      setActiveTab(item.id);
                      if (isMobile) setSidebarOpen(false);
                    })
                  }
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="text-base md:text-lg">{item.label}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Header */}
        <motion.div className="flex justify-between items-center mb-6 md:mb-8" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <motion.button className="md:hidden bg-white border-4 border-black p-2 hover:bg-gray-100 transform hover:scale-105 transition-all" onClick={toggleSidebar} whileHover={{ rotate: 5 }} whileTap={{ scale: 0.95 }}>
              <Menu className="h-6 w-6 text-black" />
            </motion.button>

            <div>
              <h1 className="text-2xl md:text-4xl font-black text-black mb-1 md:mb-2">YOUR ASSETS</h1>
              <p className="text-sm md:text-lg font-bold text-black">Secure Bitcoin wallet powered by AI</p>
            </div>
          </div>
        </motion.div>

        {/* Balance Card */}
        <motion.div className="bg-red-500 border-4 md:border-8 border-black p-4 md:p-8 mb-6 md:mb-8 transform -rotate-1 shadow-[8px_8px_0px_0px_#000000] md:shadow-[16px_16px_0px_0px_#000000]" initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: -1 }} transition={{ duration: 0.8, delay: 0.7 }} whileHover={{ rotate: 1, scale: 1.02 }}>
          <div className="text-center">
            <motion.div className="text-4xl md:text-3xl lg:text-8xl font-black text-white mb-3 md:mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8, delay: 1 }}>
              0.1212 <span className="text-lg">BTC</span>
            </motion.div>

            <motion.p className="text-lg md:text-xl font-bold text-white mb-6 md:mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.2 }}>
              TOTAL PORTFOLIO VALUE
            </motion.p>

            {/* Action Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 1.6 }}>
              <motion.div whileHover={{ scale: 1.05, rotate: -2 }} whileTap={{ scale: 0.95 }}>
                <Button size={isMobile ? "default" : "lg"} className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black border-4 border-black font-black text-base md:text-lg px-6 md:px-8 py-3 md:py-4 shadow-[4px_4px_0px_0px_#000000] md:shadow-[6px_6px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] md:hover:shadow-[3px_3px_0px_0px_#000000] transition-all" onClick={() => setShowReceiveModal(true)}>
                  <ArrowDownLeft className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                  RECEIVE
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, rotate: 2 }} whileTap={{ scale: 0.95 }}>
                <Button size={isMobile ? "default" : "lg"} className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white border-4 border-black font-black text-base md:text-lg px-6 md:px-8 py-3 md:py-4 shadow-[4px_4px_0px_0px_#000000] md:shadow-[6px_6px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] md:hover:shadow-[3px_3px_0px_0px_#000000] transition-all" onClick={() => setShowSendModal(true)}>
                  <ArrowUpRight className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                  SEND
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tokens Section */}
        <motion.div className="mb-24 mt-18 bg-white border-4 md:border-8 border-black p-4 md:p-6 transform rotate-1 shadow-[8px_8px_0px_0px_#000000] md:shadow-[12px_12px_0px_0px_#000000]" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 1.8 }}>
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-black">YOUR TOKENS</h2>
            <motion.button className="bg-yellow-300 border-4 border-black p-2 hover:bg-yellow-400 transform hover:scale-105 transition-all" whileHover={{ rotate: 180 }} whileTap={{ scale: 0.95 }}>
              <RefreshCw className="h-4 w-4 md:h-5 md:w-5 text-black" />
            </motion.button>
          </div>

          <div className="space-y-3 md:space-y-4">
            {tokens.map((token, index) => (
              <motion.div key={token.symbol} className={`${token.color} border-4 border-black p-4 md:p-6 flex items-center justify-between transform hover:scale-105 transition-all cursor-pointer`} initial={{ x: -100, opacity: 0, rotate: -5 }} animate={{ x: 0, opacity: 1, rotate: index % 2 === 0 ? 1 : -1 }} transition={{ duration: 0.6, delay: 2 + index * 0.1 }} whileHover={{ rotate: 0, scale: 1.05, y: -5 }}>
                <div className="flex items-center gap-3 md:gap-4">
                  <motion.div className="bg-white border-4 border-black p-2 md:p-3 rounded-full" whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: 0.5 }}>
                    <token.icon className="h-6 w-6 md:h-8 md:w-8 text-black" />
                  </motion.div>

                  <div>
                    <div className="flex items-center gap-2 md:gap-3 mb-1">
                      <h3 className="text-xl md:text-2xl font-black text-white">{token.symbol}</h3>
                      <motion.div className="bg-black text-green-300 px-2 py-1 text-xs font-black border-2 border-white" whileHover={{ scale: 1.1 }}>
                        {token.change}
                      </motion.div>
                    </div>
                    <p className="text-white font-bold text-sm md:text-base">{token.name}</p>
                    <p className="text-white/80 font-bold text-xs md:text-sm">{token.network}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg md:text-2xl font-black text-white mb-1">{token.balance}</div>
                  <div className="text-white font-bold text-sm md:text-base">{token.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Loading Modal - First Time Setup */}
        {showLoadingModal && (
          <motion.div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-purple-500 border-8 border-black p-6 md:p-8 max-w-md w-full transform -rotate-1 shadow-[20px_20px_0px_0px_#000000]" initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: -1 }} exit={{ scale: 0, rotate: -10 }}>
              {/* Modal Header */}
              <div className="text-center mb-6">
                <motion.div className="bg-yellow-300 border-4 border-black p-4 mb-4 transform rotate-2" animate={{ rotate: [2, -2, 2] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
                  <h2 className="text-2xl md:text-3xl font-black text-black">SETTING UP WALLET</h2>
                </motion.div>
                <p className="text-white font-bold text-sm md:text-base">Please wait while we generate your Bitcoin address</p>
              </div>

              {/* Loading Animation */}
              <motion.div className="bg-black border-4 border-white p-6 mb-6 text-center transform rotate-1" animate={{ rotate: [1, -1, 1] }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}>
                <motion.div className="inline-block mb-4" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}>
                  <Loader2 className="h-12 w-12 md:h-16 md:w-16 text-yellow-300" />
                </motion.div>

                <motion.div className="text-4xl md:text-6xl mb-4" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                  🔐
                </motion.div>

                <p className="text-yellow-300 font-black text-sm md:text-base mb-2">Generating Bitcoin Address...</p>

                <p className="text-white font-bold text-xs">Please wait while we generate your Bitcoin address</p>
              </motion.div>

              {/* Warning Notice */}
              <motion.div className="mt-4 bg-red-500 border-4 border-black p-3 transform rotate-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center gap-2">
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                    ⚠️
                  </motion.div>
                  <div>
                    <p className="text-white font-black text-xs">DO NOT CLOSE THIS WINDOW</p>
                    <p className="text-white font-bold text-xs">Address generation in progress</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Send Modal */}
        {showSendModal && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeSendModal}>
            <motion.div className="bg-blue-500 border-4 border-black p-4 md:p-6 max-w-md w-full transform rotate-1" initial={{ scale: 0, rotate: 10 }} animate={{ scale: 1, rotate: 1 }} exit={{ scale: 0, rotate: 10 }} onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-white">SEND BTC</h2>
                <motion.button className="bg-red-500 border-4 border-black p-2 hover:bg-red-600 transform hover:scale-110 transition-all" onClick={closeSendModal} whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}>
                  <X className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </motion.button>
              </div>

              {/* Send Form */}
              <motion.div className="bg-white border-4 border-black p-4 md:p-6 mb-4 md:mb-6 transform rotate-1" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
                <div className="flex flex-col gap-3 md:gap-4">
                  <label className="text-black font-bold text-sm md:text-base">Recipient Address:</label>
                  <input type="text" value={sendAddress} onChange={(e) => setSendAddress(e.target.value)} className="bg-gray-100 border-2 border-gray-300 p-2 md:p-3 text-black font-bold text-sm md:text-base" />
                </div>

                <div className="flex flex-col gap-3 md:gap-4 mt-4 md:mt-6">
                  <label className="text-black font-bold text-sm md:text-base">Amount:</label>
                  <input type="number" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} className="bg-gray-100 border-2 border-gray-300 p-2 md:p-3 text-black font-bold text-sm md:text-base" />
                </div>

                <motion.button className="bg-green-500 hover:bg-green-600 text-white border-4 border-black font-black text-base md:text-lg px-3 md:px-4 py-2 md:py-3 transform hover:scale-105 transition-all shadow-[3px_3px_0px_0px_#000000] md:shadow-[4px_4px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] md:hover:shadow-[2px_2px_0px_0px_#000000]" onClick={analyzeAddress} whileHover={{ rotate: 1 }} whileTap={{ scale: 0.95 }} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                  <Send className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  ANALYZE
                </motion.button>
              </motion.div>

              {/* Analysis Results */}
              {analysisState ? (
                analysisState === "safe" ? (
                  // Safe Result
                  <motion.div className="bg-green-500 border-4 border-black p-4 md:p-6 mb-4 md:mb-6 transform -rotate-1" animate={{ rotate: [-1, 1, -1] }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}>
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
                        <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-white">ADDRESS IS SAFE</h3>
                        <p className="text-white font-bold text-sm md:text-base">Confidence: {analysisResult?.confidence}</p>
                      </div>
                    </div>
                    <p className="text-white font-bold text-xs md:text-sm">{analysisResult?.message}</p>
                  </motion.div>
                ) : (
                  // Unsafe Result
                  <motion.div className="bg-red-500 border-4 border-black p-4 md:p-6 mb-4 md:mb-6 transform rotate-1" animate={{ rotate: [1, -1, 1] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                        <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-white">⚠️ DANGER!</h3>
                        <p className="text-white font-bold text-sm md:text-base">Confidence: {analysisResult?.confidence}</p>
                      </div>
                    </div>
                    <p className="text-white font-bold text-xs md:text-sm mb-3 md:mb-4">{analysisResult?.message}</p>
                    {analysisResult?.risks && (
                      <div className="bg-black border-2 border-white p-2 md:p-3">
                        <p className="text-red-300 font-black text-xs mb-2">DETECTED RISKS:</p>
                        {analysisResult.risks.map((risk, i) => (
                          <p key={i} className="text-white font-bold text-xs">
                            • {risk}
                          </p>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              ) : (
                <div className="text-center p-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p>Analyzing transaction...</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Receive Modal */}
        {showReceiveModal && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReceiveModal(false)}>
            <motion.div className="bg-yellow-300 border-4 md:border-8 border-black p-4 md:p-8 max-w-md w-full transform -rotate-1 shadow-[12px_12px_0px_0px_#000000] md:shadow-[20px_20px_0px_0px_#000000]" initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: -1 }} exit={{ scale: 0, rotate: -10 }} onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-black">RECEIVE BTC</h2>
                <motion.button className="bg-red-500 border-4 border-black p-2 hover:bg-red-600 transform hover:scale-110 transition-all" onClick={() => setShowReceiveModal(false)} whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}>
                  <X className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </motion.button>
              </div>

              {/* QR Code Section */}
              <motion.div className="bg-white border-4 border-black p-4 md:p-6 mb-4 md:mb-6 text-center transform rotate-1" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
                <motion.div className="bg-black border-4 border-gray-300 p-3 md:p-4 inline-block mb-3 md:mb-4" whileHover={{ scale: 1.05 }}>
                  {/* QR Code Placeholder - Using a grid pattern to simulate QR code */}
                  <div className="w-24 h-24 md:w-32 md:h-32 grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className={`w-1 h-1 md:w-2 md:h-2 ${Math.random() > 0.5 ? "bg-white" : "bg-black"}`} />
                    ))}
                  </div>
                </motion.div>
                <p className="text-black font-bold text-xs md:text-sm">SCAN TO SEND BITCOIN</p>
              </motion.div>

              {/* Bitcoin Address Section */}
              <motion.div className="bg-black border-4 border-white p-3 md:p-4 mb-4 md:mb-6 transform -rotate-1" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <p className="text-white font-black text-xs md:text-sm mb-2">YOUR BITCOIN ADDRESS:</p>
                <div className="bg-white border-2 border-gray-300 p-2 md:p-3 break-all">
                  <code className="text-black font-mono text-xs md:text-sm">{bitcoinAddress}</code>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <motion.button className={`flex-1 border-4 border-black font-black text-base md:text-lg px-3 md:px-4 py-2 md:py-3 transform hover:scale-105 transition-all shadow-[3px_3px_0px_0px_#000000] md:shadow-[4px_4px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] md:hover:shadow-[2px_2px_0px_0px_#000000] ${addressCopied ? "bg-green-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`} onClick={copyAddress} whileHover={{ rotate: 1 }} whileTap={{ scale: 0.95 }} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                  {addressCopied ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      COPIED!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      COPY
                    </>
                  )}
                </motion.button>

                <motion.button className="bg-purple-500 hover:bg-purple-600 text-white border-4 border-black font-black text-base md:text-lg px-3 md:px-4 py-2 md:py-3 transform hover:scale-105 transition-all shadow-[3px_3px_0px_0px_#000000] md:shadow-[4px_4px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] md:hover:shadow-[2px_2px_0px_0px_#000000]" whileHover={{ rotate: -1 }} whileTap={{ scale: 0.95 }} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
                  <QrCode className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  SHARE
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        <LogoutModal isOpen={logoutModal} onClose={() => setLogoutModal(false)} onConfirm={logout} />
      </div>
    </div>
  );
}
