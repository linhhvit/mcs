import React from 'react'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({
  icon = '📦',
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="card text-center py-12">
      <span className="text-5xl mb-4 block">{icon}</span>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-4">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  )
}

