import React from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: string
  action?: React.ReactNode
}

export default function PageHeader({
  title,
  description,
  icon,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-gray-600">{description}</p>
        )}
      </div>
      {action && (
        <div>{action}</div>
      )}
    </div>
  )
}

