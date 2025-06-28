import { WizardStepper } from '@/features/wizard/WizardStepper'
import { DocumentChecklist } from '@/features/wizard/DocumentChecklist'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function WizardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Visa Application Wizard
          </h1>
          <p className="text-gray-600">
            Complete your visa application step by step with our guided wizard.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main wizard */}
          <div className="lg:col-span-2">
            <WizardStepper />
          </div>
          
          {/* Document checklist sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Document Checklist</CardTitle>
                <CardDescription>
                  Track your required documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentChecklist />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 