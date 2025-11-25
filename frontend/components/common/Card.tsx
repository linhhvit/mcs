import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: '',
  }
  
  return (
    <div className={`card ${paddingClasses[padding]} ${hover ? 'hover:shadow-lg transition-shadow' : ''} ${className}`}>
      {children}
    </div>
  )
}

