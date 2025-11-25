import React, { useState, useEffect } from 'react'
import { Camera, Zone, apiClient } from '@/lib/api'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'

interface CameraFormProps {
  camera?: Camera
  zones: Zone[]
  onSubmit: (data: Partial<Camera>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function CameraForm({
  camera,
  zones,
  onSubmit,
  onCancel,
  loading = false,
}: CameraFormProps) {
  const [formData, setFormData] = useState({
    camera_name: camera?.camera_name || '',
    camera_code: camera?.camera_code || '',
    zone_id: camera?.zone_id || zones[0]?.zone_id || 0,
    camera_type: camera?.camera_type || '',
    ip_address: camera?.ip_address || '',
    status: camera?.status || 'Online',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.camera_name.trim()) {
      newErrors.camera_name = 'Camera name is required'
    }
    if (!formData.zone_id) {
      newErrors.zone_id = 'Zone is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Camera Name *"
        value={formData.camera_name}
        onChange={(e) => setFormData({ ...formData, camera_name: e.target.value })}
        error={errors.camera_name}
        required
      />

      <Input
        label="Camera Code"
        value={formData.camera_code}
        onChange={(e) => setFormData({ ...formData, camera_code: e.target.value })}
        error={errors.camera_code}
      />

      <Select
        label="Zone *"
        value={formData.zone_id}
        onChange={(e) => setFormData({ ...formData, zone_id: parseInt(e.target.value) })}
        error={errors.zone_id}
        options={[
          { value: 0, label: 'Select a zone...' },
          ...zones.map((zone) => ({ value: zone.zone_id, label: zone.zone_name })),
        ]}
        required
      />

      <Input
        label="Camera Type"
        value={formData.camera_type}
        onChange={(e) => setFormData({ ...formData, camera_type: e.target.value })}
        placeholder="e.g., IP Camera, PTZ Camera"
      />

      <Input
        label="IP Address"
        value={formData.ip_address}
        onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
        placeholder="192.168.1.100"
      />

      <Select
        label="Status *"
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        options={[
          { value: 'Online', label: 'Online' },
          { value: 'Offline', label: 'Offline' },
          { value: 'Maintenance', label: 'Maintenance' },
        ]}
        required
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {camera ? 'Update' : 'Create'} Camera
        </Button>
      </div>
    </form>
  )
}

