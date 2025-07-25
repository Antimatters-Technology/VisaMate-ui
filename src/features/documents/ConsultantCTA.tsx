'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { 
  Users, 
  Shield, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  TrendingUp
} from 'lucide-react'

export function ConsultantCTA() {
  const router = useRouter()

  const handleChooseConsultant = () => {
    router.push('/consultants')
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border-2 border-indigo-200 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-indigo-900 mb-2">
          Ready to Complete Your Application?
        </CardTitle>
        <p className="text-indigo-700">
          Connect with RCIC-licensed immigration consultants
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Benefits */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <Shield className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <h4 className="font-semibold text-sm text-gray-900">RCIC Licensed</h4>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <h4 className="font-semibold text-sm text-gray-900">100% Success</h4>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <Star className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <h4 className="font-semibold text-sm text-gray-900">4.8 Rating</h4>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-sm text-gray-700">End-to-end application support</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-sm text-gray-700">Multilingual support (Hindi, English, Punjabi)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-sm text-gray-700">Specialized in Indian student applications</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">Starting from</p>
              <p className="text-xl font-bold text-green-800">₹10,000</p>
            </div>
            <Badge className="bg-green-600 text-white">Best Value</Badge>
          </div>
          
          <Button 
            onClick={handleChooseConsultant}
            size="lg"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Users className="w-4 h-4 mr-2" />
            Choose Your Consultant
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <p className="text-xs text-gray-600 text-center mt-2">
            Free consultation • No upfront payment
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 