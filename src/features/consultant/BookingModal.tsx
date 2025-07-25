'use client'

import { useState } from 'react'
import { Calendar, Clock, Video, MapPin, CreditCard, X } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { formatDateSafe } from '@/utils/date'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  consultant: {
    id: number
    name: string
    title: string
    rating: number
    pricing: {
      consultation: number
    }
  }
  service?: {
    name: string
    description: string
    price: number
    duration: string
  }
}

interface TimeSlot {
  time: string
  available: boolean
}

const mockAvailableSlots: TimeSlot[] = [
  { time: '09:00 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '11:00 AM', available: false },
  { time: '02:00 PM', available: true },
  { time: '03:00 PM', available: true },
  { time: '04:00 PM', available: true },
  { time: '05:00 PM', available: false },
]

const mockDates = [
  { date: '2024-02-15', day: 'Thu', dayNum: 15 },
  { date: '2024-02-16', day: 'Fri', dayNum: 16 },
  { date: '2024-02-17', day: 'Sat', dayNum: 17 },
  { date: '2024-02-19', day: 'Mon', dayNum: 19 },
  { date: '2024-02-20', day: 'Tue', dayNum: 20 },
  { date: '2024-02-21', day: 'Wed', dayNum: 21 },
  { date: '2024-02-22', day: 'Thu', dayNum: 22 },
]

export default function BookingModal({ isOpen, onClose, consultant, service }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [meetingType, setMeetingType] = useState<'video' | 'phone'>('video')
  const [step, setStep] = useState<'datetime' | 'details' | 'payment'>('datetime')
  
  // Student information for integration
  const [studentName, setStudentName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [studentPhone, setStudentPhone] = useState('')
  const [targetProgram, setTargetProgram] = useState('')
  const [targetInstitution, setTargetInstitution] = useState('')
  const [targetIntake, setTargetIntake] = useState('Fall 2024')
  const [ieltsScore, setIeltsScore] = useState('')

  if (!isOpen) return null

  const selectedService = service || {
    name: 'Initial Consultation',
    description: '1-hour assessment of your immigration options',
    price: consultant.pricing.consultation,
    duration: '60 minutes'
  }

  const handleNext = () => {
    if (step === 'datetime' && selectedDate && selectedTime) {
      setStep('details')
    } else if (step === 'details' && studentName && studentEmail && studentPhone && targetProgram && targetInstitution) {
      setStep('payment')
    }
  }

  const handleBack = () => {
    if (step === 'payment') {
      setStep('details')
    } else if (step === 'details') {
      setStep('datetime')
    }
  }

  const handleBooking = () => {
    // Create student profile and booking with real integration
    const studentData = {
      name: studentName,
      email: studentEmail,
      phone: studentPhone,
      program: targetProgram,
      institution: targetInstitution,
      target_intake: targetIntake,
      ielts_score: ieltsScore || undefined
    }

    const bookingData = {
      consultant_id: consultant.id,
      service_type: selectedService.name,
      date: selectedDate,
      time: selectedTime,
      meeting_type: meetingType,
      notes: `Program: ${targetProgram}, Institution: ${targetInstitution}, Intake: ${targetIntake}`,
      student_id: Date.now().toString() // Temporary ID, would be real student ID in production
    }

    console.log('Creating integrated booking and student profile:', {
      student: studentData,
      booking: bookingData
    })

    // Here you would call the API to create the booking and student profile
    // This will automatically create a case in the consultant's dashboard
    
    alert(`Booking confirmed! Your application has been created in ${consultant.name}'s dashboard. You will receive a confirmation email shortly.`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Book with {consultant.name}</h2>
            <p className="text-sm text-gray-600">{consultant.title}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Service Info */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{selectedService.name}</h3>
              <p className="text-sm text-gray-600">{selectedService.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedService.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  Video call available
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${selectedService.price}</div>
              <div className="text-sm text-gray-500">per session</div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {step === 'datetime' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Select Date</h3>
                <div className="grid grid-cols-7 gap-2">
                  {mockDates.map((date) => (
                    <button
                      key={date.date}
                      onClick={() => setSelectedDate(date.date)}
                      className={`p-3 text-center rounded-lg border transition-colors ${
                        selectedDate === date.date
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-xs text-gray-500">{date.day}</div>
                      <div className="font-semibold">{date.dayNum}</div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <h3 className="font-semibold mb-4">Select Time</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {mockAvailableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 text-center rounded-lg border transition-colors ${
                          selectedTime === slot.time
                            ? 'bg-blue-600 text-white border-blue-600'
                            : slot.available
                            ? 'border-gray-200 hover:border-blue-300'
                            : 'border-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Student Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IELTS Score (if available)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="9"
                      value={ieltsScore}
                      onChange={(e) => setIeltsScore(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="7.5"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Study Plans</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Program *
                    </label>
                    <input
                      type="text"
                      value={targetProgram}
                      onChange={(e) => setTargetProgram(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Master's in Computer Science"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Institution *
                    </label>
                    <input
                      type="text"
                      value={targetInstitution}
                      onChange={(e) => setTargetInstitution(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., University of Toronto"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Intake *
                    </label>
                    <select
                      value={targetIntake}
                      onChange={(e) => setTargetIntake(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Fall 2024">Fall 2024</option>
                      <option value="Winter 2025">Winter 2025</option>
                      <option value="Summer 2024">Summer 2024</option>
                      <option value="Fall 2025">Fall 2025</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Meeting Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setMeetingType('video')}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      meetingType === 'video'
                        ? 'bg-blue-50 border-blue-300'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Video className="w-5 h-5 mb-2" />
                    <div className="font-medium">Video Call</div>
                    <div className="text-sm text-gray-600">Meet online via video</div>
                  </button>
                  <button
                    onClick={() => setMeetingType('phone')}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      meetingType === 'phone'
                        ? 'bg-blue-50 border-blue-300'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="w-5 h-5 mb-2 rounded-full bg-gray-400"></div>
                    <div className="font-medium">Phone Call</div>
                    <div className="text-sm text-gray-600">Traditional phone call</div>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Booking Summary</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Student:</span>
                        <span className="font-medium">{studentName || 'Please enter name'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Program:</span>
                        <span className="font-medium">{targetProgram || 'Please specify'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {formatDateSafe(selectedDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{selectedService.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Meeting Type:</span>
                        <span className="font-medium capitalize">{meetingType} call</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-lg">₹{(selectedService.price * 80).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
                <p className="text-gray-600">
                  Complete your booking by making a secure payment
                </p>
              </div>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Secure Payment</div>
                      <div className="text-sm text-gray-600">
                        Your payment is protected by Razorpay
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center text-sm text-gray-500">
                <p>
                  By proceeding, you agree to our Terms of Service and Privacy Policy.
                  Free cancellation up to 24 hours before your appointment.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          {step !== 'datetime' && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <div className="flex-1"></div>
          {step !== 'payment' ? (
            <Button
              onClick={handleNext}
              disabled={
                (step === 'datetime' && (!selectedDate || !selectedTime)) ||
                (step === 'details' && (!studentName || !studentEmail || !studentPhone || !targetProgram || !targetInstitution))
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {step === 'datetime' ? 'Continue' : 'Continue to Payment'}
            </Button>
          ) : (
            <Button
              onClick={handleBooking}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete Booking (${selectedService.price})
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 