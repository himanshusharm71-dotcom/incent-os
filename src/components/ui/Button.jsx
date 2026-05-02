import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  className = "", 
  icon,
  ...props 
}) {
  
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    outline: 'none',
    fontFamily: 'inherit'
  };

  const variants = {
    primary: {
      background: 'var(--accent-primary)',
      color: '#fff',
      boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    danger: {
      background: 'var(--status-danger)',
      color: '#fff'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)'
    }
  };

  // Provide hover effects via CSS or inline (using a simple class for hover in CSS would be better, but inline is fine for baseline if CSS isn't fully defined for buttons. We'll rely on the base variants for now.)

  return (
    <button 
      style={{ ...baseStyle, ...variants[variant] }}
      className={`btn-${variant} ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
