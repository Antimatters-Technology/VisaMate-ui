'use client'

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('study');

  const countries = [
    { 
      name: 'Canada', 
      flag: '🇨🇦', 
      color: 'from-red-500 to-red-600',
      image: '/countries/canada.jpeg',
      description: 'Land of opportunities with best education and work opportunities'
    },
    { 
      name: 'USA', 
      flag: '🇺🇸', 
      color: 'from-blue-500 to-blue-600',
      image: '/countries/usa.jpg',
      description: 'The American dream awaits with top universities and innovative industries'
    },
    { 
      name: 'Australia', 
      flag: '🇦🇺', 
      color: 'from-green-500 to-green-600',
      image: '/countries/australia.jpg',
      description: 'Quality education and work-life balance in a beautiful environment'
    },
    { 
      name: 'UK', 
      flag: '🇬🇧', 
      color: 'from-purple-500 to-purple-600',
      image: '/countries/uk.jpg',
      description: 'Rich history meets modern education and career opportunities'
    }
  ];

  const visaTypes = [
    {
      id: 'study',
      title: 'Study Visa',
      description: 'Pursue your academic dreams abroad',
      icon: '🎓',
      features: ['University Applications', 'SOP Generation', 'Document Verification', 'Interview Preparation']
    },
    {
      id: 'work',
      title: 'Work Visa',
      description: 'Build your career internationally',
      icon: '💼',
      features: ['Job Search Support', 'Resume Optimization', 'Work Permit Guidance', 'Employer Documentation']
    },
    {
      id: 'visitor',
      title: 'Visitor Visa',
      description: 'Explore new destinations',
      icon: '✈️',
      features: ['Travel Planning', 'Document Preparation', 'Application Tracking', 'Visa Interview Prep']
    }
  ];

  const features = [
    {
      title: 'AI-Powered SOP Generator',
      description: 'Generate compelling Statement of Purpose documents instantly with our advanced AI technology, tailored to your specific requirements.',
      image: '/features/ai-sop.jpeg',
      icon: '🤖'
    },
    {
      title: 'Smart Document Management',
      description: 'Never miss a document with our intelligent checklist system and secure cloud storage for all your visa-related documents.',
      image: '/features/document-management.jpg',
      icon: '📋'
    },
    {
      title: 'Expert Consultation',
      description: 'Connect with certified immigration consultants for personalized guidance and expert advice throughout your visa journey.',
      image: '/features/expert-consultation.webp',
      icon: '👨‍💼'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="font-semibold text-xl text-gray-900">VisaMate</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#services" className="text-gray-600 hover:text-gray-900 transition-colors">Services</Link>
              <Link href="#countries" className="text-gray-600 hover:text-gray-900 transition-colors">Countries</Link>
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
              <Link href="/login" className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">Sign In</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Keeping as requested */}
      <section className="relative w-full h-[500px] md:h-[600px] flex items-center overflow-hidden mt-16">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/grl.jpg)',
            backgroundPosition: 'center right',
            backgroundSize: '85%', // Zoom out by making image larger
            zIndex: 0
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        
        <div
          className="relative z-10 h-full flex items-center"
          style={{
            width: '55%',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderTopRightRadius: '80% 100%',
            borderBottomRightRadius: '80% 100%',
            boxShadow: '0 0 60px 0 rgba(0,0,0,0.15)',
            padding: '3rem',
          }}
        >
          <div className="pl-12 pr-8 py-12 max-w-lg">
            <h1 className="text-4xl md:text-6xl font-extrabold text-black-600 mb-6 leading-tight">
              Effortless Visa Application & Guidance
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Your one-stop solution for document management, SOP generation, and expert support.
            </p>
            <a
              href="/documents"
              className="inline-block px-10 py-4 bg-blue-500 text-white rounded-xl text-xl font-semibold shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Application
            </a>
          </div>
        </div>
      </section>

      {/* Visa Types Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Visa Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're studying, working, or exploring, we've got you covered with comprehensive visa solutions.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl p-2 shadow-lg">
              {visaTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === type.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.title}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {visaTypes.find(t => t.id === activeTab)?.features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-blue-500 text-xl">✓</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature}</h3>
                <p className="text-gray-600 text-sm">
                  Professional guidance and support for your {feature.toLowerCase()} needs.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section id="countries" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert visa assistance for the world's most sought-after destinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {countries.map((country, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:scale-105">
                  {/* Country Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={country.image}
                      alt={`${country.name} visa services`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay with flag */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl shadow-lg">
                      {country.flag}
                    </div>
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{country.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {country.description}
                    </p>
                    
                    {/* Visa Types */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        Study Visa
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Work Visa
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        Visitor Visa
                      </div>
                    </div>
                    
                    <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose VisaMate?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of visa applications with our cutting-edge platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                {/* Feature Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Icon overlay */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl shadow-lg">
                    {feature.icon}
                  </div>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Visa Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful applicants who have achieved their dreams with VisaMate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/documents" className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Start Application
            </Link>
            <Link href="/consult" className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Book Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <span className="font-semibold text-xl">VisaMate</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner for visa applications and immigration services.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Study Visa</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Work Visa</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Visitor Visa</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Consultation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Countries</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Canada</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">USA</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Australia</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">UK</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} VisaMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}