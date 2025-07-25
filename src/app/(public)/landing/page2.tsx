'use client'

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, Shield, Zap, FileText, Users, Star, Menu, X, Sparkles, Globe, Award, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden relative">
      {/* Cursor Following Light */}
      <div 
        className="fixed w-96 h-96 pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 50%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Ultra Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Orbs */}
        <div className="absolute -top-60 -right-60 w-[600px] h-[600px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-mega-blob"></div>
        <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-mega-blob animation-delay-3000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-mega-blob animation-delay-6000"></div>
        
        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Ultra Premium Header */}
      <header className={`fixed w-full z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-black/80 backdrop-blur-2xl shadow-2xl border-b border-white/10' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-pulse-glow">
                  <Sparkles className="text-white w-6 h-6" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50 animate-pulse-glow animation-delay-1000"></div>
              </div>
              <span className="font-black text-3xl bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent tracking-tight">
                VisaMate
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {['Features', 'Pricing', 'Success Stories', 'Contact'].map((item, i) => (
                <a 
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '-')}`} 
                  className="relative text-gray-300 hover:text-white transition-all duration-300 group"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
              <button className="relative px-8 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-2xl shadow-blue-500/30 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 group overflow-hidden">
                <span className="relative z-10">Start Free Trial</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white relative z-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 transform transition-all duration-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
            <nav className="flex flex-col p-6 space-y-6">
              {['Features', 'Pricing', 'Success Stories', 'Contact'].map((item, i) => (
                <a 
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '-')}`} 
                  className="text-gray-300 hover:text-white transition-all duration-300 text-lg"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {item}
                </a>
              ))}
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                Start Free Trial
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* 3D Floating Elements */}
        <div className="absolute inset-0 perspective-1000">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl opacity-20 animate-float-3d transform rotate-45"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-30 animate-float-3d animation-delay-2000 transform -rotate-12"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl opacity-25 animate-float-3d animation-delay-4000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            {/* Premium Badge */}
            <div className="mb-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300 font-medium">🚀 #1 AI-Powered Visa Platform</span>
                <Award className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-none tracking-tighter animate-fade-in-up animation-delay-300">
              <span className="block">VISA</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-shift bg-300%">
                SUCCESS
              </span>
              <span className="block text-4xl md:text-6xl lg:text-7xl font-light text-gray-300 mt-4">
                Guaranteed
              </span>
            </h1>
            
            {/* Sub-headline */}
            <p className="text-xl md:text-3xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto animate-fade-in-up animation-delay-600 font-light">
              Transform your visa dreams into reality with 
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold"> AI-powered precision</span>, 
              expert guidance, and a 
              <span className="text-green-400 font-semibold">98% approval rate</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up animation-delay-900">
              <button className="group relative px-12 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-2xl text-xl font-bold shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 transform hover:scale-110 overflow-hidden">
                <span className="relative z-10 flex items-center gap-3">
                  Start Your Journey
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
              
              <button className="group px-12 py-5 border-2 border-gray-400 text-gray-300 rounded-2xl text-xl font-bold hover:bg-white hover:text-black transition-all duration-500 transform hover:scale-105 backdrop-blur-sm">
                <span className="flex items-center gap-3">
                  <Globe size={24} />
                  Watch Success Stories
                </span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in-up animation-delay-1200">
              <StatCard number="50K+" label="Applications Approved" icon={<CheckCircle className="w-8 h-8" />} />
              <StatCard number="98%" label="Success Rate" icon={<TrendingUp className="w-8 h-8" />} />
              <StatCard number="24/7" label="AI Support" icon={<Zap className="w-8 h-8" />} />
              <StatCard number="150+" label="Countries" icon={<Globe className="w-8 h-8" />} />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-6 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
              Your Success Path
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of visa applications with our revolutionary AI-driven process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ProcessCard
              step="01"
              title="AI Analysis"
              description="Our advanced AI analyzes your profile, destination requirements, and success patterns to create your personalized roadmap."
              icon={<Zap size={40} />}
              gradient="from-blue-500 to-cyan-500"
              delay="0"
            />
            <ProcessCard
              step="02"
              title="Smart Generation"
              description="Generate perfect SOPs, cover letters, and documents tailored to your specific case with our GPT-powered engine."
              icon={<FileText size={40} />}
              gradient="from-purple-500 to-pink-500"
              delay="200"
            />
            <ProcessCard
              step="03"
              title="Expert Review"
              description="Certified immigration experts review your application and provide personalized feedback for maximum success."
              icon={<Users size={40} />}
              gradient="from-green-500 to-blue-500"
              delay="400"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-slate-900/50 to-black relative overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
              Revolutionary
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
              Powered by cutting-edge AI and trusted by visa applicants worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <UltraFeatureCard
              title="AI-Powered SOP Magic"
              description="Generate compelling Statement of Purpose documents that tell your unique story and impress visa officers."
              icon="🤖"
              features={["GPT-4 Integration", "Country-Specific Templates", "Real-time Optimization"]}
            />
            <UltraFeatureCard
              title="Smart Document Guardian"
              description="Never miss a document with our intelligent checklist that adapts to your visa type and destination."
              icon="📋"
              features={["Dynamic Requirements", "Deadline Tracking", "Progress Analytics"]}
            />
            <UltraFeatureCard
              title="Fortress-Level Security"
              description="Your sensitive documents are protected with military-grade encryption and secure cloud infrastructure."
              icon="🔒"
              features={["256-bit Encryption", "GDPR Compliant", "Zero-Knowledge Architecture"]}
            />
            <UltraFeatureCard
              title="24/7 AI Assistant"
              description="Get instant answers to your visa questions from our trained AI that knows immigration laws inside out."
              icon="💬"
              features={["Instant Responses", "Multi-language Support", "Legal Database Access"]}
            />
            <UltraFeatureCard
              title="Success Predictor"
              description="Our AI analyzes thousands of successful applications to predict your approval chances."
              icon="🎯"
              features={["Predictive Analytics", "Risk Assessment", "Success Optimization"]}
            />
            <UltraFeatureCard
              title="Expert Network"
              description="Connect with certified immigration lawyers and consultants for personalized guidance."
              icon="🌟"
              features={["Verified Experts", "Video Consultations", "Priority Support"]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
              Success
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Stories</span>
            </h2>
            <p className="text-2xl text-gray-300">Real people, real results, real dreams achieved</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <UltraTestimonialCard
              quote="VisaMate's AI generated the perfect SOP for my MBA application. I got into Harvard and my visa was approved in just 5 days!"
              author="Priya Sharma"
              role="MBA Student, Harvard Business School"
              country="🇺🇸 USA"
              rating={5}
              image="👩‍🎓"
            />
            <UltraTestimonialCard
              quote="The document checklist saved me from rejection. Every requirement was perfectly organized and I never missed a deadline."
              author="Ahmed Hassan"
              role="Software Engineer"
              country="🇨🇦 Canada"
              rating={5}
              image="👨‍💻"
            />
            <UltraTestimonialCard
              quote="The expert consultation was invaluable. My consultant guided me through every step and I got my visa approved first try!"
              author="Maria Rodriguez"
              role="Research Scientist"
              country="🇬🇧 UK"
              rating={5}
              image="👩‍🔬"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-black to-slate-900 border-t border-white/10 py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="text-white w-6 h-6" />
                </div>
                <span className="font-black text-2xl text-white">VisaMate</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Transforming visa applications with AI-powered precision, expert guidance, and guaranteed success.
              </p>
              <div className="flex space-x-4">
                <SocialButton>🐦</SocialButton>
                <SocialButton>📘</SocialButton>
                <SocialButton>💼</SocialButton>
                <SocialButton>📷</SocialButton>
              </div>
            </div>
            
            <FooterColumn
              title="Product"
              links={['AI SOP Generator', 'Document Checklist', 'Expert Network', 'Success Predictor']}
            />
            
            <FooterColumn
              title="Support"
              links={['Help Center', '24/7 Chat', 'Video Tutorials', 'Community Forum']}
            />
            
            <FooterColumn
              title="Company"
              links={['About Us', 'Careers', 'Press Kit', 'Partner With Us']}
            />
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2025 VisaMate. All rights reserved. Made with ❤️ for dreamers worldwide.
            </p>
            <div className="flex items-center gap-6 text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/cookies" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes mega-blob {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(100px, -100px) scale(1.1) rotate(90deg);
          }
          50% {
            transform: translate(-50px, 100px) scale(0.9) rotate(180deg);
          }
          75% {
            transform: translate(-100px, -50px) scale(1.05) rotate(270deg);
          }
        }
        
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100px) rotate(180deg);
            opacity: 1;
          }
        }
        
        @keyframes float-3d {
          0%, 100% {
            transform: translateY(0px) rotateX(0deg) rotateY(0deg);
          }
          33% {
            transform: translateY(-30px) rotateX(15deg) rotateY(15deg);
          }
          66% {
            transform: translateY(15px) rotateX(-10deg) rotateY(-10deg);
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(147, 51, 234, 0.7);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-mega-blob {
          animation: mega-blob 20s infinite ease-in-out;
        }
        
        .animate-float-particle {
          animation: float-particle linear infinite;
        }
        
        .animate-float-3d {
          animation: float-3d 8s ease-in-out infinite;
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 4s ease infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-900 { animation-delay: 900ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1200 { animation-delay: 1200ms; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-6000 { animation-delay: 6s; }
        
        .bg-300% { background-size: 300% 300%; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
}

function StatCard({ number, label, icon }) {
  return (
    <div className="group text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
      <div className="text-blue-400 mb-3 flex justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
        {number}
      </div>
      <div className="text-gray-400 font-medium">{label}</div>
    </div>
  );
}

function ProcessCard({ step, title, description, icon, gradient, delay }) {
  return (
    <div 
      className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-4 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-4 right-4 text-6xl font-black text-white/10 group-hover:text-white/20 transition-colors">
        {step}
      </div>
      
      <div className={`w-20 h-20 bg-gradient-to-r ${gradient} rounded-3xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
        {icon}
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
        {title}
      </h3>
      
      <p className="text-gray-300 leading-relaxed">
        {description}
      </p>
      
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
    </div>
  );
}

