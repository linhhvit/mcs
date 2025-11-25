import React from 'react'
import { Execution } from '@/lib/api'
import Badge from '../common/Badge'

interface ExecutionCardProps {
  execution: Execution
  onClick?: (execution: Execution) => void
}

export default function ExecutionCard({ execution, onClick }: ExecutionCardProps) {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      'Completed': 'success',
      'In Progress': 'warning',
      'Failed': 'danger',
      'Aborted': 'info',
    }
    return statusMap[status] || 'info'
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      'Completed': '✅',
      'In Progress': '🟡',
      'Failed': '❌',
      'Aborted': '⚫',
    }
    return icons[status] || '⚪'
  }

  return (
    <div
      className="card hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick?.(execution)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">{getStatusIcon(execution.status)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Execution #{execution.execution_id}
              </h3>
              <p className="text-sm text-gray-500">Checklist ID: {execution.checklist_id}</p>
            </div>
          </div>
        </div>
        <Badge variant={getStatusBadge(execution.status)}>
          {execution.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Started</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date(execution.start_time).toLocaleString()}
          </p>
        </div>
        {execution.end_time && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Ended</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(execution.end_time).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {execution.notes && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Notes</p>
          <p className="text-sm text-gray-700">{execution.notes}</p>
        </div>
      )}
    </div>
  )
}

