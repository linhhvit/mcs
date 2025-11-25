import React from 'react'
import { Camera } from '@/lib/api'
import CameraCard from './CameraCard'
import EmptyState from '../common/EmptyState'

interface CameraListProps {
  cameras: Camera[]
  onCameraClick?: (camera: Camera) => void
  onEdit?: (camera: Camera) => void
  onDelete?: (camera: Camera) => void
  loading?: boolean
}

export default function CameraList({ cameras, onCameraClick, onEdit, onDelete, loading }: CameraListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (cameras.length === 0) {
    return (
      <EmptyState
        icon="📹"
        title="No cameras found"
        description="Get started by adding your first camera."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cameras.map((camera) => (
        <CameraCard
          key={camera.camera_id}
          camera={camera}
          onClick={onCameraClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

