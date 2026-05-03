import React from 'react';

export function Card({ children, className = "", onClick, style = {}, ...props }) {
  return (
    <div 
      className={`card-3d ${className}`} 
      onClick={onClick}
      style={{ 
        padding: '1.5rem', 
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: '24px',
        position: 'relative',
        overflow: 'hidden',
        ...style 
      }}
      {...props}
    >
      {/* 3D Holographic Glare Effect */}
      <div style={{
        position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', transform: 'rotate(-20deg)', transition: '0.5s'
      }}></div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
