import { api } from '@/libs/api'

export interface Consultant {
  id: number
  name: string
  title: string
  location: string
  rating: number
  reviewCount: number
  successRate: number
  clientsHelped: number
  specialties: string[]
  languages: string[]
  startingPrice: number
  verified: boolean
  avatar: string
  badge: string
  bio?: string
  credentials?: string[]
  experience?: string
  responseTime?: string
  availability?: string
  videoCallEnabled?: boolean
  coverImage?: string
  pricing?: {
    consultation: number
    documentReview: number
    applicationSupport: number
  }
  servicesOffered?: {
    name: string
    description: string
    price: number
    duration: string
  }[]
  reviews?: {
    id: number
    name: string
    rating: number
    date: string
    comment: string
    verified: boolean
  }[]
}

export interface ConsultantFilters {
  search?: string
  country?: string[]
  specialties?: string[]
  priceMin?: number
  priceMax?: number
  rating?: number
  languages?: string[]
  verified?: boolean
}

export interface ConsultantsResponse {
  consultants: Consultant[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface BookingRequest {
  consultantId: number
  serviceType: string
  date: string
  time: string
  meetingType: 'video' | 'phone'
  notes?: string
  studentId?: string
}

export interface BookingResponse {
  bookingId: string
  status: 'pending' | 'confirmed' | 'cancelled'
  paymentUrl?: string
  meetingLink?: string
}

// API Functions
export const consultantApi = {
  // Get all consultants with filters
  getConsultants: async (
    filters: ConsultantFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<ConsultantsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            acc[key] = value.join(',')
          } else {
            acc[key] = value.toString()
          }
        }
        return acc
      }, {} as Record<string, string>)
    })

    const response = await api.get(`/consultants?${params}`)
    return response.data
  },

  // Get single consultant by ID
  getConsultant: async (id: number): Promise<Consultant> => {
    const response = await api.get(`/consultants/${id}`)
    return response.data
  },

  // Get consultant availability
  getAvailability: async (
    consultantId: number,
    date?: string
  ): Promise<{
    dates: { date: string; available: boolean }[]
    timeSlots: { time: string; available: boolean }[]
  }> => {
    const params = date ? `?date=${date}` : ''
    const response = await api.get(`/consultants/${consultantId}/availability${params}`)
    return response.data
  },

  // Create booking
  createBooking: async (booking: BookingRequest): Promise<BookingResponse> => {
    const response = await api.post('/bookings', booking)
    return response.data
  },

  // Get consultant reviews
  getReviews: async (
    consultantId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    reviews: Consultant['reviews']
    total: number
    averageRating: number
  }> => {
    const response = await api.get(
      `/consultants/${consultantId}/reviews?page=${page}&limit=${limit}`
    )
    return response.data
  },

  // Submit review
  submitReview: async (
    consultantId: number,
    review: {
      rating: number
      comment: string
      bookingId: string
    }
  ): Promise<{ success: boolean }> => {
    const response = await api.post(`/consultants/${consultantId}/reviews`, review)
    return response.data
  },

  // Get booking details
  getBooking: async (bookingId: string): Promise<{
    id: string
    consultant: Consultant
    service: string
    date: string
    time: string
    status: string
    meetingLink?: string
    paymentStatus: string
  }> => {
    const response = await api.get(`/bookings/${bookingId}`)
    return response.data
  },

  // Cancel booking
  cancelBooking: async (bookingId: string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/bookings/${bookingId}`)
    return response.data
  },

  // Search consultants (enhanced search with AI)
  searchConsultants: async (query: string): Promise<Consultant[]> => {
    const response = await api.post('/consultants/search', { query })
    return response.data
  },

  // Get recommended consultants for user
  getRecommendations: async (
    userProfile?: {
      targetCountry?: string
      visaType?: string
      background?: string
    }
  ): Promise<Consultant[]> => {
    const response = await api.post('/consultants/recommendations', userProfile || {})
    return response.data
  },

  // Get consultant statistics
  getStats: async (): Promise<{
    totalConsultants: number
    totalBookings: number
    averageRating: number
    successRate: number
    countries: string[]
    specialties: string[]
  }> => {
    const response = await api.get('/consultants/stats')
    return response.data
  }
}

// React Query hooks for better state management
export const useConsultants = (filters: ConsultantFilters = {}, page: number = 1) => {
  return {
    // This would integrate with React Query or SWR
    // For now, returning the API function directly
    fetch: () => consultantApi.getConsultants(filters, page)
  }
}

export const useConsultant = (id: number) => {
  return {
    fetch: () => consultantApi.getConsultant(id)
  }
}

export const useBooking = () => {
  return {
    create: consultantApi.createBooking,
    get: consultantApi.getBooking,
    cancel: consultantApi.cancelBooking
  }
} 