function UltraFeatureCard({ title, description, icon, features }) {
  return (
    <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105 overflow-hidden">
      <div className="text-6xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
        {title}
      </h3>
      
      <p className="text-gray-300 mb-6 leading-relaxed">
        {description}
      </p>
      
      <div className="space-y-2">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle size={16} className="text-green-400" />
            {feature}
          </div>
        ))}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}

function UltraTestimonialCard({ quote, author, role, country, rating, image }) {
  return (
    <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105">
      <div className="text-4xl mb-4 text-center">{image}</div>
      
      <div className="flex mb-4 justify-center">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={16} className="text-yellow-400 fill-current" />
        ))}
      </div>
      
      <blockquote className="text-gray-300 mb-6 italic text-center leading-relaxed">
        "{quote}"
      </blockquote>
      
      <div className="text-center">
        <div className="font-bold text-white mb-1">{author}</div>
        <div className="text-gray-400 text-sm mb-2">{role}</div>
        <div className="text-blue-400 text-sm font-medium">{country}</div>
      </div>
    </div>
  );
}

function SocialButton({ children }) {
  return (
    <button className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/40 text-white hover:scale-110 transition-all duration-300 flex items-center justify-center">
      {children}
    </button>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="font-bold text-white mb-6 text-lg">{title}</h3>
      <div className="space-y-3">
        {links.map((link, i) => (
          <a key={i} href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}