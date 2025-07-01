'use client'

import React from 'react'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/button'
import { formatDateSafe } from '@/utils/date'

interface Case {
  id: string
  clientName: string
  email: string
  country: string
  status: 'new' | 'in-progress' | 'review' | 'submitted' | 'approved' | 'rejected'
  createdAt: string
  lastUpdate: string
}

export function CasesTable() {
  // Mock data - in production, this would come from API
  const cases: Case[] = [
    {
      id: '1',
      clientName: 'John Doe',
      email: 'john@example.com',
      country: 'Canada',
      status: 'in-progress',
      createdAt: '2024-01-15',
      lastUpdate: '2024-01-20'
    },
    {
      id: '2',
      clientName: 'Jane Smith',
      email: 'jane@example.com',
      country: 'Australia',
      status: 'review',
      createdAt: '2024-01-10',
      lastUpdate: '2024-01-18'
    },
    {
      id: '3',
      clientName: 'Mike Johnson',
      email: 'mike@example.com',
      country: 'UK',
      status: 'approved',
      createdAt: '2024-01-05',
      lastUpdate: '2024-01-19'
    }
  ]

  const getStatusBadge = (status: Case['status']) => {
    switch (status) {
      case 'new':
        return <Badge variant="info">New</Badge>
      case 'in-progress':
        return <Badge variant="warning">In Progress</Badge>
      case 'review':
        return <Badge variant="secondary">Review</Badge>
      case 'submitted':
        return <Badge variant="outline">Submitted</Badge>
      case 'approved':
        return <Badge variant="success">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left p-4 font-medium">Client</th>
            <th className="text-left p-4 font-medium">Country</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-left p-4 font-medium">Created</th>
            <th className="text-left p-4 font-medium">Last Update</th>
            <th className="text-left p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((case_) => (
            <tr key={case_.id} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <div>
                  <div className="font-medium">{case_.clientName}</div>
                  <div className="text-sm text-gray-500">{case_.email}</div>
                </div>
              </td>
              <td className="p-4">{case_.country}</td>
              <td className="p-4">{getStatusBadge(case_.status)}</td>
              <td className="p-4 text-sm text-gray-600">
                {formatDateSafe(case_.createdAt)}
              </td>
              <td className="p-4 text-sm text-gray-600">
                {formatDateSafe(case_.lastUpdate)}
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = `/case/${case_.id}`}
                  >
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    Message
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {cases.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No cases found.</p>
          <p className="text-sm mt-2">New cases will appear here when clients start applications.</p>
        </div>
      )}
    </div>
  )
} 