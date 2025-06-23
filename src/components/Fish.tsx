
import React, { useState, useEffect } from 'react';

interface FishProps {
  color: string;
  size: 'small' | 'medium' | 'large';
  speed: number;
  foodParticles: Array<{ id: number; x: number; y: number; createdAt: number }>;
}

const Fish: React.FC<FishProps> = ({ color, size, speed, foodParticles }) => {
  const [position, setPosition] = useState({
    x: Math.random() * 800,
    y: Math.random() * 400 + 100,
  });
  const [direction, setDirection] = useState({
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const [targetFood, setTargetFood] = useState<{ x: number; y: number } | null>(null);

  const sizeClasses = {
    small: 'w-8 h-6',
    medium: 'w-12 h-8',
    large: 'w-16 h-12',
  };

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newDirX = direction.x;
        let newDirY = direction.y;

        // Check for nearby food and move towards it
        if (foodParticles.length > 0 && !targetFood) {
          const nearbyFood = foodParticles.find(food => {
            const distance = Math.sqrt(
              Math.pow(food.x - prev.x, 2) + Math.pow(food.y - prev.y, 2)
            );
            return distance < 150;
          });

          if (nearbyFood) {
            setTargetFood({ x: nearbyFood.x, y: nearbyFood.y });
          }
        }

        // Move towards food if targeting
        if (targetFood) {
          const dx = targetFood.x - prev.x;
          const dy = targetFood.y - prev.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 20) {
            setTargetFood(null);
          } else {
            newDirX = (dx / distance) * speed * 1.5;
            newDirY = (dy / distance) * speed * 1.5;
          }
        } else {
          // Random swimming with occasional direction changes
          if (Math.random() < 0.02) {
            newDirX = (Math.random() - 0.5) * speed;
            newDirY = (Math.random() - 0.5) * speed * 0.5;
            setDirection({ x: newDirX, y: newDirY });
          }
        }

        newX += newDirX;
        newY += newDirY;

        // Boundary checking with smooth bouncing
        if (newX < 20) {
          newX = 20;
          newDirX = Math.abs(newDirX);
          setDirection({ x: newDirX, y: newDirY });
          setIsFlipped(false);
        }
        if (newX > window.innerWidth - 100) {
          newX = window.innerWidth - 100;
          newDirX = -Math.abs(newDirX);
          setDirection({ x: newDirX, y: newDirY });
          setIsFlipped(true);
        }
        if (newY < 50) {
          newY = 50;
          newDirY = Math.abs(newDirY);
          setDirection({ x: newDirX, y: newDirY });
        }
        if (newY > window.innerHeight - 150) {
          newY = window.innerHeight - 150;
          newDirY = -Math.abs(newDirY);
          setDirection({ x: newDirX, y: newDirY });
        }

        // Update flip state based on horizontal direction
        if (newDirX > 0) setIsFlipped(false);
        if (newDirX < 0) setIsFlipped(true);

        return { x: newX, y: newY };
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, [direction, speed, foodParticles, targetFood]);

  return (
    <div
      className={`absolute transition-all duration-100 ${sizeClasses[size]} z-10`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)',
      }}
    >
      {/* Fish body */}
      <div 
        className="relative w-full h-full rounded-full shadow-lg animate-swimming"
        style={{ backgroundColor: color }}
      >
        {/* Fish eye */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full">
          <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-black rounded-full"></div>
        </div>
        
        {/* Fish tail */}
        <div 
          className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-4 rotate-45 opacity-80"
          style={{ backgroundColor: color }}
        ></div>
        
        {/* Fish fins */}
        <div 
          className="absolute -bottom-1 left-1/3 w-2 h-2 rounded-full opacity-60"
          style={{ backgroundColor: color }}
        ></div>
        <div 
          className="absolute -top-1 left-1/2 w-1 h-2 rounded-full opacity-60"
          style={{ backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
};

export default Fish;
