'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, User } from '@/lib/api'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await apiClient.getCurrentUser()
        setUser(currentUser)
        setError(null)
      } catch (err) {
        setUser(null)
        setError(err instanceof Error ? err.message : 'Authentication failed')
        // Don't redirect here - let the component decide
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = () => {
    apiClient.clearToken()
    setUser(null)
    router.push('/login')
  }

  return {
    user,
    loading,
    error,
    logout,
    isAuthenticated: !!user,
  }
}

