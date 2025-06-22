import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap } from "lucide-react";

export default function Component() {
  return (
    <div className="min-h-screen bg-yellow-300 relative overflow-hidden">
      {/* Background geometric shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-red-500 border-4 border-black transform rotate-12"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500 border-4 border-black rounded-full"></div>
      <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-500 border-4 border-black transform -rotate-45"></div>
      <div className="absolute bottom-20 right-10 w-16 h-40 bg-purple-500 border-4 border-black"></div>

      {/* Main hero content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-block mb-8">
            <div className="bg-black text-yellow-300 px-6 py-3 border-4 border-black transform -rotate-2 font-bold text-sm uppercase tracking-wider">🛡️ AI-POWERED SECURITY</div>
          </div>

          {/* Main heading */}
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none">
            <span className="block text-black transform -rotate-1">BITLUME</span>
            <span className="block text-white bg-black px-4 py-2 border-4 border-black transform rotate-1 inline-block mt-4">WALLET</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl font-bold text-black mb-12 max-w-2xl mx-auto leading-tight">
            The ONLY Bitcoin wallet that
            <br />
            <span className="bg-red-500 text-white px-2 py-1 border-2 border-black transform rotate-1 inline-block mt-2">ANALYZES BEFORE YOU SEND</span>
          </p>

          {/* Key Features */}
          <div className="mb-12 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-white border-4 border-black p-4 transform -rotate-1">
                <div className="font-black text-lg mb-2">🌐 WEB-BASED</div>
                <div className="font-bold text-sm">Built on Internet Computer (ICP)</div>
              </div>
              <div className="bg-white border-4 border-black p-4 transform rotate-1">
                <div className="font-black text-lg mb-2">🤖 AI ANALYSIS</div>
                <div className="font-bold text-sm">Scans address history for illegal activity</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white border-4 border-black font-black text-lg px-8 py-6 transform hover:scale-105 transition-transform shadow-[8px_8px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000]">
              LAUNCH WALLET
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>

            <Button variant="outline" size="lg" className="bg-white hover:bg-gray-100 text-black border-4 border-black font-black text-lg px-8 py-6 transform hover:scale-105 transition-transform shadow-[8px_8px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000]">
              SEE HOW IT WORKS
              <Shield className="ml-2 h-6 w-6" />
            </Button>
          </div>

          {/* Stats/Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-blue-500 border-4 border-black p-6 transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="text-3xl font-black text-white mb-2">100%</div>
              <div className="text-black font-bold">SAFE TRANSFERS</div>
            </div>

            <div className="bg-green-500 border-4 border-black p-6 transform rotate-1 hover:rotate-0 transition-transform">
              <div className="text-3xl font-black text-white mb-2 flex items-center justify-center">
                <Zap className="h-8 w-8 mr-1" />
                AI
              </div>
              <div className="text-black font-bold">POWERED</div>
            </div>

            <div className="bg-purple-500 border-4 border-black p-6 transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="text-3xl font-black text-white mb-2">ICP</div>
              <div className="text-black font-bold">BLOCKCHAIN</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-black"></div>
      <div className="absolute bottom-8 left-0 w-full h-4 bg-red-500"></div>
    </div>
  );
}
