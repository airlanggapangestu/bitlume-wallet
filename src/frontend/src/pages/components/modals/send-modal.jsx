"use client";

import { motion } from "framer-motion";
import { X, Shield, Loader2, CheckCircle2, AlertTriangle, Send } from "lucide-react";
import { useState } from "react";

export default function SendModal(props) {
  const { isOpen, onClose, onSend, sendState, setSendState } = props;

  const [sendAddress, setSendAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [analysisState, setAnalysisState] = useState("idle"); // idle, analyzing, safe, unsafe
  const [analysisResult, setAnalysisResult] = useState(null);

  const analyzeAddress = async () => {
    setAnalysisState("analyzing");

    // Simulate AI analysis - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Simulate random result for demo - replace with actual analysis
    // const isSafe = Math.random() > 0.3; // 70% chance of being safe
    const isSafe = true;

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
    console.log("p");
    setSendAddress("");
    setSendAmount("");
    setAnalysisState("idle");
    setSendState("idle");
    setAnalysisResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeSendModal}>
      <motion.div className="bg-yellow-300 border-4 md:border-8 border-black p-4 md:p-8 max-w-md w-full transform -rotate-1 shadow-[12px_12px_0px_0px_#000000] md:shadow-[20px_20px_0px_0px_#000000]" initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: -1 }} exit={{ scale: 0, rotate: -10 }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-black">SEND BITCOIN</h2>
          <motion.button className="bg-red-500 border-4 border-black p-2 hover:bg-red-600 transform hover:scale-110 transition-all" onClick={closeSendModal} whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}>
            <X className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </motion.button>
        </div>

        {/* Send Form */}
        <div className="space-y-4 md:space-y-6">
          {/* Address Input */}
          <motion.div className="transform -rotate-1" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <label htmlFor="address" className="block text-black font-black text-xs md:text-sm mb-1">
              RECIPIENT ADDRESS:
            </label>
            <input type="text" id="address" className="w-full bg-white border-2 border-gray-300 p-2 md:p-3 text-black font-bold text-xs md:text-sm" placeholder="bc1q..." value={sendAddress} onChange={(e) => setSendAddress(e.target.value)} />
          </motion.div>

          {/* Amount Input */}
          <motion.div className="transform rotate-1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <label htmlFor="amount" className="block text-black font-black text-xs md:text-sm mb-1">
              AMOUNT (BTC):
            </label>
            <input type="number" id="amount" className="w-full bg-white border-2 border-gray-300 p-2 md:p-3 text-black font-bold text-xs md:text-sm" placeholder="0.0000" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} />
          </motion.div>
        </div>

        {/* Analysis Results */}
        {(analysisState === "safe" || analysisState === "unsafe") && (
          <>
            {analysisState === "safe" ? (
              // Safe Result
              <motion.div className="bg-green-500 border-4 border-black p-4 md:p-6 mb-4 md:mb-6 transform -rotate-1 mt-4" animate={{ rotate: [-1, 1, -1] }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}>
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
              <motion.div className="bg-red-500 border-4 border-black p-4 md:p-6 mb-4 md:mb-6 transform rotate-1 mt-4" animate={{ rotate: [1, -1, 1] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
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
            )}

            {/* Transaction Summary */}
            <motion.div className="bg-white border-4 border-black p-3 md:p-4 mb-4 md:mb-6 transform -rotate-1" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <h4 className="text-black font-black text-base md:text-lg mb-2 md:mb-3">TRANSACTION SUMMARY:</h4>
              <div className="space-y-1 md:space-y-2">
                <p className="text-black font-bold text-xs md:text-sm">Amount: {sendAmount} BTC</p>
                <p className="text-black font-bold text-xs md:text-sm break-all">To: {sendAddress}</p>
                <p className="text-black font-bold text-xs md:text-sm">Network Fee: ~0.00001 BTC</p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              {analysisState === "safe" ? (
                <>
                  <motion.button className="flex-1 bg-green-500 hover:bg-green-600 text-white border-4 border-black font-black text-base md:text-lg px-3 md:px-4 py-2 md:py-3 transform hover:scale-105 transition-all shadow-[3px_3px_0px_0px_#000000]" onClick={() => onSend(sendAddress, sendAmount)} disabled={sendState === "sending"} whileHover={{ rotate: 1 }} whileTap={{ scale: 0.95 }} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                    {sendState === "sending" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
                        SENDING...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                        CONFIRM SEND
                      </>
                    )}
                  </motion.button>
                  <motion.button className="bg-gray-500 hover:bg-gray-600 text-white border-4 border-black font-black text-base md:text-lg px-3 md:px-4 py-2 md:py-3 transform hover:scale-105 transition-all shadow-[3px_3px_0px_0px_#000000]" onClick={onClose} whileHover={{ rotate: -1 }} whileTap={{ scale: 0.95 }} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
                    CANCEL
                  </motion.button>
                </>
              ) : (
                <motion.button className="w-full bg-red-500 hover:bg-red-600 text-white border-4 border-black font-black text-base md:text-lg px-3 md:px-4 py-2 md:py-3 transform hover:scale-105 transition-all shadow-[3px_3px_0px_0px_#000000]" onClick={closeSendModal} whileHover={{ rotate: 2 }} whileTap={{ scale: 0.95 }} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                  <X className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  TRANSACTION BLOCKED
                </motion.button>
              )}
            </div>
          </>
        )}

        {/* Analyze Button */}
        {(analysisState === "idle" || analysisState === "analyzing") && (
          <motion.div className="mt-4 md:mt-6 transform -rotate-1" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <motion.button className="w-full bg-purple-500 hover:bg-purple-600 text-white border-4 border-black font-black text-base md:text-lg px-4 md:px-6 py-3 md:py-4 transform hover:scale-105 transition-all shadow-[4px_4px_0px_0px_#000000] md:shadow-[6px_6px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] md:hover:shadow-[3px_3px_0px_0px_#000000]" onClick={analyzeAddress} disabled={analysisState === "analyzing"} whileHover={{ rotate: 2 }} whileTap={{ scale: 0.95 }}>
              {analysisState === "analyzing" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
                  ANALYZING...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  ANALYZE ADDRESS
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
