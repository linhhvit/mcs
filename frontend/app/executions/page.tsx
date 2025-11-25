'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, Execution } from '@/lib/api'
import Layout from '@/components/Layout'
import PageHeader from '@/components/common/PageHeader'
import ExecutionCard from '@/components/executions/ExecutionCard'
import EmptyState from '@/components/common/EmptyState'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function ExecutionsPage() {
  const router = useRouter()
  const [executions, setExecutions] = useState<Execution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadExecutions = async () => {
      try {
        const data = await apiClient.getExecutions()
        setExecutions(data)
      } catch (error) {
        console.error('Failed to load executions:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    loadExecutions()
  }, [router])

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Execution Management"
          description="Monitor and manage checklist executions"
          icon="⚙️"
        />

        {loading ? (
          <LoadingSpinner size="lg" text="Loading executions..." />
        ) : executions.length === 0 ? (
          <EmptyState
            icon="⚙️"
            title="No executions found"
            description="Executions will appear here when checklists are run."
          />
        ) : (
          <div className="space-y-4">
            {executions.map((execution) => (
              <ExecutionCard key={execution.execution_id} execution={execution} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
