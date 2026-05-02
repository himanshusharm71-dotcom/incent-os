import React from 'react';

export function Badge({ children, variant = 'info', className = "" }) {
  
  const variants = {
    info: { bg: 'rgba(59, 130, 246, 0.15)', color: 'var(--status-info)' },
    success: { bg: 'rgba(16, 185, 129, 0.15)', color: 'var(--status-success)' },
    warning: { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--status-warning)' },
    danger: { bg: 'rgba(239, 68, 68, 0.15)', color: 'var(--status-danger)' },
    primary: { bg: 'var(--accent-glow)', color: '#D8B4FE' }, // Lighter purple text
    default: { bg: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)' }
  };

  const style = variants[variant] || variants.default;

  return (
    <span 
      className={className}
      style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: '0.2rem 0.6rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        display: 'inline-block'
      }}
    >
      {children}
    </span>
  );
}
