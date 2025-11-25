import React, { useState } from 'react'
import { Zone, Site } from '@/lib/api'
import Input from '../common/Input'
import Textarea from '../common/Textarea'
import Select from '../common/Select'
import Button from '../common/Button'

interface ZoneFormProps {
  zone?: Zone
  sites: Site[]
  onSubmit: (data: Partial<Zone>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function ZoneForm({
  zone,
  sites,
  onSubmit,
  onCancel,
  loading = false,
}: ZoneFormProps) {
  const [formData, setFormData] = useState({
    zone_name: zone?.zone_name || '',
    site_id: zone?.site_id || sites[0]?.site_id || 0,
    description: zone?.description || '',
    status: zone?.status || 'Active',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.zone_name.trim()) {
      newErrors.zone_name = 'Zone name is required'
    }
    if (!formData.site_id) {
      newErrors.site_id = 'Site is required'
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
        label="Zone Name *"
        value={formData.zone_name}
        onChange={(e) => setFormData({ ...formData, zone_name: e.target.value })}
        error={errors.zone_name}
        required
      />

      <Select
        label="Site *"
        value={formData.site_id}
        onChange={(e) => setFormData({ ...formData, site_id: parseInt(e.target.value) })}
        error={errors.site_id}
        options={[
          { value: 0, label: 'Select a site...' },
          ...sites.map((site) => ({ value: site.site_id, label: site.site_name })),
        ]}
        required
      />

      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Additional details about the zone"
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
          {zone ? 'Update' : 'Create'} Zone
        </Button>
      </div>
    </form>
  )
}

