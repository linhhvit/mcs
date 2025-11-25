'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, User, Camera, Checklist, Execution } from '@/lib/api'
import Layout from '@/components/Layout'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    cameras: 0,
    checklists: 0,
    executions: 0,
    activeExecutions: 0,
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await apiClient.getCurrentUser()
        setUser(currentUser)

        const [cameras, checklists, executions] = await Promise.all([
          apiClient.getCameras(0, 1000),
          apiClient.getChecklists(0, 1000),
          apiClient.getExecutions(0, 1000),
        ])

        setStats({
          cameras: cameras.length,
          checklists: checklists.length,
          executions: executions.length,
          activeExecutions: executions.filter((e) => e.status === 'In Progress').length,
        })
      } catch (error) {
        console.error('Failed to load data:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  const statCards = [
    {
      title: 'Total Cameras',
      value: stats.cameras,
      icon: '📹',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Checklists',
      value: stats.checklists,
      icon: '📋',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Executions',
      value: stats.executions,
      icon: '⚙️',
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Active Executions',
      value: stats.activeExecutions,
      icon: '🟡',
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, <span className="font-semibold text-gray-900">{user?.first_name} {user?.last_name}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
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

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/cameras"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">📹</span>
              <div>
                <p className="font-medium text-gray-900">Manage Cameras</p>
                <p className="text-sm text-gray-500">View and configure cameras</p>
              </div>
            </a>
            <a
              href="/checklists"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">📋</span>
              <div>
                <p className="font-medium text-gray-900">Manage Checklists</p>
                <p className="text-sm text-gray-500">Create and edit checklists</p>
              </div>
            </a>
            <a
              href="/executions"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">⚙️</span>
              <div>
                <p className="font-medium text-gray-900">View Executions</p>
                <p className="text-sm text-gray-500">Monitor execution status</p>
              </div>
            </a>
          </div>
        </div>

        {/* System Status */}
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
              <p className="text-sm text-gray-600 mt-1">All systems operational</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Online</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
