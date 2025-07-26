import React from 'react';

interface TagProps {
  icon?: React.ReactNode;
  text: string;
  color: 'blue' | 'green' | 'purple';
  className?: string;
}

export function Tag({ icon, text, color, className = '' }: TagProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${colorClasses[color]} ${className}`}
    >
      {icon}
      {text}
    </span>
  );
}
