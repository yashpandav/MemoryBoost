import React, { useEffect, useState } from 'react';

export const Confetti = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', 
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', 
      '#009688', '#4caf50', '#8bc34a', '#cddc39',
      '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
    ];
    
    const newParticles = [];
    
    // Create confetti particles
    for (let i = 0; i < 100; i++) {
      const size = Math.random() * 10 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 3 + 2;
      const animationDelay = Math.random() * 0.5;
      
      newParticles.push(
        <div
          key={i}
          className="absolute"
          style={{
            left: `${left}%`,
            top: '-20px',
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            borderRadius: '50%',
            animation: `confetti-fall ${animationDuration}s ease-in ${animationDelay}s forwards`,
          }}
        ></div>
      );
    }
    
    setParticles(newParticles);
    
    // Clean up animation
    return () => {
      setParticles([]);
    };
  }, []);
  
  return (
    <>
      <style>
        {`
          @keyframes confetti-fall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>
      <div className="fixed top-0 left-0 w-full h-0 overflow-visible z-50 pointer-events-none">
        {particles}
      </div>
    </>
  );
};