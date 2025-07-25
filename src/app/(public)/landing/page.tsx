'use client'

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="VisaMate Logo" width={100} height={100} />
          <span className="font-bold text-xl text-blue-500">| VisaMate</span>
        </div>
        <nav className="space-x-6">
          <Link href="/features" className="text-gray-700 hover:text-blue-400">Features</Link>
          <Link href="/pricing" className="text-gray-700 hover:text-blue-400">Pricing</Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-400">Contact</Link>
          <Link href="/login" className="ml-4 px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500">Login</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[500px] md:h-[600px] flex items-center overflow-hidden">
        {/* Background Image with better positioning */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/hero-bg-new.png)',
            backgroundPosition: 'center right', // Adjust this to position the image better
            zIndex: 0
          }}
        >
          {/* Optional: Add a subtle overlay for better text contrast */}
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        
        {/* White Overlay with Curved Edge - More Transparent */}
        <div
          className="relative z-10 h-full flex items-center"
          style={{
            width: '55%', // Slightly wider for better balance
            background: 'rgba(255, 255, 255, 0.7)', // More transparent to show background
            backdropFilter: 'blur(8px)', // Less blur to show more of the background
            WebkitBackdropFilter: 'blur(8px)',
            borderTopRightRadius: '80% 100%', // Slightly less curved for better proportion
            borderBottomRightRadius: '80% 100%',
            boxShadow: '0 0 60px 0 rgba(0,0,0,0.15)',
            padding: '3rem',
          }}
        >
          <div className="pl-12 pr-8 py-12 max-w-lg">
            <h1 className="text-4xl md:text-6xl font-extrabold text-blue-600 mb-6 leading-tight">
              Effortless Visa<br />Application & Guidance
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

      {/* Quick Actions */}
      <section className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <ActionCard
            title="Start Application"
            description="Begin your visa journey with our guided process."
            image="/action-apply.jpg"
            link="/start"
          />
          <ActionCard
            title="Track Status"
            description="Monitor your application progress in real-time."
            image="/action-track.jpg"
            link="/status"
          />
          <ActionCard
            title="Book Consultation"
            description="Get expert advice from certified consultants."
            image="/action-consult.jpg"
            link="/consult"
          />
        </div>
      </section>

      {/* Features/Education */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-8">
          <h2 className="text-2xl font-bold mb-8 text-blue-500">Why Choose VisaMate?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="AI-Powered SOP Generator"
              description="Generate Statement of Purpose documents instantly with AI."
              image="/feature-sop.webp"
            />
            <FeatureCard
              title="Document Checklist"
              description="Never miss a document with our smart checklist."
              image="/feature-checklist.png"
            />
            <FeatureCard
              title="Secure Document Storage"
              description="Your documents are safe and accessible anytime."
              image="/feature-storage.jpg"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-400 text-white py-8 mt-12">
        <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <span className="font-bold text-lg">VisaMate</span> &copy; {new Date().getFullYear()}
          </div>
          <div className="space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Updated ActionCard component with improved styling
function ActionCard({ title, description, image, link }: { title: string; description: string; image: string; link: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        <h3 className="font-bold text-xl mb-3 text-gray-900 text-center">
          {title}
        </h3>
        <p className="text-gray-600 mb-6 text-center leading-relaxed">
          {description}
        </p>
        
        {/* Button */}
        <div className="flex justify-center">
          <a
            href={link}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-200 text-center flex items-center justify-center group"
          >
            Learn more 
            <span className="ml-2 text-lg group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

// FeatureCard component
// Updated FeatureCard component with same styling as ActionCard
function FeatureCard({ title, description, image }: { title: string; description: string; image: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        <h3 className="font-bold text-xl mb-3 text-gray-900 text-center">
          {title}
        </h3>
        <p className="text-gray-600 text-center leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}