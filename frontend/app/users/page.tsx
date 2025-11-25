'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, User } from '@/lib/api'
import Layout from '@/components/Layout'
import PageHeader from '@/components/common/PageHeader'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import UserForm from '@/components/forms/UserForm'

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>()
  const [submitting, setSubmitting] = useState(false)

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getUsers()
      setUsers(data)
    } catch (error) {
      console.error('Failed to load users:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [router])

  const handleCreateUser = () => {
    setEditingUser(undefined)
    setShowModal(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete user "${user.username}"?`)) return
    
    try {
      await apiClient.deleteUser(user.user_id)
      await loadUsers()
    } catch (error) {
      alert('Failed to delete user: ' + (error as Error).message)
    }
  }

  const handleSubmitUser = async (data: Partial<User> & { password?: string }) => {
    try {
      setSubmitting(true)
      if (editingUser) {
        await apiClient.updateUser(editingUser.user_id, data)
      } else {
        await apiClient.createUser(data as Partial<User> & { password: string })
      }
      setShowModal(false)
      setEditingUser(undefined)
      await loadUsers()
    } catch (error) {
      alert('Failed to save user: ' + (error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader
            title="User Management"
            description="Manage system users and permissions"
            icon="👥"
          />
          <Button onClick={handleCreateUser}>+ Add User</Button>
        </div>

        {/* Users Table */}
        {users.length === 0 ? (
          <div className="card text-center py-12">
            <span className="text-5xl mb-4 block">👥</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Users will appear here.</p>
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {user.first_name[0]}{user.last_name[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${
                          user.status === 'Active' ? 'badge-success' : 'badge-info'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteUser(user)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setEditingUser(undefined)
          }}
          title={editingUser ? 'Edit User' : 'Create User'}
        >
          <UserForm
            user={editingUser}
            onSubmit={handleSubmitUser}
            onCancel={() => {
              setShowModal(false)
              setEditingUser(undefined)
            }}
            loading={submitting}
          />
        </Modal>
      </div>
    </Layout>
  )
}
