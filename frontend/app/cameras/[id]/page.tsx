'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiClient, Camera } from '@/lib/api'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'

export default function CameraDetailPage() {
  const router = useRouter()
  const params = useParams()
  const cameraId = params.id as string
  const [camera, setCamera] = useState<Camera | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCamera = async () => {
      try {
        // In a real app, you'd have a getCameraById API endpoint
        const cameras = await apiClient.getCameras(0, 1000)
        const found = cameras.find(c => c.camera_id === parseInt(cameraId))
        if (found) {
          setCamera(found)
        } else {
          router.push('/cameras')
        }
      } catch (error) {
        console.error('Failed to load camera:', error)
        router.push('/cameras')
      } finally {
        setLoading(false)
      }
    }

    if (cameraId) {
      loadCamera()
    }
  }, [cameraId, router])

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner size="lg" text="Loading camera details..." />
      </Layout>
    )
  }

  if (!camera) {
    return (
      <Layout>
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Camera not found</h2>
          <Button onClick={() => router.push('/cameras')}>
            Back to Cameras
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
            <h1 className="text-3xl font-bold text-gray-900">📹 {camera.camera_name}</h1>
            <p className="mt-2 text-gray-600">Camera Details</p>
          </div>
          <Button variant="secondary" onClick={() => router.push('/cameras')}>
            ← Back
          </Button>
        </div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Camera ID</h3>
              <p className="text-lg font-semibold text-gray-900">{camera.camera_id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <Badge variant={camera.status === 'Online' ? 'success' : 'danger'}>
                {camera.status}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Type</h3>
              <p className="text-lg text-gray-900">{camera.camera_type}</p>
            </div>
            {camera.ip_address && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">IP Address</h3>
                <p className="text-lg font-mono text-gray-900">{camera.ip_address}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Zone ID</h3>
              <p className="text-lg text-gray-900">{camera.zone_id}</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

