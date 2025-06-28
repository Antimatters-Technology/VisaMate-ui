import { CasesTable } from '@/features/consultant/CasesTable'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CasesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Client Cases
            </h1>
            <p className="text-gray-600">
              Manage and track all your client applications.
            </p>
          </div>
          <Button>
            Add New Case
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Cases</CardTitle>
            <CardDescription>
              Overview of all ongoing client applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CasesTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 