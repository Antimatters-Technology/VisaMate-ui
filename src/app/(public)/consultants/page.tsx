'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { Search, Filter, Star, MapPin, Users, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { useStudentProfile } from '@/stores/student-profile'

// Mock data - will be replaced with API calls
const mockConsultants = [
  {
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
    startingPrice: 15000,
    verified: true,
    logo: "/apple-abroads-logo.svg",
    badge: "Top Rated",
    licenseNumber: "R706543",
    experience: "8+ years helping Indian students"
  },
  {
    id: 2,
    name: "Arrive Safe Immigration",
    title: "Government Authorized Immigration Services",
    location: "Vancouver, Canada",
    rating: 4.8,
    reviewCount: 12,
    successRate: 100,
    clientsHelped: 18,
    specialties: ["Canada Study Permits"],
    languages: ["English", "Hindi", "Gujarati"],
    startingPrice: 12000,
    verified: true,
    logo: "/arrive-safe-logo.svg",
    badge: "Authorized Expert",
    licenseNumber: "R704892",
    experience: "6+ years specializing in Indian applications"
  },
  {
    id: 3,
    name: "ETS Immigration Services",
    title: "Certified Canadian Immigration Consultancy",
    location: "Montreal, Canada",
    rating: 4.7,
    reviewCount: 18,
    successRate: 100,
    clientsHelped: 22,
    specialties: ["Canada Study Permits"],
    languages: ["English", "Hindi", "Punjabi", "French"],
    startingPrice: 10000,
    verified: true,
    logo: "/ets-immigration-logo.svg",
    badge: "Multilingual Expert",
    licenseNumber: "R705234",
    experience: "5+ years with 100% success rate"
  }
]

function ConsultantCard({ consultant }: { consultant: typeof mockConsultants[0] }) {
  const { selectConsultant, createApplication } = useStudentProfile()

  const handleSelectConsultant = () => {
    selectConsultant({
      id: consultant.id,
      name: consultant.name,
      consultancy: consultant.name
    })
    createApplication()
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardHeader className="pb-4">
        {/* Consultant Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={consultant.logo}
            alt={`${consultant.name} Logo`}
            className="h-12 w-auto object-contain"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {consultant.name}
            </h3>
            {consultant.verified && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <Badge variant={consultant.badge === 'Top Performer' ? 'default' : 'secondary'}>
              {consultant.badge}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2">{consultant.title}</p>
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
            <MapPin className="w-4 h-4" />
            {consultant.location}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{consultant.rating}</span>
              <span className="text-gray-500">({consultant.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{consultant.clientsHelped}+ helped</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Authorization</p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="default" className="text-xs bg-green-600">
                RCIC Licensed
              </Badge>
              <Badge variant="outline" className="text-xs">
                License: {consultant.licenseNumber}
              </Badge>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Languages & Experience</p>
            <p className="text-sm text-gray-600">{consultant.languages.join(', ')}</p>
            <p className="text-xs text-blue-600 mt-1">{consultant.experience}</p>
          </div>
          
                      <div className="flex items-center justify-between pt-2 border-t">
                          <div>
              <p className="text-sm text-gray-500">Starting from</p>
              <p className="text-lg font-bold text-gray-900">₹{consultant.startingPrice.toLocaleString()}</p>
            </div>
              <div className="flex gap-2">
                <Link href={`/consultant/${consultant.id}`}>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </Link>
                <Button 
                  className="bg-green-600 hover:bg-green-700" 
                  size="sm"
                  onClick={handleSelectConsultant}
                >
                  Select & Apply
                </Button>
              </div>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SearchAndFilters() {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search RCIC consultancies by name, language, or location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="bg-blue-100 border-blue-300">
              <Filter className="w-4 h-4 mr-2" />
              Canada Study Permits
            </Button>
            <Button variant="outline" size="sm">Top Rated</Button>
            <Button variant="outline" size="sm">Price: Low to High</Button>
            <Button variant="outline" size="sm">RCIC Licensed</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MarketplaceStats() {
  return (
    <div className="bg-blue-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">🇨🇦</div>
            <div className="text-sm text-gray-600">RCIC Licensed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">🎓</div>
            <div className="text-sm text-gray-600">Study Permit Experts</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">🇮🇳</div>
            <div className="text-sm text-gray-600">Indian Students Focus</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">✅</div>
            <div className="text-sm text-gray-600">Government Authorized</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConsultantsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Authorized Canadian Immigration Consultancies
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Connect with RCIC-licensed immigration consultancies specializing in Canada Study Permits for Indian students. Government-authorized firms you can trust.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <MarketplaceStats />

      {/* Search and Filters */}
      <SearchAndFilters />

      {/* Authorization Notice */}
      <div className="bg-green-50 border-l-4 border-green-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <div className="text-green-400 mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-green-700">
              <strong>Government Authorized:</strong> All consultancies are RCIC (Registered Canadian Immigration Consultant) licensed and authorized by ICCRC to provide immigration services for Canada.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Filter Results</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Price Range (₹)</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="price" className="mr-2" defaultChecked />
                      <span className="text-sm">All Prices</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="price" className="mr-2" />
                      <span className="text-sm">Under ₹10,000</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="price" className="mr-2" />
                      <span className="text-sm">₹10,000 - ₹15,000</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="price" className="mr-2" />
                      <span className="text-sm">₹15,000+</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Sort By</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="sort" className="mr-2" defaultChecked />
                      <span className="text-sm">Top Rated</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="sort" className="mr-2" />
                      <span className="text-sm">Price: Low to High</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="sort" className="mr-2" />
                      <span className="text-sm">Most Experienced</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Languages</h4>
                  <div className="space-y-2">
                    {['Hindi', 'English', 'Punjabi', 'Gujarati', 'French'].map((language) => (
                      <label key={language} className="flex items-center">
                        <input type="checkbox" className="rounded mr-2" />
                        <span className="text-sm">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {mockConsultants.length} RCIC Licensed Consultancies
              </h2>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Top Rated</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Experienced</option>
                <option>Most Reviews</option>
              </select>
            </div>

            <Suspense fallback={<div>Loading consultants...</div>}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockConsultants.map((consultant) => (
                  <ConsultantCard key={consultant.id} consultant={consultant} />
                ))}
              </div>
            </Suspense>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline">Load More Consultancies</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 