
import React, { useEffect, useState } from 'react';

interface FoodParticleProps {
  x: number;
  y: number;
  onRemove: () => void;
}

const FoodParticle: React.FC<FoodParticleProps> = ({ x, y, onRemove }) => {
  const [currentY, setCurrentY] = useState(y);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const fallInterval = setInterval(() => {
      setCurrentY(prev => {
        const newY = prev + 2;
        
        // Start fading when near bottom
        if (newY > window.innerHeight - 200) {
          setOpacity(prev => Math.max(0, prev - 0.05));
        }
        
        // Remove when it reaches bottom or becomes invisible
        if (newY > window.innerHeight - 100 || opacity <= 0) {
          onRemove();
          return prev;
        }
        
        return newY;
      });
    }, 50);

    // Auto remove after 5 seconds
    const removeTimeout = setTimeout(() => {
      onRemove();
    }, 5000);

    return () => {
      clearInterval(fallInterval);
      clearTimeout(removeTimeout);
    };
  }, [onRemove, opacity]);

  return (
    <div
      className="absolute w-2 h-2 bg-yellow-600 rounded-full shadow-md animate-wiggle z-20"
      style={{
        left: `${x}px`,
        top: `${currentY}px`,
        opacity: opacity,
      }}
    >
      {/* Food particle glow effect */}
      <div className="absolute inset-0 bg-yellow-400 rounded-full animate-pulse opacity-50"></div>
    </div>
  );
};

export default FoodParticle;
