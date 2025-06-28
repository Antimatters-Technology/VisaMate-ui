import { WizardStepper } from '@/features/wizard/WizardStepper'
import { Header } from '@/components/layout/Header'

export default function WizardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Visa Application Wizard
          </h1>
          <p className="text-gray-600">
            Complete your visa application step by step with our guided wizard.
          </p>
        </div>
        <WizardStepper />
      </div>
    </div>
  )
} 