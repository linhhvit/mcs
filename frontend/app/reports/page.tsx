'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, Execution } from '@/lib/api'
import Layout from '@/components/Layout'

export default function ReportsPage() {
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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  const completed = executions.filter((e) => e.status === 'Completed').length
  const inProgress = executions.filter((e) => e.status === 'In Progress').length
  const failed = executions.filter((e) => e.status === 'Failed').length
  const total = executions.length
  const successRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0'

  const stats = [
    {
      title: 'Completed',
      value: completed,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: '✅',
    },
    {
      title: 'In Progress',
      value: inProgress,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      icon: '🟡',
    },
    {
      title: 'Failed',
      value: failed,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: '❌',
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: '📊',
    },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📈 Reports</h1>
          <p className="mt-2 text-gray-600">Execution statistics and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.title} className={`card ${stat.bgColor} border-0`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} rounded-full p-3`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Execution Summary</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Executions</span>
              <span className="text-lg font-semibold text-gray-900">{total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Success Rate</span>
              <span className="text-lg font-semibold text-green-600">{successRate}%</span>
            </div>
            <div className="pt-3 border-t border-blue-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-gray-900">{completed} / {total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {executions.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Executions</h2>
            <div className="space-y-3">
              {executions.slice(0, 5).map((execution) => (
                <div key={execution.execution_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Execution #{execution.execution_id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(execution.start_time).toLocaleString()}
                    </p>
                  </div>
                  <span className={`badge ${
                    execution.status === 'Completed' ? 'badge-success' :
                    execution.status === 'In Progress' ? 'badge-warning' :
                    'badge-danger'
                  }`}>
                    {execution.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
