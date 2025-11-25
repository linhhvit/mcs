'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, Checklist } from '@/lib/api'
import Layout from '@/components/Layout'
import PageHeader from '@/components/common/PageHeader'
import ChecklistCard from '@/components/checklists/ChecklistCard'
import EmptyState from '@/components/common/EmptyState'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import ChecklistForm from '@/components/forms/ChecklistForm'

export default function ChecklistsPage() {
  const router = useRouter()
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingChecklist, setEditingChecklist] = useState<Checklist | undefined>()
  const [submitting, setSubmitting] = useState(false)

  const loadChecklists = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getChecklists()
      setChecklists(data)
    } catch (error) {
      console.error('Failed to load checklists:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChecklists()
  }, [router])

  const handleChecklistClick = (checklist: Checklist) => {
    router.push(`/checklists/${checklist.checklist_id}`)
  }

  const handleCreateChecklist = () => {
    setEditingChecklist(undefined)
    setShowModal(true)
  }

  const handleEditChecklist = (checklist: Checklist) => {
    setEditingChecklist(checklist)
    setShowModal(true)
  }

  const handleDeleteChecklist = async (checklist: Checklist) => {
    if (!confirm(`Are you sure you want to delete checklist "${checklist.name}"?`)) return
    
    try {
      await apiClient.deleteChecklist(checklist.checklist_id)
      await loadChecklists()
    } catch (error) {
      alert('Failed to delete checklist: ' + (error as Error).message)
    }
  }

  const handleSubmitChecklist = async (data: Partial<Checklist>) => {
    try {
      setSubmitting(true)
      if (editingChecklist) {
        await apiClient.updateChecklist(editingChecklist.checklist_id, data)
      } else {
        await apiClient.createChecklist(data)
      }
      setShowModal(false)
      setEditingChecklist(undefined)
      await loadChecklists()
    } catch (error) {
      alert('Failed to save checklist: ' + (error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Checklist Management"
            description="Manage your monitoring checklists"
            icon="📋"
          />
          <Button onClick={handleCreateChecklist}>+ Add Checklist</Button>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" text="Loading checklists..." />
        ) : checklists.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No checklists found"
            description="Create your first checklist to get started."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {checklists.map((checklist) => (
              <div key={checklist.checklist_id} className="relative">
                <ChecklistCard
                  checklist={checklist}
                  onClick={handleChecklistClick}
                />
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditChecklist(checklist)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteChecklist(checklist)
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setEditingChecklist(undefined)
          }}
          title={editingChecklist ? 'Edit Checklist' : 'Create Checklist'}
        >
          <ChecklistForm
            checklist={editingChecklist}
            onSubmit={handleSubmitChecklist}
            onCancel={() => {
              setShowModal(false)
              setEditingChecklist(undefined)
            }}
            loading={submitting}
          />
        </Modal>
      </div>
    </Layout>
  )
}
