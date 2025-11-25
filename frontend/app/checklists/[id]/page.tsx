'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiClient, Checklist } from '@/lib/api'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'

export default function ChecklistDetailPage() {
  const router = useRouter()
  const params = useParams()
  const checklistId = params.id as string
  const [checklist, setChecklist] = useState<Checklist | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChecklist = async () => {
      try {
        const checklists = await apiClient.getChecklists(0, 1000)
        const found = checklists.find(c => c.checklist_id === parseInt(checklistId))
        if (found) {
          setChecklist(found)
        } else {
          router.push('/checklists')
        }
      } catch (error) {
        console.error('Failed to load checklist:', error)
        router.push('/checklists')
      } finally {
        setLoading(false)
      }
    }

    if (checklistId) {
      loadChecklist()
    }
  }, [checklistId, router])

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner size="lg" text="Loading checklist details..." />
      </Layout>
    )
  }

  if (!checklist) {
    return (
      <Layout>
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Checklist not found</h2>
          <Button onClick={() => router.push('/checklists')}>
            Back to Checklists
          </Button>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📋 {checklist.name}</h1>
            <p className="mt-2 text-gray-600">Checklist Details</p>
          </div>
          <Button variant="secondary" onClick={() => router.push('/checklists')}>
            ← Back
          </Button>
        </div>

        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Checklist ID</h3>
              <p className="text-lg font-semibold text-gray-900">{checklist.checklist_id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <Badge variant={checklist.status === 'Active' ? 'success' : 'info'}>
                {checklist.status}
              </Badge>
            </div>
            {checklist.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p className="text-lg text-gray-900">{checklist.description}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  )
}

