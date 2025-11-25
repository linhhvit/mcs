import React, { useState } from 'react'
import { Checklist } from '@/lib/api'
import Input from '../common/Input'
import Textarea from '../common/Textarea'
import Select from '../common/Select'
import Button from '../common/Button'

interface ChecklistFormProps {
  checklist?: Checklist
  onSubmit: (data: Partial<Checklist>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function ChecklistForm({
  checklist,
  onSubmit,
  onCancel,
  loading = false,
}: ChecklistFormProps) {
  const [formData, setFormData] = useState({
    name: checklist?.name || '',
    description: checklist?.description || '',
    status: checklist?.status || 'Active',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Checklist name is required'
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
        label="Checklist Name *"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
      />

      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Describe what this checklist is for"
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
          {checklist ? 'Update' : 'Create'} Checklist
        </Button>
      </div>
    </form>
  )
}

