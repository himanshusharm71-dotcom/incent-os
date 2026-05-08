import React, { useEffect, useRef } from 'react';

export function CyberBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // ── FLUID NEURAL NETWORK ──
    const particles = [];
    const particleCount = 40; // Reduced from 120 for performance
    const maxDistance = 150;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#F97316' : '#3B82F6';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + '44';
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background aura
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.2
      );
      gradient.addColorStop(0, '#0F172A'); // Deep space
      gradient.addColorStop(0.5, '#020617'); // Darker
      gradient.addColorStop(1, '#000000'); // Void
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            // Dynamic line color based on team theme (orange/blue)
            const opacity = 1 - (distance / maxDistance);
            ctx.strokeStyle = `rgba(249, 115, 22, ${opacity * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: -1, background: '#000', overflow: 'hidden'
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', filter: 'blur(1px)' }} />
      
      {/* ── CINEMATIC OVERLAYS ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none'
      }} />
      
      {/* Scanline Effect */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%)',
        backgroundSize: '100% 4px',
        pointerEvents: 'none',
        opacity: 0.1
      }} />

      {/* ── FLOATING ORBS ── */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
        filter: 'blur(80px)', animation: 'orbFloat 20s infinite alternate'
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw',
        background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
        filter: 'blur(80px)', animation: 'orbFloat 25s infinite alternate-reverse'
      }} />

      <style>{`
        @keyframes orbFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(100px, 100px) scale(1.2); }
        }
      `}</style>
    </div>
  );
}
