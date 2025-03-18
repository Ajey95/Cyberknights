import { useEffect, useRef } from 'react';

const HoliEffect = ({ active, position }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  // Colors for Holi effect
  const colors = [
    '#FE4365', // Pink
    '#FC9D9A', // Light Pink
    '#F9CDAD', // Peach
    '#C8C8A9', // Light Green
    '#83AF9B', // Teal
    '#FF9C5B', // Orange
    '#F67280', // Coral
    '#C06C84', // Mauve
  ];

  // Create particles when active changes
  useEffect(() => {
    if (active && position) {
      createParticles();
    }
  }, [active, position]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Add gravity
        particle.vy += 0.05;
        
        // Fade out
        particle.opacity -= 0.01;
        
        // Remove if faded out
        if (particle.opacity <= 0) {
          particlesRef.current.splice(index, 1);
          return;
        }
        
        // Draw particle
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;
      
      // Continue animation if particles exist
      if (particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Create particles
  const createParticles = () => {
    if (!position) return;
    
    const newParticles = [];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      
      newParticles.push({
        x: position.x,
        y: position.y,
        size: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        opacity: 1,
      });
    }
    
    particlesRef.current = [...particlesRef.current, ...newParticles];
  };

  // Set canvas dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
    />
  );
};

export default HoliEffect;