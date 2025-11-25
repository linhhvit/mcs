import React, { useState } from 'react'
import { Site } from '@/lib/api'
import Input from '../common/Input'
import Textarea from '../common/Textarea'
import Select from '../common/Select'
import Button from '../common/Button'

interface SiteFormProps {
  site?: Site
  onSubmit: (data: Partial<Site>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function SiteForm({
  site,
  onSubmit,
  onCancel,
  loading = false,
}: SiteFormProps) {
  const [formData, setFormData] = useState({
    site_name: site?.site_name || '',
    location: site?.location || '',
    description: site?.description || '',
    status: site?.status || 'Active',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.site_name.trim()) {
      newErrors.site_name = 'Site name is required'
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
        label="Site Name *"
        value={formData.site_name}
        onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
        error={errors.site_name}
        required
      />

      <Input
        label="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        placeholder="e.g., Building A, Floor 3"
      />

      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Additional details about the site"
      />

      <Select
        label="Status *"
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        options={[
          { value: 'Active', label: 'Active' },
          { value: 'Inactive', label: 'Inactive' },
        ]}
        required
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {site ? 'Update' : 'Create'} Site
        </Button>
      </div>
    </form>
  )
}

