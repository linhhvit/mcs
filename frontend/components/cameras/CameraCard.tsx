import React from 'react'
import { Camera } from '@/lib/api'
import Badge from '../common/Badge'
import Button from '../common/Button'

interface CameraCardProps {
  camera: Camera
  onClick?: (camera: Camera) => void
  onEdit?: (camera: Camera) => void
  onDelete?: (camera: Camera) => void
}

export default function CameraCard({ camera, onClick, onEdit, onDelete }: CameraCardProps) {
  return (
    <div
      className="card hover:shadow-lg transition-shadow relative"
    >
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          {onEdit && (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(camera)
              }}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="danger"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(camera)
              }}
            >
              Delete
            </Button>
          )}
        </div>
      )}
      <div
        className={onClick ? "cursor-pointer" : ""}
        onClick={() => onClick?.(camera)}
      >
      <div className="flex items-start justify-between mb-4">
        <div className={onEdit || onDelete ? "pr-24" : ""}>
          <h3 className="text-lg font-semibold text-gray-900">{camera.camera_name}</h3>
          <p className="text-sm text-gray-500 mt-1">ID: {camera.camera_id}</p>
        </div>
        <Badge variant={camera.status === 'Online' ? 'success' : 'danger'}>
          {camera.status}
        </Badge>
      </div>
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-20">Type:</span>
          <span className="font-medium text-gray-900">{camera.camera_type}</span>
        </div>
        {camera.ip_address && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-20">IP:</span>
            <span className="font-mono text-gray-900">{camera.ip_address}</span>
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-20">Zone:</span>
          <span className="font-medium text-gray-900">{camera.zone_id}</span>
        </div>
      </div>
      </div>
    </div>
  )
}

