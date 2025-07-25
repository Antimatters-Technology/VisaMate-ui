import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PaymentButton } from '@/components/shared/PaymentButton'

export default function DemoPaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Button Demo
          </h1>
          <p className="text-gray-600">
            Examples showing how to use the PaymentButton component anywhere in your app
          </p>
        </div>

        <div className="grid gap-6">
          {/* Basic Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Payment Button</CardTitle>
              <CardDescription>Simple usage with minimal props</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentButton
                amount={150}
                description="Study Permit Application Fee"
                applicationFee="Study Permit"
              />
            </CardContent>
          </Card>

          {/* Custom Styling */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Styled Buttons</CardTitle>
              <CardDescription>Different variants and sizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <PaymentButton
                  amount={100}
                  description="Visitor Visa Fee"
                  applicationFee="Visitor Visa"
                  variant="outline"
                  size="sm"
                />
                <PaymentButton
                  amount={155}
                  description="Work Permit Fee"
                  applicationFee="Work Permit"
                  variant="secondary"
                />
                <PaymentButton
                  amount={1325}
                  description="Permanent Residence Fee"
                  applicationFee="PR Application"
                  variant="destructive"
                  size="lg"
                  buttonText="Pay PR Fee Now 🇨🇦"
                />
              </div>
            </CardContent>
          </Card>

          {/* In-line Usage */}
          <Card>
            <CardHeader>
              <CardTitle>In-line Usage Example</CardTitle>
              <CardDescription>How it looks in a form or content section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Study Permit Application</h3>
                    <p className="text-sm text-gray-600">Required for studying in Canada</p>
                    <p className="text-lg font-bold text-green-600">$150 CAD</p>
                  </div>
                  <PaymentButton
                    amount={150}
                    description="Study Permit Application Fee"
                    applicationFee="Study Permit"
                    buttonText="Pay Now"
                    className="ml-4"
                  />
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Express Entry - Permanent Residence</h3>
                    <p className="text-sm text-gray-600">Path to Canadian permanent residence</p>
                    <p className="text-lg font-bold text-green-600">$1,325 CAD</p>
                  </div>
                  <PaymentButton
                    amount={1325}
                    description="Express Entry PR Application Fee"
                    applicationFee="Express Entry PR"
                    buttonText="Pay PR Fee"
                    variant="destructive"
                    className="ml-4"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">💡 How to Use Anywhere</CardTitle>
              <CardDescription className="text-blue-600">
                Copy and paste this component anywhere in your app
              </CardDescription>
            </CardHeader>
            <CardContent className="text-blue-700">
              <pre className="bg-blue-100 p-4 rounded text-sm overflow-x-auto">
{`import { PaymentButton } from '@/components/shared/PaymentButton'

<PaymentButton
  amount={150}
  currency="CAD"
  description="Study Permit Fee"
  applicationFee="Study Permit"
  buttonText="Pay Now"
  variant="default"
  size="default"
/>`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 