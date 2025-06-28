import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/shared/Badge'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Trusted by 10,000+ Students
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Visa Journey <span className="text-blue-600">Simplified</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional visa consultation and document management platform. 
            Get expert guidance for Canada, Australia, UK, and more.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="px-8">
              Start Your Application
            </Button>
            <Button variant="outline" size="lg">
              Consult an Expert
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose VisaMate?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Expert Guidance</CardTitle>
                <CardDescription>
                  Professional consultants with years of experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                Get personalized advice for your specific case and country requirements.
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
                <CardDescription>
                  Secure cloud storage for all your documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                Upload, organize, and track your visa documents in one place.
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Real-time Updates</CardTitle>
                <CardDescription>
                  Stay informed about your application status
                </CardDescription>
              </CardHeader>
              <CardContent>
                Get instant notifications about important updates and deadlines.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
} 