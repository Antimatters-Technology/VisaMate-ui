'use client'

import { Suspense, useState } from 'react'
import { notFound } from 'next/navigation'
import { Star, MapPin, Users, CheckCircle, Calendar, Video, MessageCircle, Award, Globe, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import BookingModal from '@/features/consultant/BookingModal'

// Mock data - will be replaced with API calls
const mockConsultant = {
  id: 1,
  name: "Apple Abroads",
  title: "RCIC Licensed Immigration Consultancy",
  location: "Toronto, Canada",
  rating: 4.9,
  reviewCount: 15,
  successRate: 100,
  clientsHelped: 25,
  specialties: ["Canada Study Permits"],
  languages: ["English", "Hindi", "Punjabi"],
  pricing: {
    consultation: 150,
    documentReview: 100,
    applicationSupport: 800
  },
  verified: true,
  logo: "/apple-abroads-logo.svg",
  coverImage: "/api/placeholder/800/200",
  badge: "Top Rated",
  bio: "Apple Abroads is a leading RCIC licensed immigration consultancy with over 8 years of experience helping Indian students achieve their Canadian education dreams. We specialize exclusively in Canada Study Permits with our team of expert consultants who understand both Indian and Canadian education systems.",
  credentials: [
    "RCIC Licensed Immigration Consultancy - License R706543",
    "Member of Immigration Consultants of Canada Regulatory Council (ICCRC)",
    "Specialized Team for Indian Student Applications",
    "100% Success Rate for Study Permit Applications",
    "Government Authorized Immigration Services"
  ],
  experience: "8+ years",
  responseTime: "Within 2 hours",
  availability: "Mon-Fri 9AM-6PM EST",
  videoCallEnabled: true,
  servicesOffered: [
    {
      name: "Initial Consultation",
      description: "1-hour assessment of your immigration options",
      price: 150,
      duration: "60 minutes"
    },
    {
      name: "Document Review",
      description: "Complete review of your application documents",
      price: 100,
      duration: "30 minutes"
    },
    {
      name: "Full Application Support",
      description: "End-to-end support for your immigration application",
      price: 800,
      duration: "3-6 months"
    }
  ],
  reviews: [
    {
      id: 1,
      name: "Arjun Sharma",
      rating: 5,
      date: "2024-01-15",
      comment: "Apple Abroads team was incredibly helpful throughout my study permit application for University of Toronto. Their expertise and attention to detail made the process smooth and stress-free. Got my visa in just 3 weeks! Highly recommended consultancy!",
      verified: true
    },
    {
      id: 2,
      name: "Priyanka Gupta",
      rating: 5,
      date: "2024-01-10",
      comment: "Outstanding service! Apple Abroads helped me get my study permit for Seneca College. They understood my background from India and guided me perfectly. Professional and knowledgeable consultancy.",
      verified: true
    },
    {
      id: 3,
      name: "Vikram Singh",
      rating: 5,
      date: "2024-01-05",
      comment: "Very responsive and professional consultancy. Apple Abroads team answered all my questions in Hindi when needed and provided clear guidance for my study permit application to Conestoga College. 100% recommended!",
      verified: true
    }
  ]
}

function ConsultantHeader({ onBookingClick }: { onBookingClick: () => void }) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div 
        className="h-48 bg-gradient-to-r from-blue-600 to-blue-800"
        style={{
          backgroundImage: `url(${mockConsultant.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 pb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Consultant Logo */}
            <div className="flex justify-center mb-6">
              <img
                src={mockConsultant.logo}
                alt={`${mockConsultant.name} Logo`}
                className="h-16 w-auto object-contain max-w-xs"
              />
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{mockConsultant.name}</h1>
                      {mockConsultant.verified && (
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      )}
                      <Badge variant="default">{mockConsultant.badge}</Badge>
                    </div>
                    <p className="text-lg text-gray-600 mb-3">{mockConsultant.title}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {mockConsultant.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{mockConsultant.rating}</span>
                        <span>({mockConsultant.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {mockConsultant.clientsHelped}+ clients helped
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {mockConsultant.successRate}% success rate
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mockConsultant.specialties.slice(0, 4).map((specialty) => (
                        <Badge key={specialty} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-3 lg:items-end">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={onBookingClick}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Consultation
                    </Button>
                    <Button variant="outline" size="lg">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Responds within 2 hours
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AboutSection() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">About</h2>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed mb-6">{mockConsultant.bio}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Quick Facts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Experience:</span>
                <span className="font-medium">{mockConsultant.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Response Time:</span>
                <span className="font-medium">{mockConsultant.responseTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Availability:</span>
                <span className="font-medium">{mockConsultant.availability}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Video Calls:</span>
                <span className="font-medium flex items-center gap-1">
                  {mockConsultant.videoCallEnabled ? (
                    <>
                      <Video className="w-4 h-4 text-green-500" />
                      Available
                    </>
                  ) : (
                    'Not available'
                  )}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {mockConsultant.languages.map((language) => (
                <Badge key={language} variant="outline" className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



function CredentialsSection() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Credentials & Certifications</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockConsultant.credentials.map((credential, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{credential}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ReviewsSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Reviews ({mockConsultant.reviewCount})</h2>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-semibold">{mockConsultant.rating}</span>
            <span className="text-gray-500">out of 5</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockConsultant.reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {review.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{review.name}</h4>
                    {review.verified && (
                      <Badge variant="outline" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ConsultantProfilePage({ params }: { params: { id: string } }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  
  // In a real app, fetch consultant data based on params.id
  // const consultant = await fetchConsultant(params.id)
  // if (!consultant) notFound()

  const handleBookingClick = () => {
    setIsBookingModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ConsultantHeader onBookingClick={handleBookingClick} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <AboutSection />
            <CredentialsSection />
            <ReviewsSection />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Widget */}
            <Card className="sticky top-6">
              <CardHeader>
                <h3 className="font-semibold">Book a Consultation</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      Starting from ₹{(mockConsultant.pricing.consultation * 80).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">For consultation</div>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleBookingClick}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Select Date & Time
                  </Button>
                  
                  <div className="text-center text-sm text-gray-500">
                    Free cancellation up to 24 hours before
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Contact Information</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <div className="text-sm text-gray-600 text-center">
                  Response time: {mockConsultant.responseTime}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        consultant={{
          id: mockConsultant.id,
          name: mockConsultant.name,
          title: mockConsultant.title,
          rating: mockConsultant.rating,
          pricing: mockConsultant.pricing
        }}
      />
    </div>
  )
} 