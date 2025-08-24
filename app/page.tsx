"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Shield, Key, Users, BarChart3, Bell, FileText, ArrowRight, Check, Star, Github, Twitter, Linkedin, RefreshCw, Code, FolderGit2, Globe } from 'lucide-react'
import Link from "next/link"
import { useEffect, useState, useRef } from "react"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['hero']));
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);

      // Check which sections are visible
      const newVisibleSections = new Set<string>();
     
      Object.entries(sectionRefs.current).forEach(([sectionId, element]) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight;
         
          // Section is visible if it's in the viewport
          if (rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2) {
            newVisibleSections.add(sectionId);
          }
        }
      });

      setVisibleSections(newVisibleSections);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-center pt-4 px-4">
        <div className={`backdrop-blur-xl rounded-2xl w-full max-w-2xl shadow-lg transition-all duration-300 ${
          isScrolled
            ? 'bg-[#EDEDED]/95 border border-gray-300'
            : 'bg-[#EDEDED]/95 border border-gray-200'
        }`}>
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Modern Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10">
                  <div className={`absolute w-6 h-6 rounded-full left-0 shadow-sm transition-colors duration-300 ${
                    isScrolled ? 'bg-[#000000]' : 'bg-[#000000]'
                  }`}></div>
                  <div className={`absolute w-6 h-6 rounded-full right-0 opacity-80 shadow-sm transition-colors duration-300 ${
                    isScrolled ? 'bg-[#666666]' : 'bg-[#666666]'
                  }`}></div>
                </div>
                <span className={`text-xl font-bold transition-colors duration-300 text-black`}>
                  DevVerse
                </span>
              </div>
             
              {/* Navigation links */}
              <nav className="hidden md:flex items-center space-x-8 ml-8">
                <Link href="#" className={`font-semibold transition-colors duration-300 text-black/80 hover:text-gray-600`}>
                  Home
                </Link>
                <Link href="#features" className={`font-semibold transition-colors duration-300 text-black/80 hover:text-gray-600`}>
                  Features
                </Link>
              </nav>
            </div>
           
            {/* Right side - buttons and hamburger */}
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="outline" className="border-gray-400 text-black hover:bg-gray-100 bg-transparent hover:text-black transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-black text-white hover:bg-gray-800 font-semibold shadow-sm transition-all duration-300">
                    Get Started
                  </Button>
                </Link>
              </nav>
             
              {/* Hamburger menu */}
              <button className="md:hidden w-8 h-8 flex flex-col justify-center items-center space-y-1">
                <div className="w-6 h-0.5 rounded bg-black transition-all duration-300"></div>
                <div className="w-6 h-0.5 rounded bg-black transition-all duration-300"></div>
                <div className="w-6 h-0.5 rounded bg-black transition-all duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Enhanced with Text Animations */}
      <section
        ref={(el) => { sectionRefs.current['hero'] = el; }}
        className={`py-32 px-4 transition-all duration-1000 ease-out bg-gradient-to-b from-white to-gray-50 relative overflow-hidden ${
          visibleSections.has('hero')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Security-Themed Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Enhanced Floating Security Icons */}
          <div className="absolute top-20 left-10 text-gray-400 animate-float security-float text-2xl" style={{animationDelay: '0s'}}>
            🔒
          </div>
          <div className="absolute top-40 right-20 text-gray-500 animate-float security-float text-2xl" style={{animationDelay: '2s'}}>
            🛡️
          </div>
          <div className="absolute top-60 left-1/4 text-gray-400 animate-float security-float text-xl" style={{animationDelay: '4s'}}>
            🔐
          </div>
          <div className="absolute bottom-40 right-1/3 text-gray-600 animate-float security-float text-2xl" style={{animationDelay: '1s'}}>
            🔑
          </div>
          <div className="absolute bottom-20 left-20 text-gray-500 animate-float security-float text-xl" style={{animationDelay: '3s'}}>
            🛡️
          </div>
          <div className="absolute top-1/3 right-10 text-gray-400 animate-float security-float text-lg" style={{animationDelay: '5s'}}>
            🔒
          </div>
         
          {/* Additional Security Elements */}
          <div className="absolute top-72 left-1/3 text-gray-600 animate-float security-float text-lg" style={{animationDelay: '6s'}}>
            🛡️
          </div>
          <div className="absolute bottom-60 left-1/2 text-gray-500 animate-float security-float text-xl" style={{animationDelay: '7s'}}>
            🔐
          </div>
          <div className="absolute top-80 right-1/4 text-gray-400 animate-float security-float text-lg" style={{animationDelay: '8s'}}>
            🔑
          </div>
         
          {/* Enhanced Binary Code Rain */}
          <div className="absolute top-0 left-1/4 w-px h-full opacity-30">
            <div className="binary-rain text-gray-600 text-xs font-mono leading-tight">
              1010110<br/>0110101<br/>1101001<br/>0101010<br/>1110011<br/>0011100<br/>1010110<br/>0110101<br/>1001101<br/>0101110
            </div>
          </div>
          <div className="absolute top-0 right-1/3 w-px h-full opacity-25">
            <div className="binary-rain text-gray-500 text-xs font-mono leading-tight" style={{animationDelay: '2s'}}>
              0110101<br/>1010110<br/>0101010<br/>1101001<br/>0011100<br/>1110011<br/>0110101<br/>1010110<br/>1011001<br/>0100110
            </div>
          </div>
          <div className="absolute top-0 left-2/3 w-px h-full opacity-20">
            <div className="binary-rain text-gray-700 text-xs font-mono leading-tight" style={{animationDelay: '4s'}}>
              1101001<br/>0101010<br/>1110011<br/>0110101<br/>1010110<br/>0011100<br/>1101001<br/>0101010<br/>1100101<br/>0010110
            </div>
          </div>
          <div className="absolute top-0 left-1/6 w-px h-full opacity-15">
            <div className="binary-rain text-gray-600 text-xs font-mono leading-tight" style={{animationDelay: '6s'}}>
              0011100<br/>1110011<br/>0110101<br/>1010110<br/>1101001<br/>0101010<br/>0011100<br/>1110011<br/>0111010<br/>1001011
            </div>
          </div>
         
          {/* Enhanced API Key Symbols */}
          <div className="absolute top-32 left-1/2 text-gray-500 api-key-float text-sm font-mono" style={{animationDelay: '1s'}}>
            API_KEY_DevVerse2024
          </div>
          <div className="absolute bottom-32 right-1/4 text-gray-600 api-key-float text-sm font-mono" style={{animationDelay: '3s'}}>
            SECRET_SecureAuth
          </div>
          <div className="absolute top-2/3 left-20 text-gray-700 api-key-float text-sm font-mono" style={{animationDelay: '5s'}}>
            TOKEN_AccessKey
          </div>
          <div className="absolute bottom-72 left-1/3 text-gray-500 api-key-float text-xs font-mono" style={{animationDelay: '7s'}}>
            AUTH_SecurePass
          </div>
          <div className="absolute top-96 right-1/3 text-gray-600 api-key-float text-xs font-mono" style={{animationDelay: '9s'}}>
            HASH_Protection
          </div>
         
          {/* Enhanced Encrypted Data Streams */}
          <div className="absolute top-1/4 left-0 w-full h-px">
            <div className="data-stream bg-gradient-to-r from-transparent via-gray-600 to-transparent h-full"></div>
          </div>
          <div className="absolute bottom-1/3 left-0 w-full h-px">
            <div className="data-stream bg-gradient-to-r from-transparent via-gray-500 to-transparent h-full" style={{animationDelay: '2s'}}></div>
          </div>
          <div className="absolute top-2/3 left-0 w-full h-px">
            <div className="data-stream bg-gradient-to-r from-transparent via-gray-700 to-transparent h-full" style={{animationDelay: '4s'}}></div>
          </div>
          <div className="absolute top-1/2 left-0 w-full h-px">
            <div className="data-stream bg-gradient-to-r from-transparent via-gray-600 to-transparent h-full" style={{animationDelay: '6s'}}></div>
          </div>
          <div className="absolute top-3/4 left-0 w-full h-px">
            <div className="data-stream bg-gradient-to-r from-transparent via-gray-500 to-transparent h-full" style={{animationDelay: '8s'}}></div>
          </div>
         
          {/* Enhanced Security Network Nodes */}
          <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-gray-600 rounded-full security-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-gray-500 rounded-full security-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-gray-700 rounded-full security-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-gray-600 rounded-full security-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-gray-500 rounded-full security-pulse" style={{animationDelay: '4s'}}></div>
         
          {/* Floating Geometric Shapes */}
          <div className="absolute top-40 left-1/3 w-6 h-6 border border-gray-500 rotate-45 geometric-float" style={{animationDelay: '10s'}}></div>
          <div className="absolute bottom-40 right-1/4 w-4 h-4 border border-gray-600 geometric-float" style={{animationDelay: '12s'}}></div>
          <div className="absolute top-60 right-1/3 w-3 h-3 bg-gray-700 rounded-full geometric-float subtle-glow" style={{animationDelay: '14s'}}></div>
          <div className="absolute bottom-60 left-1/6 w-5 h-5 border-2 border-gray-500 rounded-full geometric-float" style={{animationDelay: '16s'}}></div>
          <div className="absolute top-80 left-2/3 w-4 h-4 bg-gray-600 rotate-45 geometric-float" style={{animationDelay: '18s'}}></div>
         
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#666666" stopOpacity="0.3"/>
                <stop offset="50%" stopColor="#999999" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#777777" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <path d="M200,200 Q400,100 600,300 Q800,500 1000,200" stroke="url(#securityGradient)" strokeWidth="1" fill="none" className="security-connection"/>
            <path d="M100,400 Q300,200 500,500 Q700,300 900,400" stroke="url(#securityGradient)" strokeWidth="1" fill="none" className="security-connection" style={{animationDelay: '3s'}}/>
            <path d="M150,150 Q350,50 550,250 Q750,450 950,150" stroke="url(#securityGradient)" strokeWidth="0.5" fill="none" className="security-connection" style={{animationDelay: '6s'}}/>
          </svg>
        </div>
        {/* Consolidated CSS Animations */}
        <style jsx>{`
          /* Hero Section Animations */
          @keyframes typewriter {
            from { width: 0; }
            to { width: 100%; }
          }
          @keyframes blinkCaret {
            from, to { border-color: transparent; }
            50% { border-color: #666666; }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes glow {
            0%, 100% { text-shadow: 0 0 5px rgba(102, 102, 102, 0.5), 0 0 10px rgba(102, 102, 102, 0.5), 0 0 15px rgba(102, 102, 102, 0.5); }
            50% { text-shadow: 0 0 10px rgba(102, 102, 102, 0.8), 0 0 20px rgba(102, 102, 102, 0.8), 0 0 30px rgba(102, 102, 102, 0.8); }
          }
         
          /* Command Center Section Animations */
          @keyframes bounceLetters {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          @keyframes wave {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(5deg); }
            75% { transform: rotate(-5deg); }
          }
          @keyframes rainbow {
            0% { color: #666666; }
            16% { color: #777777; }
            33% { color: #888888; }
            50% { color: #999999; }
            66% { color: #aaaaaa; }
            83% { color: #bbbbbb; }
            100% { color: #666666; }
          }
         
          /* Features Section Animations */
          @keyframes textWave {
            0%, 100% { transform: translateY(0px); }
            25% { transform: translateY(-8px); }
            50% { transform: translateY(-4px); }
            75% { transform: translateY(-12px); }
          }
          @keyframes textGlow {
            0%, 100% { text-shadow: 0 0 5px rgba(0, 246, 255, 0.5); }
            50% { text-shadow: 0 0 20px rgba(0, 246, 255, 1), 0 0 30px rgba(255, 103, 196, 0.8); }
          }
          @keyframes slideInLeft {
            0% { opacity: 0; transform: translateX(-50px); }
            100% { opacity: 1; transform: translateX(0); }
          }
         
          /* Universe Section Animations */
          @keyframes cosmicFloat {
            0%, 100% { transform: translateY(0px) scale(1); }
            33% { transform: translateY(-15px) scale(1.02); }
            66% { transform: translateY(-8px) scale(0.98); }
          }
          @keyframes cosmicGlow {
            0%, 100% {
              text-shadow: 0 0 10px rgba(91, 46, 255, 0.5), 0 0 20px rgba(0, 246, 255, 0.3), 0 0 30px rgba(255, 103, 196, 0.2);
            }
            50% {
              text-shadow: 0 0 20px rgba(91, 46, 255, 0.8), 0 0 40px rgba(0, 246, 255, 0.6), 0 0 60px rgba(255, 103, 196, 0.4);
            }
          }
          @keyframes letterFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-5px) rotate(1deg); }
            75% { transform: translateY(-3px) rotate(-1deg); }
          }
          @keyframes rainbowShift {
            0% { color: #5B2EFF; }
            16% { color: #00F6FF; }
            33% { color: #FF67C4; }
            50% { color: #FF8E53; }
            66% { color: #00E0B5; }
            83% { color: #9E7BFF; }
            100% { color: #5B2EFF; }
          }
         
          /* Pricing Section Animations */
          @keyframes pricingFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          @keyframes pricingGlow {
            0%, 100% { text-shadow: 0 0 5px rgba(0, 246, 255, 0.3); }
            50% { text-shadow: 0 0 15px rgba(0, 246, 255, 0.6); }
          }
          @keyframes diamondSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
         
          /* CSS Classes */
          .typewriter {
            overflow: hidden;
            border-right: 3px solid #00F6FF;
            white-space: nowrap;
            animation:
              typewriter 4s cubic-bezier(0.4, 0, 0.2, 1) steps(40, end),
              blinkCaret 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
          .fade-in-up {
            animation: fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          .bounce-in {
            animation: bounceIn 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          }
          .shimmer-text {
            background: linear-gradient(90deg, #000 0%, #666666 25%, #999999 50%, #777777 75%, #000 100%);
            background-size: 400% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          .float-animation {
            animation: float 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          .glow-text {
            animation: glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate;
          }
          .bounce-letters span {
            display: inline-block;
            animation: bounceLetters 2s infinite;
          }
          .bounce-letters span:nth-child(1) { animation-delay: 0.1s; }
          .bounce-letters span:nth-child(2) { animation-delay: 0.2s; }
          .bounce-letters span:nth-child(3) { animation-delay: 0.3s; }
          .bounce-letters span:nth-child(4) { animation-delay: 0.4s; }
          .bounce-letters span:nth-child(5) { animation-delay: 0.5s; }
          .bounce-letters span:nth-child(6) { animation-delay: 0.6s; }
          .bounce-letters span:nth-child(7) { animation-delay: 0.7s; }
          .bounce-letters span:nth-child(8) { animation-delay: 0.8s; }
          .bounce-letters span:nth-child(9) { animation-delay: 0.9s; }
          .bounce-letters span:nth-child(10) { animation-delay: 1s; }
          .wave-emoji {
            animation: wave 2s ease-in-out infinite;
          }
          .rainbow-text {
            animation: rainbow 3s linear infinite;
          }
          .text-wave span {
            display: inline-block;
            animation: textWave 2s ease-in-out infinite;
          }
          .text-wave span:nth-child(1) { animation-delay: 0.1s; }
          .text-wave span:nth-child(2) { animation-delay: 0.2s; }
          .text-wave span:nth-child(3) { animation-delay: 0.3s; }
          .text-wave span:nth-child(4) { animation-delay: 0.4s; }
          .text-wave span:nth-child(5) { animation-delay: 0.5s; }
          .text-wave span:nth-child(6) { animation-delay: 0.6s; }
          .text-wave span:nth-child(7) { animation-delay: 0.7s; }
          .text-wave span:nth-child(8) { animation-delay: 0.8s; }
          .text-wave span:nth-child(9) { animation-delay: 0.9s; }
          .text-wave span:nth-child(10) { animation-delay: 1s; }
          .text-wave span:nth-child(11) { animation-delay: 1.1s; }
          .text-wave span:nth-child(12) { animation-delay: 1.2s; }
          .text-glow {
            animation: textGlow 3s ease-in-out infinite;
          }
          .slide-in-left {
            animation: slideInLeft 1s ease-out forwards;
          }
          .cosmic-float {
            animation: cosmicFloat 4s ease-in-out infinite;
          }
          .cosmic-glow {
            animation: cosmicGlow 3s ease-in-out infinite;
          }
          .letter-float span {
            display: inline-block;
            animation: letterFloat 3s ease-in-out infinite;
          }
          .letter-float span:nth-child(1) { animation-delay: 0.1s; }
          .letter-float span:nth-child(2) { animation-delay: 0.2s; }
          .letter-float span:nth-child(3) { animation-delay: 0.3s; }
          .letter-float span:nth-child(4) { animation-delay: 0.4s; }
          .letter-float span:nth-child(5) { animation-delay: 0.5s; }
          .letter-float span:nth-child(6) { animation-delay: 0.6s; }
          .letter-float span:nth-child(7) { animation-delay: 0.7s; }
          .letter-float span:nth-child(8) { animation-delay: 0.8s; }
          .rainbow-shift {
            animation: rainbowShift 4s linear infinite;
          }
          .pricing-float {
            animation: pricingFloat 3s ease-in-out infinite;
          }
          .pricing-glow {
            animation: pricingGlow 2s ease-in-out infinite;
          }
          .diamond-spin {
            animation: diamondSpin 4s linear infinite;
          }
         
          /* Security-Themed Animations */
          .security-float {
            animation: securityFloat 8s ease-in-out infinite;
          }
          .binary-rain {
            animation: binaryRain 12s linear infinite;
          }
          .api-key-float {
            animation: apiKeyFloat 10s ease-in-out infinite;
          }
          .data-stream {
            animation: dataStream 15s linear infinite;
          }
          .security-pulse {
            animation: securityPulse 3s ease-in-out infinite;
          }
          .security-connection {
            animation: connectionPulse 4s ease-in-out infinite;
          }
         
          @keyframes securityFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
            25% { transform: translateY(-20px) rotate(5deg); opacity: 0.6; }
            50% { transform: translateY(-10px) rotate(-3deg); opacity: 0.8; }
            75% { transform: translateY(-30px) rotate(7deg); opacity: 0.5; }
          }
         
          @keyframes binaryRain {
            0% { transform: translateY(-100vh); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
         
          @keyframes apiKeyFloat {
            0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
            25% { transform: translateX(15px) translateY(-10px) scale(1.1); }
            50% { transform: translateX(-10px) translateY(-20px) scale(0.9); }
            75% { transform: translateX(-15px) translateY(-5px) scale(1.05); }
          }
         
          @keyframes dataStream {
            0% { transform: translateX(-100px); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateX(calc(100vw + 100px)); opacity: 0; }
          }
         
          @keyframes securityPulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
            }
            50% {
              transform: scale(1.2);
              box-shadow: 0 0 40px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.3);
            }
          }
         
          @keyframes connectionPulse {
            0%, 100% { opacity: 0.2; stroke-width: 1; }
            50% { opacity: 0.8; stroke-width: 3; }
          }
         
          /* Additional Background Animations */
          @keyframes geometricFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.3; }
            25% { transform: translateY(-15px) rotate(90deg) scale(1.1); opacity: 0.5; }
            50% { transform: translateY(-8px) rotate(180deg) scale(0.9); opacity: 0.7; }
            75% { transform: translateY(-20px) rotate(270deg) scale(1.05); opacity: 0.4; }
          }
         
          @keyframes subtleGlow {
            0%, 100% {
              box-shadow: 0 0 10px rgba(0, 246, 255, 0.2);
              transform: scale(1);
            }
            50% {
              box-shadow: 0 0 20px rgba(0, 246, 255, 0.4), 0 0 30px rgba(255, 103, 196, 0.2);
              transform: scale(1.1);
            }
          }
         
          .geometric-float { animation: geometricFloat 12s ease-in-out infinite; }
          .subtle-glow { animation: subtleGlow 4s ease-in-out infinite; }
        `}</style>
       
        <div className="container mx-auto text-center max-w-5xl px-4">
          <div className="bounce-in" style={{animationDelay: '0.2s'}}>
            <Badge className="mb-6 bg-gray-100 text-black border-gray-300 backdrop-blur-sm float-animation">
              🔐 The Secure Developer Universe
            </Badge>
          </div>
         
          <div className="fade-in-up" style={{animationDelay: '0.5s'}}>
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-8 leading-tight">
              Where developers <span className="shimmer-text glow-text text-gray-700">secure</span>, build, and <span className="shimmer-text glow-text text-gray-700">collaborate</span>
            </h1>
          </div>
         
          <div className="fade-in-up" style={{animationDelay: '0.8s'}}>
            <p className="text-xl text-black/80 mb-10 max-w-3xl mx-auto leading-relaxed typewriter">
              Say goodbye to API chaos. DevVerse brings enterprise-grade security.
            </p>
          </div>
         
          <div className="fade-in-up" style={{animationDelay: '1.1s'}}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/auth">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 float-animation">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-400 text-black hover:bg-gray-100 px-8 py-6 text-lg bg-transparent backdrop-blur-sm hover:border-gray-600 transition-all duration-300 float-animation"
                style={{animationDelay: '0.5s'}}
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Dashboard Preview Section */}
      <section
        ref={(el) => { sectionRefs.current['dashboard-preview'] = el; }}
        className={`py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden transition-all duration-1000 ease-out ${
          visibleSections.has('dashboard-preview')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gray-100 text-black border-gray-300 backdrop-blur-sm animate-pulse">
              <span className="wave-emoji">⚡</span> COMMAND CENTER
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-6">
              <span className="bounce-letters">
                <span>Y</span><span>o</span><span>u</span><span>r</span><span> </span><span className="rainbow-text text-gray-700">D</span><span className="rainbow-text text-gray-700">e</span><span className="rainbow-text text-gray-700">v</span><span className="rainbow-text text-gray-700">e</span><span className="rainbow-text text-gray-700">l</span><span className="rainbow-text text-gray-700">o</span><span className="rainbow-text text-gray-700">p</span><span className="rainbow-text text-gray-700">e</span><span className="rainbow-text text-gray-700">r</span><span> </span>
              </span>
              <span className="bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent shimmer-text">
                Command Center
              </span>
            </h2>
            <p className="text-xl text-black/80 max-w-4xl mx-auto leading-relaxed fade-in-up" style={{animationDelay: '0.5s'}}>
              One dashboard to <span className="text-gray-700 font-semibold glow-text">secure your API keys</span>, track usage, and collaborate with your team.
              Stay in control with <span className="text-gray-600 font-semibold glow-text">real-time analytics</span>, alerts, and community highlights.
            </p>
          </div>

          {/* CSS Keyframes for Advanced Animations */}
          <style jsx>{`
            @keyframes float-magical {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              33% { transform: translateY(-15px) rotate(2deg); }
              66% { transform: translateY(-5px) rotate(-2deg); }
            }
            @keyframes glow-pulse {
              0%, 100% { box-shadow: 0 0 20px rgba(128, 128, 128, 0.4), 0 0 40px rgba(160, 160, 160, 0.2); }
              50% { box-shadow: 0 0 40px rgba(128, 128, 128, 0.8), 0 0 80px rgba(160, 160, 160, 0.6); }
            }
            @keyframes particle-dance {
              0% { transform: translate(0, 0) scale(0.8); opacity: 0.7; }
              50% { transform: translate(10px, -10px) scale(1.2); opacity: 1; }
              100% { transform: translate(-5px, 5px) scale(0.8); opacity: 0.7; }
            }
            @keyframes border-flow {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-float-magical { animation: float-magical 4s ease-in-out infinite; }
            .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
            .animate-particle-dance { animation: particle-dance 2s ease-in-out infinite; }
            .animate-border-flow {
              background: linear-gradient(45deg, transparent, #666666, #888888, #aaaaaa, transparent);
              background-size: 400% 400%;
              animation: border-flow 3s ease infinite;
            }
          `}</style>
         
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Secure API Vault - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[2px] transition-all duration-1000 hover:scale-110 hover:-translate-y-2 cursor-pointer animate-float-magical ${
              visibleSections.has('dashboard-preview')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '100ms'}}>
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-3xl p-[2px] animate-border-flow group-hover:p-[3px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/90 via-gray-50/60 to-white/90 backdrop-blur-xl rounded-3xl p-8 text-center h-full animate-glow-pulse">
                {/* Floating particles */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-gray-600 rounded-full animate-particle-dance opacity-0 group-hover:opacity-100"></div>
                <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-gray-700 rounded-full animate-particle-dance opacity-0 group-hover:opacity-100" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-12 left-6 w-3 h-3 bg-gray-500 rounded-full animate-particle-dance opacity-0 group-hover:opacity-100" style={{animationDelay: '1s'}}></div>
               
                {/* Spectacular icon container */}
                <div className="relative w-24 h-24 mx-auto mb-8 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-3xl animate-spin-slow group-hover:animate-spin transition-all duration-500"></div>
                  <div className="absolute inset-1 bg-white rounded-3xl flex items-center justify-center">
                    <span className="text-4xl relative z-10 group-hover:scale-110 transition-transform duration-500">🔑</span>
                  </div>
                  {/* Magical glow */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-gray-600/20 to-gray-800/20 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-2xl font-black text-black mb-4 bg-gradient-to-r from-black via-gray-600 to-gray-800 bg-clip-text text-transparent group-hover:from-gray-600 group-hover:to-gray-800 transition-all duration-500">
                  Secure API Vault
                </h3>
                <p className="text-black/80 group-hover:text-black transition-colors duration-500 leading-relaxed text-sm">
                  <span className="font-bold text-gray-800">Military-grade encryption</span> with quantum-resistant security protocols.
                </p>
               
                {/* Pulse effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-600/10 to-gray-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>

            {/* Team Activity Feed - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[2px] transition-all duration-1000 hover:scale-110 hover:-translate-y-2 cursor-pointer animate-float-magical ${
              visibleSections.has('dashboard-preview')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '200ms', animationDelay: '0.5s'}}>
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-3xl p-[2px] animate-border-flow group-hover:p-[3px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/90 via-gray-100/60 to-white/90 backdrop-blur-xl rounded-3xl p-8 text-center h-full animate-glow-pulse">
                {/* Activity indicators */}
                <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-2 h-2 bg-gray-700 rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                </div>
               
                {/* Spectacular icon container */}
                <div className="relative w-24 h-24 mx-auto mb-8 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500 rounded-3xl animate-spin-slow group-hover:animate-spin transition-all duration-500"></div>
                  <div className="absolute inset-1 bg-white rounded-3xl flex items-center justify-center">
                    <span className="text-4xl relative z-10 group-hover:scale-110 transition-transform duration-500">👥</span>
                  </div>
                  {/* Team pulse effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-gray-700/20 to-gray-500/20 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-2xl font-black text-black mb-4 bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent group-hover:from-gray-700 group-hover:to-gray-500 transition-all duration-500">
                  Team Activity Feed
                </h3>
                <p className="text-black/80 group-hover:text-black transition-colors duration-500 leading-relaxed text-sm">
                  <span className="font-bold text-gray-500">Real-time collaboration</span> with instant deployment notifications.
                </p>
               
                {/* Pulse effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-700/10 to-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>

            {/* Usage Analytics - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[2px] transition-all duration-1000 hover:scale-110 hover:-translate-y-2 cursor-pointer animate-float-magical ${
              visibleSections.has('dashboard-preview')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '300ms', animationDelay: '1s'}}>
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-3xl p-[2px] animate-border-flow group-hover:p-[3px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/90 via-gray-100/60 to-white/90 backdrop-blur-xl rounded-3xl p-8 text-center h-full animate-glow-pulse">
                {/* Animated chart visualization */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-2 h-8 bg-gradient-to-t from-gray-600 to-gray-700 rounded animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="w-2 h-12 bg-gradient-to-t from-gray-500 to-gray-600 rounded animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-6 bg-gradient-to-t from-gray-700 to-gray-800 rounded animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  <div className="w-2 h-10 bg-gradient-to-t from-gray-600 to-gray-500 rounded animate-bounce" style={{animationDelay: '0.6s'}}></div>
                </div>
               
                {/* Spectacular icon container */}
                <div className="relative w-24 h-24 mx-auto mb-8 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-3xl animate-spin-slow group-hover:animate-spin transition-all duration-500"></div>
                  <div className="absolute inset-1 bg-white rounded-3xl flex items-center justify-center">
                    <span className="text-4xl relative z-10 group-hover:scale-110 transition-transform duration-500">📊</span>
                  </div>
                  {/* Analytics glow */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-gray-600/20 to-gray-800/20 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-2xl font-black text-black mb-4 bg-gradient-to-r from-black via-gray-600 to-gray-800 bg-clip-text text-transparent group-hover:from-gray-600 group-hover:to-gray-800 transition-all duration-500">
                  Usage Analytics
                </h3>
                <p className="text-black/80 group-hover:text-black transition-colors duration-500 leading-relaxed text-sm">
                  <span className="font-bold text-gray-800">AI-powered insights</span> with predictive performance analytics.
                </p>
               
                {/* Pulse effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-600/10 to-gray-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>

            {/* Community Highlights - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[2px] transition-all duration-1000 hover:scale-110 hover:-translate-y-2 cursor-pointer animate-float-magical ${
              visibleSections.has('dashboard-preview')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '400ms', animationDelay: '1.5s'}}>
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-3xl p-[2px] animate-border-flow group-hover:p-[3px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/90 via-gray-100/60 to-white/90 backdrop-blur-xl rounded-3xl p-8 text-center h-full animate-glow-pulse">
                {/* Community network visualization */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="relative w-8 h-8">
                    <div className="absolute top-0 left-0 w-3 h-3 bg-gray-600 rounded-full animate-ping"></div>
                    <div className="absolute top-2 right-0 w-2 h-2 bg-gray-700 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
                    <div className="absolute bottom-0 left-1 w-2.5 h-2.5 bg-gray-800 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                    {/* Connection lines */}
                    <div className="absolute top-1 left-1 w-4 h-px bg-gradient-to-r from-gray-600 to-gray-700 opacity-60"></div>
                    <div className="absolute top-3 left-2 w-px h-3 bg-gradient-to-b from-gray-700 to-gray-800 opacity-60"></div>
                  </div>
                </div>
               
                {/* Spectacular icon container */}
                <div className="relative w-24 h-24 mx-auto mb-8 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-500 rounded-3xl animate-spin-slow group-hover:animate-spin transition-all duration-500"></div>
                  <div className="absolute inset-1 bg-white rounded-3xl flex items-center justify-center">
                    <span className="text-4xl relative z-10 group-hover:scale-110 transition-transform duration-500">🌍</span>
                  </div>
                  {/* Global glow */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-gray-600/20 to-gray-700/20 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-2xl font-black text-black mb-4 bg-gradient-to-r from-black via-gray-600 to-gray-700 bg-clip-text text-transparent group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-500">
                  Community Highlights
                </h3>
                <p className="text-black/80 group-hover:text-black transition-colors duration-500 leading-relaxed text-sm">
                  <span className="font-bold text-gray-700">Global developer network</span> with exclusive coding challenges.
                </p>
               
                {/* Pulse effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-600/10 to-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>
          </div>
         
          {/* Call to action */}
          <div className="text-center mt-16">
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 text-white font-bold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                Explore Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - SPECTACULAR */}
      <section
        ref={(el) => { sectionRefs.current['features'] = el; }}
        id="features"
        className={`py-32 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden transition-all duration-1000 ease-out ${
          visibleSections.has('features')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Enhanced CSS Animations for Features */}
        <style jsx>{`
          @keyframes feature-float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(1deg); }
            66% { transform: translateY(-5px) rotate(-1deg); }
          }
          @keyframes feature-glow {
            0%, 100% { box-shadow: 0 0 30px rgba(128, 128, 128, 0.4), 0 0 60px rgba(160, 160, 160, 0.3); }
            50% { box-shadow: 0 0 50px rgba(128, 128, 128, 0.7), 0 0 100px rgba(160, 160, 160, 0.5); }
          }
          @keyframes icon-pulse {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(5deg); }
          }
          @keyframes border-rainbow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-feature-float { animation: feature-float 6s ease-in-out infinite; }
          .animate-feature-glow { animation: feature-glow 4s ease-in-out infinite; }
          .animate-icon-pulse { animation: icon-pulse 3s ease-in-out infinite; }
          .animate-border-rainbow {
            background: linear-gradient(45deg, #666666, #888888, #aaaaaa, #999999, #777777, #666666);
            background-size: 400% 400%;
            animation: border-rainbow 4s ease infinite;
          }
        `}</style>
       
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-gray-200/20 to-gray-300/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-gray-300/20 to-gray-400/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-gray-200/10 to-gray-300/10 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
         
          {/* Floating particles */}
          <div className="absolute top-20 left-20 w-3 h-3 bg-gray-600 rounded-full opacity-60 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-40 right-32 w-2 h-2 bg-gray-700 rounded-full opacity-60 animate-bounce" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 left-40 w-4 h-4 bg-gray-500 rounded-full opacity-60 animate-bounce" style={{animationDelay: '3s'}}></div>
        </div>
       
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-8 bg-gray-100 text-black border border-gray-300 backdrop-blur-xl text-lg font-bold px-6 py-3 animate-pulse">
              <span className="wave-emoji">⚡</span> NEXT-GEN FEATURES
            </Badge>
           
            <h2 className="text-6xl md:text-7xl font-black text-black mb-8">
              <span className="text-wave">
                <span>E</span><span>v</span><span>e</span><span>r</span><span>y</span><span>t</span><span>h</span><span>i</span><span>n</span><span>g</span><span> </span><span>D</span><span>e</span><span>v</span><span>e</span><span>l</span><span>o</span><span>p</span><span>e</span><span>r</span><span>s</span>
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-700 via-black to-gray-600 bg-clip-text text-transparent text-glow">
                Need, In One Place
              </span>
            </h2>
           
            <p className="text-2xl text-black/90 max-w-4xl mx-auto leading-relaxed slide-in-left" style={{animationDelay: '0.5s'}}>
              From <span className="font-bold text-gray-700 glow-text">quantum-level security</span> to <span className="font-bold text-gray-600 glow-text">AI-powered collaboration</span>, DevVerse is your <span className="font-bold text-black glow-text">ultimate developer universe</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {/* Enterprise Security - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[3px] transition-all duration-1000 hover:scale-110 hover:-translate-y-4 cursor-pointer animate-feature-float ${
              visibleSections.has('features')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '100ms'}}>
              {/* Animated gray border */}
              <div className="absolute inset-0 rounded-3xl p-[3px] animate-border-rainbow group-hover:p-[4px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/95 via-gray-100/70 to-white/95 backdrop-blur-xl rounded-3xl p-10 h-full animate-feature-glow">
                {/* Floating security particles */}
                <div className="absolute top-6 right-6 w-3 h-3 bg-gray-700 rounded-full animate-ping opacity-0 group-hover:opacity-100" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-8 left-8 w-2 h-2 bg-gray-600 rounded-full animate-ping opacity-0 group-hover:opacity-100" style={{animationDelay: '1s'}}></div>
               
                {/* Spectacular icon container */}
                <div className="relative w-28 h-28 mx-auto mb-8 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-3xl animate-icon-pulse group-hover:animate-spin transition-all duration-500"></div>
                  <div className="absolute inset-2 bg-white rounded-3xl flex items-center justify-center">
                    <Shield className="w-12 h-12 text-black group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {/* Security aura */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-gray-600/30 to-gray-800/30 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-3xl font-black text-black mb-6 bg-gradient-to-r from-black via-gray-600 to-gray-800 bg-clip-text text-transparent group-hover:from-gray-600 group-hover:to-gray-800 transition-all duration-500">
                  Enterprise Security
                </h3>
                <p className="text-black/90 group-hover:text-black transition-colors duration-500 leading-relaxed text-lg">
                  <span className="font-bold text-gray-800">Quantum-resistant encryption</span> with zero-trust architecture and <span className="font-bold text-gray-600">military-grade protection</span>.
                </p>
               
                {/* Security indicators */}
                <div className="absolute bottom-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-3 h-3 bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-gray-600 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                  <div className="w-3 h-3 bg-gray-800 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                </div>
               
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-600/10 to-gray-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>

            {/* Lifecycle Management - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[3px] transition-all duration-1000 hover:scale-110 hover:-translate-y-4 cursor-pointer animate-feature-float ${
              visibleSections.has('features')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '200ms', animationDelay: '0.5s'}}>
              {/* Animated gray border */}
              <div className="absolute inset-0 rounded-3xl p-[3px] animate-border-rainbow group-hover:p-[4px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/95 via-gray-100/70 to-white/95 backdrop-blur-xl rounded-3xl p-10 h-full animate-feature-glow">
                {/* Rotating lifecycle indicators */}
                <div className="absolute top-6 right-6 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-2 h-2 bg-gray-700 rounded-full animate-spin"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-gray-600 rounded-full animate-spin" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 bg-gray-800 rounded-full animate-spin" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-gray-500 rounded-full animate-spin" style={{animationDelay: '1.5s'}}></div>
                </div>
               
                {/* Spectacular icon container */}
                <div className="relative w-28 h-28 mx-auto mb-8 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 rounded-3xl animate-icon-pulse group-hover:animate-spin transition-all duration-500"></div>
                  <div className="absolute inset-2 bg-white rounded-3xl flex items-center justify-center">
                    <RefreshCw className="w-12 h-12 text-black group-hover:scale-110 group-hover:rotate-180 transition-all duration-500" />
                  </div>
                  {/* Lifecycle aura */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-3xl font-black text-black mb-6 bg-gradient-to-r from-black via-gray-700 to-gray-600 bg-clip-text text-transparent group-hover:from-gray-700 group-hover:to-gray-600 transition-all duration-500">
                  Lifecycle Management
                </h3>
                <p className="text-black/90 group-hover:text-black transition-colors duration-500 leading-relaxed text-lg">
                  <span className="font-bold text-gray-700">AI-powered automation</span> for creating, rotating, and revoking keys with <span className="font-bold text-gray-600">zero downtime</span>.
                </p>
               
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-700/10 to-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>

            {/* Team Collaboration - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[3px] transition-all duration-1000 hover:scale-110 hover:-translate-y-4 cursor-pointer animate-feature-float ${
              visibleSections.has('features')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '300ms', animationDelay: '1s'}}>
              {/* Animated gray border */}
              <div className="absolute inset-0 rounded-3xl p-[3px] animate-border-rainbow group-hover:p-[4px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/95 via-gray-100/70 to-white/95 backdrop-blur-xl rounded-3xl p-10 h-full animate-feature-glow">
                {/* Team connection lines */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="relative w-12 h-12">
                    <div className="absolute top-0 left-0 w-4 h-4 bg-gray-600 rounded-full animate-pulse"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 bg-gray-700 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                    <div className="absolute bottom-0 left-2 w-3.5 h-3.5 bg-gray-800 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                    {/* Connection lines */}
                    <div className="absolute top-2 left-2 w-6 h-px bg-gradient-to-r from-gray-600 to-gray-700 opacity-70"></div>
                    <div className="absolute top-4 left-3 w-px h-4 bg-gradient-to-b from-gray-700 to-gray-800 opacity-70"></div>
                  </div>
                </div>
               
                {/* Spectacular icon container */}
                <div className="relative w-28 h-28 mx-auto mb-8 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-500 to-gray-700 rounded-3xl animate-icon-pulse group-hover:animate-spin transition-all duration-500"></div>
                  <div className="absolute inset-2 bg-white rounded-3xl flex items-center justify-center">
                    <Users className="w-12 h-12 text-black group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {/* Team aura */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-3xl font-black text-black mb-6 bg-gradient-to-r from-black via-gray-600 to-gray-700 bg-clip-text text-transparent group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-500">
                  Team Collaboration
                </h3>
                <p className="text-black/90 group-hover:text-black transition-colors duration-500 leading-relaxed text-lg">
                  <span className="font-bold text-gray-600">Real-time sync</span> with role-based access and <span className="font-bold text-gray-700">shared workspaces</span> for seamless teamwork.
                </p>
               
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-600/10 to-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>

            {/* Usage Analytics - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[3px] transition-all duration-1000 hover:scale-110 hover:-translate-y-4 cursor-pointer animate-feature-float ${
              visibleSections.has('features')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '400ms', animationDelay: '1.5s'}}>
              {/* Animated gray border */}
              <div className="absolute inset-0 rounded-3xl p-[3px] animate-border-rainbow group-hover:p-[4px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/95 via-gray-100/70 to-white/95 backdrop-blur-xl rounded-3xl p-10 h-full animate-feature-glow">
                {/* Analytics chart visualization */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-3 h-12 bg-gradient-to-t from-gray-600 to-gray-700 rounded animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="w-3 h-16 bg-gradient-to-t from-gray-500 to-gray-600 rounded animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-3 h-10 bg-gradient-to-t from-gray-700 to-gray-800 rounded animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  <div className="w-3 h-14 bg-gradient-to-t from-gray-600 to-gray-500 rounded animate-bounce" style={{animationDelay: '0.6s'}}></div>
                </div>
               
                {/* Spectacular icon container */}
                <div className="relative w-28 h-28 mx-auto mb-8 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-3xl animate-icon-pulse group-hover:animate-spin transition-all duration-500"></div>
                  <div className="absolute inset-2 bg-white rounded-3xl flex items-center justify-center">
                    <BarChart3 className="w-12 h-12 text-black group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {/* Analytics aura */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-3xl font-black text-black mb-6 bg-gradient-to-r from-black via-gray-600 to-gray-700 bg-clip-text text-transparent group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-500">
                  Usage Analytics
                </h3>
                <p className="text-black/90 group-hover:text-black transition-colors duration-500 leading-relaxed text-lg">
                  <span className="font-bold text-gray-600">AI-driven insights</span> with real-time monitoring and <span className="font-bold text-gray-700">predictive analytics</span> for performance optimization.
                </p>
               
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-600/10 to-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>

            {/* Smart Alerts - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[3px] transition-all duration-1000 hover:scale-110 hover:-translate-y-4 cursor-pointer animate-feature-float ${
              visibleSections.has('features')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '500ms', animationDelay: '2s'}}>
              {/* Animated gray border */}
              <div className="absolute inset-0 rounded-3xl p-[3px] animate-border-rainbow group-hover:p-[4px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/95 via-gray-100/70 to-white/95 backdrop-blur-xl rounded-3xl p-10 h-full animate-feature-glow">
                {/* Alert indicators */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="relative w-6 h-6">
                    <div className="absolute inset-0 bg-gray-700 rounded-full animate-ping"></div>
                    <div className="absolute inset-1 bg-gray-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
               
                {/* Spectacular icon container */}
                <div className="relative w-28 h-28 mx-auto mb-8 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 rounded-3xl animate-icon-pulse group-hover:animate-spin transition-all duration-500"></div>
                  <div className="absolute inset-2 bg-white rounded-3xl flex items-center justify-center">
                    <Bell className="w-12 h-12 text-black group-hover:scale-110 group-hover:animate-bounce transition-all duration-500" />
                  </div>
                  {/* Alert aura */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-3xl font-black text-black mb-6 bg-gradient-to-r from-black via-gray-700 to-gray-600 bg-clip-text text-transparent group-hover:from-gray-700 group-hover:to-gray-600 transition-all duration-500">
                  Smart Alerts
                </h3>
                <p className="text-black/90 group-hover:text-black transition-colors duration-500 leading-relaxed text-lg">
                  <span className="font-bold text-gray-700">AI-powered detection</span> of anomalies and upcoming expirations with <span className="font-bold text-gray-600">instant notifications</span>.
                </p>
               
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-700/10 to-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>

            {/* Audit Trails - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[3px] transition-all duration-1000 hover:scale-110 hover:-translate-y-4 cursor-pointer animate-feature-float ${
              visibleSections.has('features')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '600ms', animationDelay: '2.5s'}}>
              {/* Animated gray border */}
              <div className="absolute inset-0 rounded-3xl p-[3px] animate-border-rainbow group-hover:p-[4px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/95 via-gray-100/70 to-white/95 backdrop-blur-xl rounded-3xl p-10 h-full animate-feature-glow">
                {/* Audit trail lines */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="space-y-1">
                    <div className="w-8 h-0.5 bg-gray-600 rounded animate-pulse"></div>
                    <div className="w-6 h-0.5 bg-gray-700 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                    <div className="w-10 h-0.5 bg-gray-600 rounded animate-pulse" style={{animationDelay: '0.6s'}}></div>
                    <div className="w-4 h-0.5 bg-gray-800 rounded animate-pulse" style={{animationDelay: '0.9s'}}></div>
                  </div>
                </div>
               
                {/* Spectacular icon container */}
                <div className="relative w-28 h-28 mx-auto mb-8 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-3xl animate-icon-pulse group-hover:animate-spin transition-all duration-500"></div>
                  <div className="absolute inset-2 bg-white rounded-3xl flex items-center justify-center">
                    <FileText className="w-12 h-12 text-black group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {/* Audit aura */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-3xl font-black text-black mb-6 bg-gradient-to-r from-black via-gray-600 to-gray-700 bg-clip-text text-transparent group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-500">
                  Audit Trails
                </h3>
                <p className="text-black/90 group-hover:text-black transition-colors duration-500 leading-relaxed text-lg">
                  <span className="font-bold text-gray-600">Immutable logs</span> with timestamps and <span className="font-bold text-gray-700">compliance-ready reports</span> for enterprise governance.
                </p>
               
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-600/10 to-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How DevVerse Works Section - SPECTACULAR */}
      <section
        ref={(el) => { sectionRefs.current['how-it-works'] = el; }}
        className={`py-32 px-4 bg-white relative overflow-hidden transition-all duration-1000 ease-out ${
          visibleSections.has('how-it-works')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Enhanced CSS Animations for Get Started */}
        <style jsx>{`
          @keyframes step-float {
            0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
            33% { transform: translateY(-15px) rotate(2deg) scale(1.02); }
            66% { transform: translateY(-8px) rotate(-1deg) scale(1.01); }
          }
          @keyframes step-glow {
            0%, 100% { box-shadow: 0 0 40px rgba(128, 128, 128, 0.4), 0 0 80px rgba(160, 160, 160, 0.3); }
            50% { box-shadow: 0 0 60px rgba(128, 128, 128, 0.8), 0 0 120px rgba(160, 160, 160, 0.6); }
          }
          @keyframes number-pulse {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.2) rotate(10deg); }
          }
          @keyframes progress-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-step-float { animation: step-float 5s ease-in-out infinite; }
          .animate-step-glow { animation: step-glow 4s ease-in-out infinite; }
          .animate-number-pulse { animation: number-pulse 3s ease-in-out infinite; }
          .animate-progress-flow {
            background: linear-gradient(45deg, #666666, #888888, #aaaaaa, #999999, #666666);
            background-size: 400% 400%;
            animation: progress-flow 4s ease infinite;
          }
        `}</style>
       
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-60 -left-60 w-[600px] h-[600px] bg-gradient-to-r from-gray-200/30 to-gray-300/30 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-60 -right-60 w-[500px] h-[500px] bg-gradient-to-r from-gray-300/25 to-gray-400/25 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-gray-200/20 to-gray-300/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
         
          {/* Progress particles connecting steps */}
          <div className="absolute top-1/2 left-1/4 w-16 h-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded opacity-30 animate-pulse hidden lg:block"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-1 bg-gradient-to-r from-gray-700 to-gray-800 rounded opacity-30 animate-pulse hidden lg:block" style={{animationDelay: '1s'}}></div>
        </div>
       
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-24">
            <Badge className="mb-8 bg-gray-100 text-black border border-gray-300 backdrop-blur-xl text-xl font-black px-8 py-4 animate-pulse">
              🚀 INSTANT SETUP
            </Badge>
            <h2 className="text-6xl md:text-7xl font-black text-black mb-8 bg-gradient-to-r from-black via-gray-700 via-gray-600 to-black bg-clip-text text-transparent animate-pulse">
              Get Started in Minutes
            </h2>
            <p className="text-2xl text-black/90 max-w-4xl mx-auto leading-relaxed">
              No setup headaches. Just <span className="font-bold text-gray-700">secure collaboration</span> from <span className="font-bold text-gray-600">day one</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Step 1 - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[3px] transition-all duration-1000 hover:scale-115 hover:-translate-y-6 cursor-pointer animate-step-float ${
              visibleSections.has('how-it-works')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '200ms'}}>
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-3xl p-[3px] animate-progress-flow group-hover:p-[4px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/95 via-gray-50/80 to-white/95 backdrop-blur-xl rounded-3xl p-12 text-center h-full animate-step-glow">
                {/* Step indicator particles */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-4 h-4 bg-gray-600 rounded-full animate-ping"></div>
                </div>
               
                {/* Spectacular number container */}
                <div className="relative w-32 h-32 mx-auto mb-10 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-full animate-number-pulse group-hover:animate-spin transition-all duration-500"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <span className="text-5xl font-black text-black group-hover:scale-110 transition-transform duration-500">1</span>
                  </div>
                  {/* Step aura */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-3xl font-black text-black mb-6 bg-gradient-to-r from-black via-gray-600 to-gray-700 bg-clip-text text-transparent group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-500">
                  Create Your Workspace
                </h3>
                <p className="text-black/90 group-hover:text-black transition-colors duration-500 leading-relaxed text-lg">
                  Set up your <span className="font-bold text-gray-600">team workspace</span> and invite members with <span className="font-bold text-gray-700">appropriate permissions</span> in seconds.
                </p>
               
                {/* Workspace indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-gray-700 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
               
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-600/10 to-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>

            {/* Step 2 - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[3px] transition-all duration-1000 hover:scale-115 hover:-translate-y-6 cursor-pointer animate-step-float ${
              visibleSections.has('how-it-works')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '400ms', animationDelay: '0.5s'}}>
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-3xl p-[3px] animate-progress-flow group-hover:p-[4px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/95 via-gray-100/80 to-white/95 backdrop-blur-xl rounded-3xl p-12 text-center h-full animate-step-glow">
                {/* Security lock particles */}
                <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-3 h-3 bg-gray-700 rounded-full animate-ping"></div>
                </div>
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                </div>
               
                {/* Spectacular number container */}
                <div className="relative w-32 h-32 mx-auto mb-10 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 rounded-full animate-number-pulse group-hover:animate-spin transition-all duration-500"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <span className="text-5xl font-black text-black group-hover:scale-110 transition-transform duration-500">2</span>
                  </div>
                  {/* Security aura */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-3xl font-black text-black mb-6 bg-gradient-to-r from-black via-gray-700 to-gray-600 bg-clip-text text-transparent group-hover:from-gray-700 group-hover:to-gray-600 transition-all duration-500">
                  Add Your API Keys
                </h3>
                <p className="text-black/90 group-hover:text-black transition-colors duration-500 leading-relaxed text-lg">
                  <span className="font-bold text-gray-700">Securely store and organize</span> your API keys with <span className="font-bold text-gray-600">military-grade encryption</span>.
                </p>
               
                {/* Key visualization */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex space-x-1">
                    <div className="w-4 h-1 bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-6 h-1 bg-gray-600 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-3 h-1 bg-gray-700 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
               
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-700/10 to-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>

            {/* Step 3 - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[3px] transition-all duration-1000 hover:scale-115 hover:-translate-y-6 cursor-pointer animate-step-float ${
              visibleSections.has('how-it-works')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '600ms', animationDelay: '1s'}}>
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-3xl p-[3px] animate-progress-flow group-hover:p-[4px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/95 via-gray-100/80 to-white/95 backdrop-blur-xl rounded-3xl p-12 text-center h-full animate-step-glow">
                {/* Monitoring indicators */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="relative w-8 h-8">
                    <div className="absolute inset-0 bg-gray-600 rounded-full animate-ping"></div>
                    <div className="absolute inset-1 bg-gray-700 rounded-full animate-pulse"></div>
                  </div>
                </div>
               
                {/* Spectacular number container */}
                <div className="relative w-32 h-32 mx-auto mb-10 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-500 rounded-full animate-number-pulse group-hover:animate-spin transition-all duration-500"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <span className="text-5xl font-black text-black group-hover:scale-110 transition-transform duration-500">3</span>
                  </div>
                  {/* Monitor aura */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-3xl font-black text-black mb-6 bg-gradient-to-r from-black via-gray-600 to-gray-700 bg-clip-text text-transparent group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-500">
                  Monitor & Manage
                </h3>
                <p className="text-black/90 group-hover:text-black transition-colors duration-500 leading-relaxed text-lg">
                  <span className="font-bold text-gray-600">Track usage, rotate keys,</span> and receive <span className="font-bold text-gray-700">instant alerts</span> for optimal security.
                </p>
               
                {/* Activity dashboard visualization */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-2 h-6 bg-gradient-to-t from-gray-600 to-gray-700 rounded animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="w-2 h-8 bg-gradient-to-t from-gray-500 to-gray-700 rounded animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-4 bg-gradient-to-t from-gray-600 to-gray-800 rounded animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
               
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-600/10 to-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>
          </div>
         
          {/* Call to action */}
          <div className="text-center mt-20">
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-gray-700 via-black to-gray-600 hover:from-gray-600 hover:via-gray-900 hover:to-gray-500 text-white font-black px-12 py-6 text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 rounded-2xl">
                Start Building Now
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* The Complete Developer Universe Section - SPECTACULAR */}
      <section
        ref={(el) => { sectionRefs.current['beyond-keys'] = el; }}
        className={`py-32 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden transition-all duration-1000 ease-out ${
          visibleSections.has('beyond-keys')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Enhanced CSS Animations for Universe */}
        <style jsx>{`
          @keyframes universe-float {
            0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
            33% { transform: translateY(-20px) rotate(3deg) scale(1.03); }
            66% { transform: translateY(-10px) rotate(-2deg) scale(1.01); }
          }
          @keyframes universe-glow {
            0%, 100% { box-shadow: 0 0 50px rgba(128, 128, 128, 0.5), 0 0 100px rgba(160, 160, 160, 0.4); }
            50% { box-shadow: 0 0 80px rgba(128, 128, 128, 0.9), 0 0 150px rgba(160, 160, 160, 0.7); }
          }
          @keyframes cosmic-pulse {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.15) rotate(5deg); }
          }
          @keyframes galaxy-spin {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
            100% { transform: rotate(360deg) scale(1); }
          }
          @keyframes universe-border {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-universe-float { animation: universe-float 6s ease-in-out infinite; }
          .animate-universe-glow { animation: universe-glow 5s ease-in-out infinite; }
          .animate-cosmic-pulse { animation: cosmic-pulse 4s ease-in-out infinite; }
          .animate-galaxy-spin { animation: galaxy-spin 8s linear infinite; }
          .animate-universe-border {
            background: linear-gradient(45deg, #666666, #888888, #aaaaaa, #777777, #999999, #666666);
            background-size: 600% 600%;
            animation: universe-border 6s ease infinite;
          }
        `}</style>
       
        {/* Cosmic Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-80 -left-80 w-[700px] h-[700px] bg-gradient-to-r from-gray-300/30 to-gray-400/30 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-80 -right-80 w-[800px] h-[800px] bg-gradient-to-r from-gray-400/25 to-gray-500/25 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-gray-200/20 to-gray-300/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '6s'}}></div>
         
          {/* Floating cosmic particles */}
          <div className="absolute top-20 left-20 w-8 h-8 bg-gray-500 rounded-full animate-bounce opacity-30"></div>
          <div className="absolute top-40 right-32 w-6 h-6 bg-gray-600 rounded-full animate-bounce opacity-40" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-40 w-10 h-10 bg-gray-700 rounded-full animate-bounce opacity-25" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-20 w-7 h-7 bg-gray-400 rounded-full animate-bounce opacity-35" style={{animationDelay: '3s'}}></div>
        </div>
       
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-24">
            <Badge className="mb-8 bg-gray-100 text-gray-700 border border-gray-300 backdrop-blur-xl text-xl font-black px-8 py-4 cosmic-float">
              <span className="rainbow-shift">🌌</span> BEYOND KEY MANAGEMENT
            </Badge>
           
            <h2 className="text-6xl md:text-8xl font-black text-black mb-8 cosmic-glow">
              <span className="letter-float">
                <span>T</span><span>h</span><span>e</span><span> </span><span>C</span><span>o</span><span>m</span><span>p</span><span>l</span><span>e</span><span>t</span><span>e</span>
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-700 via-black via-gray-600 to-gray-800 bg-clip-text text-transparent shimmer-text">
                Developer Universe
              </span>
            </h2>
           
            <p className="text-2xl text-black/90 max-w-4xl mx-auto leading-relaxed fade-in-up" style={{animationDelay: '0.3s'}}>
              DevVerse is more than key storage — it's where your <span className="font-bold text-gray-700 glow-text">team builds together</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
            {/* Developer Workspace - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[3px] transition-all duration-1000 hover:scale-115 hover:-translate-y-6 cursor-pointer animate-universe-float ${
              visibleSections.has('beyond-keys')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '200ms'}}>
              {/* Animated cosmic border */}
              <div className="absolute inset-0 rounded-3xl p-[3px] animate-universe-border group-hover:p-[4px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/95 via-gray-50/80 to-white/95 backdrop-blur-xl rounded-3xl p-12 text-center h-full animate-universe-glow">
                {/* Workspace indicators */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="relative w-8 h-8">
                    <div className="absolute top-0 left-0 w-2 h-2 bg-gray-600 rounded-full animate-ping"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 bg-gray-700 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-0 left-1 w-2 h-2 bg-gray-800 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                  </div>
                </div>
               
                {/* Spectacular icon container */}
                <div className="relative w-28 h-28 mx-auto mb-10 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-3xl animate-cosmic-pulse group-hover:animate-galaxy-spin transition-all duration-500"></div>
                  <div className="absolute inset-2 bg-white rounded-3xl flex items-center justify-center">
                    <Code className="w-12 h-12 text-black group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {/* Workspace aura */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-3xl font-black text-black mb-6 bg-gradient-to-r from-black via-gray-600 to-gray-700 bg-clip-text text-transparent group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-500">
                  Developer Workspace
                </h3>
                <p className="text-black/90 group-hover:text-black transition-colors duration-500 leading-relaxed text-lg">
                  <span className="font-bold text-gray-600">Cloud IDE, API playground,</span> database runner, and more in <span className="font-bold text-gray-700">one unified environment</span>.
                </p>
               
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-600/10 to-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>

            {/* Projects - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[3px] transition-all duration-1000 hover:scale-115 hover:-translate-y-6 cursor-pointer animate-universe-float ${
              visibleSections.has('beyond-keys')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '300ms', animationDelay: '0.5s'}}>
              {/* Animated cosmic border */}
              <div className="absolute inset-0 rounded-3xl p-[3px] animate-universe-border group-hover:p-[4px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/95 via-gray-100/80 to-white/95 backdrop-blur-xl rounded-3xl p-12 text-center h-full animate-universe-glow">
                {/* Git visualization */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="relative w-10 h-10">
                    <div className="absolute top-1 left-1 w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
                    <div className="absolute top-1 right-1 w-2 h-2 bg-gray-700 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                    <div className="absolute bottom-1 left-3 w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                    {/* Branch lines */}
                    <div className="absolute top-2 left-2 w-6 h-px bg-gradient-to-r from-gray-600 to-gray-700 opacity-70"></div>
                    <div className="absolute top-4 left-4 w-px h-3 bg-gradient-to-b from-gray-700 to-gray-500 opacity-70"></div>
                  </div>
                </div>
               
                {/* Spectacular icon container */}
                <div className="relative w-28 h-28 mx-auto mb-10 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-500 rounded-3xl animate-cosmic-pulse group-hover:animate-galaxy-spin transition-all duration-500"></div>
                  <div className="absolute inset-2 bg-white rounded-3xl flex items-center justify-center">
                    <FolderGit2 className="w-12 h-12 text-black group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {/* Projects aura */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-3xl font-black text-black mb-6 bg-gradient-to-r from-black via-gray-600 to-gray-700 bg-clip-text text-transparent group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-500">
                  Projects
                </h3>
                <p className="text-black/90 group-hover:text-black transition-colors duration-500 leading-relaxed text-lg">
                  <span className="font-bold text-gray-600">Manage repositories, tasks,</span> deployments, and <span className="font-bold text-gray-700">version control</span> in one place.
                </p>
               
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-600/10 to-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>

            {/* Teams - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[3px] transition-all duration-1000 hover:scale-115 hover:-translate-y-6 cursor-pointer animate-universe-float ${
              visibleSections.has('beyond-keys')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '400ms', animationDelay: '1s'}}>
              {/* Animated cosmic border */}
              <div className="absolute inset-0 rounded-3xl p-[3px] animate-universe-border group-hover:p-[4px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/95 via-gray-100/80 to-white/95 backdrop-blur-xl rounded-3xl p-12 text-center h-full animate-universe-glow">
                {/* Team connection visualization */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="relative w-12 h-8">
                    <div className="absolute top-0 left-0 w-3 h-3 bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 bg-gray-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="absolute bottom-0 left-2 w-3 h-3 bg-gray-800 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    {/* Connection network */}
                    <div className="absolute top-1 left-1 w-8 h-px bg-gradient-to-r from-gray-700 to-gray-600 opacity-60"></div>
                    <div className="absolute top-2 left-3 w-px h-3 bg-gradient-to-b from-gray-600 to-gray-800 opacity-60"></div>
                  </div>
                </div>
               
                {/* Spectacular icon container */}
                <div className="relative w-28 h-28 mx-auto mb-10 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 rounded-3xl animate-cosmic-pulse group-hover:animate-galaxy-spin transition-all duration-500"></div>
                  <div className="absolute inset-2 bg-white rounded-3xl flex items-center justify-center">
                    <Users className="w-12 h-12 text-black group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {/* Teams aura */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-3xl font-black text-black mb-6 bg-gradient-to-r from-black via-gray-700 to-gray-600 bg-clip-text text-transparent group-hover:from-gray-700 group-hover:to-gray-600 transition-all duration-500">
                  Teams
                </h3>
                <p className="text-black/90 group-hover:text-black transition-colors duration-500 leading-relaxed text-lg">
                  <span className="font-bold text-gray-700">Team chat, shared snippets,</span> and role-based management for <span className="font-bold text-gray-600">seamless collaboration</span>.
                </p>
               
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-700/10 to-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>

            {/* Community - SPECTACULAR */}
            <div className={`group relative overflow-hidden rounded-3xl p-[3px] transition-all duration-1000 hover:scale-115 hover:-translate-y-6 cursor-pointer animate-universe-float ${
              visibleSections.has('beyond-keys')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`} style={{transitionDelay: '500ms', animationDelay: '1.5s'}}>
              {/* Animated cosmic border */}
              <div className="absolute inset-0 rounded-3xl p-[3px] animate-universe-border group-hover:p-[4px] transition-all duration-500">
                <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-xl"></div>
              </div>
             
              {/* Card content */}
              <div className="relative bg-gradient-to-br from-white/95 via-gray-100/80 to-white/95 backdrop-blur-xl rounded-3xl p-12 text-center h-full animate-universe-glow">
                {/* Global network visualization */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="relative w-10 h-10">
                    <div className="absolute top-0 left-0 w-3 h-3 bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                    <div className="absolute bottom-0 left-1 w-2.5 h-2.5 bg-gray-800 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                    {/* Connection lines */}
                    <div className="absolute top-1 left-1 w-4 h-px bg-gradient-to-r from-gray-700 to-gray-500 opacity-60"></div>
                    <div className="absolute top-3 left-2 w-px h-3 bg-gradient-to-b from-gray-500 to-gray-800 opacity-60"></div>
                  </div>
                </div>
               
                {/* Spectacular icon container */}
                <div className="relative w-28 h-28 mx-auto mb-10 group-hover:scale-125 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-500 to-gray-800 rounded-3xl animate-cosmic-pulse group-hover:animate-galaxy-spin transition-all duration-500"></div>
                  <div className="absolute inset-2 bg-white rounded-3xl flex items-center justify-center">
                    <Globe className="w-12 h-12 text-black group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {/* Community aura */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
               
                <h3 className="text-3xl font-black text-black mb-6 bg-gradient-to-r from-black via-gray-700 to-gray-800 bg-clip-text text-transparent group-hover:from-gray-700 group-hover:to-gray-800 transition-all duration-500">
                  Community
                </h3>
                <p className="text-black/90 group-hover:text-black transition-colors duration-500 leading-relaxed text-lg">
                  <span className="font-bold text-gray-700">Join forums, tutorials,</span> coding challenges and <span className="font-bold text-gray-800">leaderboards</span> to grow together.
                </p>
               
                {/* Community activity indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-2 h-2 bg-gray-700 rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
                  <div className="w-2 h-2 bg-gray-800 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                </div>
               
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-700/10 to-gray-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </div>
          </div>
         
          {/* Call to action */}
          <div className="text-center mt-20">
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-gray-700 via-black via-gray-600 via-gray-800 to-gray-500 hover:from-gray-600 hover:via-gray-900 hover:via-gray-500 hover:via-gray-700 hover:to-gray-400 text-white font-black px-12 py-6 text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 rounded-2xl">
                Explore the Universe
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section - Clean & Minimal */}
      <section
        ref={(el) => { sectionRefs.current['pricing'] = el; }}
        id="pricing"
        className={`py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden transition-all duration-1000 ease-out ${
          visibleSections.has('pricing')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Subtle background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-100 rounded-full filter blur-3xl"></div>
        </div>
       
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gray-100 text-black border border-gray-300 backdrop-blur-sm text-lg font-medium px-6 py-2 pricing-float">
              <span className="diamond-spin inline-block">💎</span> PRICING
            </Badge>
           
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 pricing-float" style={{animationDelay: '0.2s'}}>
              Simple, Transparent <span className="text-gray-700 pricing-glow">Pricing</span>
            </h2>
           
            <p className="text-xl text-black/70 max-w-2xl mx-auto fade-in-up" style={{animationDelay: '0.4s'}}>
              Start free and scale as your team grows.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-white border border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-lg relative group">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-black mb-2">Free</CardTitle>
                <div className="text-5xl font-black text-black mb-2">$0</div>
                <CardDescription className="text-gray-600 text-lg">
                  Perfect for individual developers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-black">
                    <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                    <span>Up to 10 API keys</span>
                  </div>
                  <div className="flex items-center text-black">
                    <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                    <span>Basic encryption</span>
                  </div>
                  <div className="flex items-center text-black">
                    <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                    <span>Email notifications</span>
                  </div>
                  <div className="flex items-center text-black">
                    <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                    <span>30-day audit logs</span>
                  </div>
                </div>
                <Link href="/auth">
                  <Button className="w-full bg-gray-100 hover:bg-gray-200 text-black border border-gray-300 hover:border-gray-400 font-semibold py-3 transition-all duration-300">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan - Most Popular */}
            <Card className="bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-300 hover:border-gray-500 transition-all duration-300 hover:shadow-xl relative group transform hover:scale-105">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-700 to-black text-white font-semibold px-4 py-1">
                Most Popular
              </Badge>
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-black mb-2">Pro</CardTitle>
                <div className="text-5xl font-black text-black mb-2">$29</div>
                <CardDescription className="text-gray-700 text-lg">
                  For teams and growing businesses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-black">
                    <Check className="w-5 h-5 text-gray-700 mr-3 flex-shrink-0" />
                    <span>Unlimited API keys</span>
                  </div>
                  <div className="flex items-center text-black">
                    <Check className="w-5 h-5 text-gray-700 mr-3 flex-shrink-0" />
                    <span>Advanced encryption</span>
                  </div>
                  <div className="flex items-center text-black">
                    <Check className="w-5 h-5 text-gray-700 mr-3 flex-shrink-0" />
                    <span>Team collaboration</span>
                  </div>
                  <div className="flex items-center text-black">
                    <Check className="w-5 h-5 text-gray-700 mr-3 flex-shrink-0" />
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center text-black">
                    <Check className="w-5 h-5 text-gray-700 mr-3 flex-shrink-0" />
                    <span>Priority support</span>
                  </div>
                </div>
                <Link href="/auth">
                  <Button className="w-full bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    Start Pro Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-white border border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-lg relative group">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-black mb-2">Enterprise</CardTitle>
                <div className="text-5xl font-black text-black mb-2">Custom</div>
                <CardDescription className="text-gray-600 text-lg">
                  For growing organizations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-black">
                    <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                    <span>Everything in Pro</span>
                  </div>
                  <div className="flex items-center text-black">
                    <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                    <span>Compliance tools</span>
                  </div>
                  <div className="flex items-center text-black">
                    <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                    <span>SSO integration</span>
                  </div>
                  <div className="flex items-center text-black">
                    <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                    <span>Priority support</span>
                  </div>
                  <div className="flex items-center text-black">
                    <Check className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                    <span>Dedicated success manager</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 text-white font-semibold py-3 transition-all duration-300">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced with Flying Reviews */}
      <section
        ref={(el) => { sectionRefs.current['testimonials'] = el; }}
        className={`py-20 px-4 bg-gradient-to-b from-[#0A0A0F] to-[#1B1B1B] transition-all duration-1000 ease-out relative overflow-hidden ${
          visibleSections.has('testimonials')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* CSS for paper airplane and dotted connections */}
        <style jsx>{`
          @keyframes fly {
            0% { transform: translateX(-100px) translateY(20px) rotate(-10deg); }
            25% { transform: translateX(200px) translateY(-10px) rotate(5deg); }
            50% { transform: translateX(600px) translateY(15px) rotate(-5deg); }
            75% { transform: translateX(900px) translateY(-5px) rotate(10deg); }
            100% { transform: translateX(1200px) translateY(10px) rotate(-5deg); }
          }
          @keyframes dotPulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
          .paper-airplane {
            animation: fly 15s linear infinite;
          }
          .dotted-line {
            animation: dotPulse 3s ease-in-out infinite;
          }
        `}</style>
       
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#5B2EFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#00F6FF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-[#FF67C4] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
       
        {/* Flying paper airplane */}
        <div className="absolute top-20 left-0 paper-airplane z-10">
          <div className="w-6 h-6 text-[#00F6FF] transform rotate-45">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </div>
        </div>
       
        {/* Connecting dotted lines */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            <defs>
              <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
                <circle cx="10" cy="10" r="1" fill="#00F6FF" className="dotted-line" />
              </pattern>
            </defs>
            <path d="M 200 300 Q 400 250 600 300 Q 800 350 1000 300" stroke="url(#dots)" strokeWidth="2" fill="none" className="hidden lg:block" />
            <path d="M 150 400 Q 350 380 550 400 Q 750 420 950 400" stroke="url(#dots)" strokeWidth="2" fill="none" className="hidden lg:block" />
          </svg>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Developers Worldwide</h2>
            <p className="text-[#A0A0A0] max-w-2xl mx-auto">Join thousands of developers who trust DevVerse to secure their applications.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Row 1 - 4 cards */}
            <Card className="bg-[#1E1E2D]/80 backdrop-blur-sm border border-[#2D2D3A] hover:border-[#5B2EFF]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#5B2EFF]/10 transform hover:-translate-y-1">
              <CardContent className="pt-4 pb-4">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
                <p className="text-white/90 mb-3 text-sm leading-relaxed">
                  "DevVerse transformed our security workflow. The automation saved us hours each week."
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#5B2EFF] to-[#00F6FF] rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold">SC</div>
                  <div>
                    <div className="font-semibold text-white text-sm">Sarah Chen</div>
                    <div className="text-xs text-[#A0A0A0]">CTO, TechCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E2D]/80 backdrop-blur-sm border border-[#2D2D3A] hover:border-[#00F6FF]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#00F6FF]/10 transform hover:-translate-y-1">
              <CardContent className="pt-4 pb-4">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
                <p className="text-white/90 mb-3 text-sm leading-relaxed">
                  "The alerts caught suspicious activity before it became a problem. Game-changer for our team."
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FF67C4] to-[#5B2EFF] rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold">MR</div>
                  <div>
                    <div className="font-semibold text-white text-sm">Mike Rodriguez</div>
                    <div className="text-xs text-[#A0A0A0]">Lead Developer, StartupXYZ</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E2D]/80 backdrop-blur-sm border border-[#2D2D3A] hover:border-[#FF67C4]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF67C4]/10 transform hover:-translate-y-1">
              <CardContent className="pt-4 pb-4">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
                <p className="text-white/90 mb-3 text-sm leading-relaxed">
                  "Clean, elegant, and powerful. Exactly what a modern development team needs."
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#00F6FF] to-[#FF67C4] rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold">EJ</div>
                  <div>
                    <div className="font-semibold text-white text-sm">Emily Johnson</div>
                    <div className="text-xs text-[#A0A0A0]">DevOps Engineer, CloudCo</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E2D]/80 backdrop-blur-sm border border-[#2D2D3A] hover:border-[#00E0B5]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#00E0B5]/10 transform hover:-translate-y-1">
              <CardContent className="pt-4 pb-4">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
                <p className="text-white/90 mb-3 text-sm leading-relaxed">
                  "API key management was a nightmare before DevVerse. Now it's seamless and secure."
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#00E0B5] to-[#5B2EFF] rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold">DK</div>
                  <div>
                    <div className="font-semibold text-white text-sm">David Kim</div>
                    <div className="text-xs text-[#A0A0A0]">Senior Engineer, DevHive</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Row 2 - 4 more cards */}
            <Card className="bg-[#1E1E2D]/80 backdrop-blur-sm border border-[#2D2D3A] hover:border-[#FF8E53]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF8E53]/10 transform hover:-translate-y-1">
              <CardContent className="pt-4 pb-4">
                <div className="flex mb-2">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                  <Star className="w-3 h-3 text-[#666]" />
                </div>
                <p className="text-white/90 mb-3 text-sm leading-relaxed">
                  "The team collaboration features are incredible. We ship 3x faster now."
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FF8E53] to-[#FF00E6] rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold">AL</div>
                  <div>
                    <div className="font-semibold text-white text-sm">Alex Liu</div>
                    <div className="text-xs text-[#A0A0A0]">Product Manager, NovaLabs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E2D]/80 backdrop-blur-sm border border-[#2D2D3A] hover:border-[#9E7BFF]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#9E7BFF]/10 transform hover:-translate-y-1">
              <CardContent className="pt-4 pb-4">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
                <p className="text-white/90 mb-3 text-sm leading-relaxed">
                  "Finally, a platform that doesn't make me compromise on security or usability."
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#9E7BFF] to-[#00F6FF] rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold">RS</div>
                  <div>
                    <div className="font-semibold text-white text-sm">Rachel Smith</div>
                    <div className="text-xs text-[#A0A0A0]">Security Lead, CyberFlow</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E2D]/80 backdrop-blur-sm border border-[#2D2D3A] hover:border-[#FF00E6]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF00E6]/10 transform hover:-translate-y-1">
              <CardContent className="pt-4 pb-4">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
                <p className="text-white/90 mb-3 text-sm leading-relaxed">
                  "DevVerse reduced our API security incidents by 95%. Absolutely essential tool."
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FF00E6] to-[#00E0B5] rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold">JM</div>
                  <div>
                    <div className="font-semibold text-white text-sm">James Miller</div>
                    <div className="text-xs text-[#A0A0A0]">CTO, FinTechPro</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E2D]/80 backdrop-blur-sm border border-[#2D2D3A] hover:border-[#00B8D9]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#00B8D9]/10 transform hover:-translate-y-1">
              <CardContent className="pt-4 pb-4">
                <div className="flex mb-2">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                  <Star className="w-3 h-3 text-[#666]" />
                </div>
                <p className="text-white/90 mb-3 text-sm leading-relaxed">
                  "The analytics dashboard gives us insights we never had before. Data-driven decisions."
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#00B8D9] to-[#5B2EFF] rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold">NT</div>
                  <div>
                    <div className="font-semibold text-white text-sm">Nina Torres</div>
                    <div className="text-xs text-[#A0A0A0]">Data Architect, MetricsCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={(el) => { sectionRefs.current['cta'] = el; }}
        className={`py-24 px-4 text-white relative overflow-hidden transition-all duration-1000 ease-out ${
          visibleSections.has('cta')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] to-[#1B1B1B] z-0">
          {/* Animated gradient orbs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-[#5B2EFF]/20 rounded-full filter blur-3xl mix-blend-multiply animate-blob"></div>
            <div className="absolute top-1/2 -right-1/4 w-[700px] h-[700px] bg-[#00F6FF]/20 rounded-full filter blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-1/4 left-1/3 w-[600px] h-[600px] bg-[#FF67C4]/20 rounded-full filter blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>
          </div>
        </div>
       
        <div className="container mx-auto text-center relative z-10 max-w-5xl">
          <Badge className="mb-6 bg-[#5B2EFF]/10 text-[#00F6FF] border border-[#5B2EFF]/30 hover:bg-[#5B2EFF]/20 px-4 py-1.5 text-sm font-medium">
            🚀 Join the Future of Development
          </Badge>
         
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#00F6FF] to-[#5B2EFF] bg-clip-text text-transparent">
            ✨ Enter the DevVerse Today
          </h2>
         
          <p className="text-xl text-[#A0A0A0] mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers who trust DevVerse to secure, build, and collaborate on their next big idea.
          </p>
         
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#5B2EFF] to-[#00F6FF] hover:from-[#5B2EFF]/90 hover:to-[#00F6FF]/90 text-black font-bold px-8 py-6 rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#5B2EFF]/20"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
           
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[#2D2D3A] bg-[#1E1E2D]/50 hover:bg-[#2D2D3A] hover:border-[#5B2EFF]/50 text-white px-8 py-6 rounded-xl font-medium text-lg transition-all duration-300"
            >
              Schedule Demo
            </Button>
          </div>
         
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-[#A0A0A0]">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-[#00F6FF] mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[#2D2D3A]"></div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-[#00F6FF] mr-2" />
              <span>14-day free trial</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[#2D2D3A]"></div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-[#00F6FF] mr-2" />
              <span>Cancel anytime</span>
            </div>
          </div>
         
          {/* Trust badges */}
          <div className="mt-12 pt-8 border-t border-[#2D2D3A]">
            <p className="text-sm text-[#A0A0A0] mb-4">Trusted by innovative teams at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <span className="text-white font-medium">TechCorp</span>
              <span className="text-white font-medium">StartupXYZ</span>
              <span className="text-white font-medium">CloudCo</span>
              <span className="text-white font-medium">DevHive</span>
              <span className="text-white font-medium">NovaLabs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        ref={(el) => { sectionRefs.current['footer'] = el; }}
        className={`bg-[#0A0A0F] border-t border-[#1E1E2D] py-16 px-4 transition-all duration-1000 ease-out ${
          visibleSections.has('footer')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            {/* Logo and description */}
            <div className="col-span-2">
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#5B2EFF] via-[#00F6FF] to-[#FF67C4] bg-clip-text text-transparent">
                  DevVerse
                </span>
              </div>
              <p className="text-[#A0A0A0] text-sm leading-relaxed mb-6 max-w-xs">
                The all-in-one platform for modern development teams to build, collaborate, and ship faster than ever before.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-[#1E1E2D] hover:bg-[#2D2D3A] border border-[#2D2D3A] flex items-center justify-center text-white/70 hover:text-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-[#1E1E2D] hover:bg-[#2D2D3A] border border-[#2D2D3A] flex items-center justify-center text-white/70 hover:text-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-[#1E1E2D] hover:bg-[#2D2D3A] border border-[#2D2D3A] flex items-center justify-center text-white/70 hover:text-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-white text-base mb-5">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#A0A0A0] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 group">
                  <span className="group-hover:text-[#5B2EFF] mr-1">→</span> Features
                </a></li>
                <li><a href="#" className="text-[#A0A0A0] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 group">
                  <span className="group-hover:text-[#00F6FF] mr-1">→</span> Pricing
                </a></li>
                <li><a href="#" className="text-[#A0A0A0] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 group">
                  <span className="group-hover:text-[#FF67C4] mr-1">→</span> Documentation
                </a></li>
                <li><a href="#" className="text-[#A0A0A0] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 group">
                  <span className="group-hover:text-[#5B2EFF] mr-1">→</span> Changelog
                </a></li>
                <li><a href="#" className="text-[#A0A0A0] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 group">
                  <span className="group-hover:text-[#00F6FF] mr-1">→</span> Roadmap
                </a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-white text-base mb-5">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#A0A0A0] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 group">
                  <span className="group-hover:text-[#FF67C4] mr-1">→</span> About Us
                </a></li>
                <li><a href="#" className="text-[#A0A0A0] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 group">
                  <span className="group-hover:text-[#5B2EFF] mr-1">→</span> Careers
                </a></li>
                <li><a href="#" className="text-[#A0A0A0] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 group">
                  <span className="group-hover:text-[#00F6FF] mr-1">→</span> Blog
                </a></li>
                <li><a href="#" className="text-[#A0A0A0] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 group">
                  <span className="group-hover:text-[#FF67C4] mr-1">→</span> Press
                </a></li>
                <li><a href="#" className="text-[#A0A0A0] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 group">
                  <span className="group-hover:text-[#5B2EFF] mr-1">→</span> Contact
                </a></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-semibold text-white text-base mb-5">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#A0A0A0] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 group">
                  <span className="group-hover:text-[#00F6FF] mr-1">→</span> Help Center
                </a></li>
                <li><a href="#" className="text-[#A0A0A0] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 group">
                  <span className="group-hover:text-[#FF67C4] mr-1">→</span> Community
                </a></li>
                <li><a href="#" className="text-[#A0A0A0] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 group">
                  <span className="group-hover:text-[#5B2EFF] mr-1">→</span> Status
                </a></li>
                <li><a href="#" className="text-[#A0A0A0] hover:text-white transition-colors text-sm inline-block hover:translate-x-1 group">
                  <span className="group-hover:text-[#00F6FF] mr-1">→</span> API Status
                </a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#1E1E2D] pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#6B7280] text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} DevVerse. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="text-[#6B7280] hover:text-[#5B2EFF] text-xs transition-colors hover:underline">Privacy Policy</a>
              <a href="#" className="text-[#6B7280] hover:text-[#00F6FF] text-xs transition-colors hover:underline">Terms of Service</a>
              <a href="#" className="text-[#6B7280] hover:text-[#FF67C4] text-xs transition-colors hover:underline">Security</a>
              <a href="#" className="text-[#6B7280] hover:text-[#5B2EFF] text-xs transition-colors hover:underline">Cookie Policy</a>
              <a href="#" className="text-[#6B7280] hover:text-[#00F6FF] text-xs transition-colors hover:underline">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}