import React from 'react';

export function Card({ children, className = "", onClick, style = {}, ...props }) {
  return (
    <div 
      className={`glass-panel ${className}`} 
      onClick={onClick}
      style={{ 
        padding: '1.5rem', 
        cursor: onClick ? 'pointer' : 'default',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ...style 
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(139, 92, 246, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = 'var(--shadow-glass)';
      }}
      {...props}
    >
      {children}
    </div>
  );
}
