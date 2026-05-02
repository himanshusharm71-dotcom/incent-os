import React from 'react';

export function Avatar({ src, alt, size = 'md', className = "", fallback }) {
  const sizes = {
    sm: '32px',
    md: '48px',
    lg: '64px',
    xl: '96px'
  };

  const dimension = sizes[size] || sizes.md;

  const baseStyle = {
    width: dimension,
    height: dimension,
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    color: 'var(--text-primary)',
    border: '2px solid rgba(255, 255, 255, 0.1)'
  };

  if (src) {
    return (
      <img 
        src={src} 
        alt={alt || "Avatar"} 
        style={baseStyle}
        className={className}
      />
    );
  }

  // Fallback to initials if no image
  const initials = fallback || (alt ? alt.charAt(0).toUpperCase() : '?');

  return (
    <div style={baseStyle} className={className}>
      {initials}
    </div>
  );
}
