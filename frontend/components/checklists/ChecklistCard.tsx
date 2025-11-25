import React from 'react'
import { Checklist } from '@/lib/api'
import Badge from '../common/Badge'

interface ChecklistCardProps {
  checklist: Checklist
  onClick?: (checklist: Checklist) => void
}

export default function ChecklistCard({ checklist, onClick }: ChecklistCardProps) {
  return (
    <div
      className="card hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick?.(checklist)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{checklist.name}</h3>
          {checklist.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{checklist.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Badge variant={checklist.status === 'Active' ? 'success' : 'info'}>
          {checklist.status}
        </Badge>
        <span className="text-xs text-gray-500">ID: {checklist.checklist_id}</span>
      </div>
    </div>
  )
}

