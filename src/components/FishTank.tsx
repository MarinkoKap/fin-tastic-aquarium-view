
import React, { useState, useRef, useEffect } from 'react';
import Fish from './Fish';
import FoodParticle from './FoodParticle';
import Bubbles from './Bubbles';

interface FoodParticle {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

const FishTank = () => {
  const [foodParticles, setFoodParticles] = useState<FoodParticle[]>([]);
  const tankRef = useRef<HTMLDivElement>(null);
  const foodIdRef = useRef(0);

  const handleTankClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!tankRef.current) return;

    const rect = tankRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Create new food particle
    const newFood: FoodParticle = {
      id: foodIdRef.current++,
      x,
      y,
      createdAt: Date.now(),
    };

    setFoodParticles(prev => [...prev, newFood]);
  };

  // Clean up old food particles
  useEffect(() => {
    const interval = setInterval(() => {
      setFoodParticles(prev => 
        prev.filter(food => Date.now() - food.createdAt < 5000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fishData = [
    { id: 1, color: '#FF6B35', size: 'medium', speed: 2 },
    { id: 2, color: '#F7931E', size: 'large', speed: 1.5 },
    { id: 3, color: '#FFD23F', size: 'small', speed: 3 },
    { id: 4, color: '#06FFA5', size: 'medium', speed: 2.5 },
    { id: 5, color: '#4ECDC4', size: 'small', speed: 3.5 },
    { id: 6, color: '#45B7D1', size: 'large', speed: 1.8 },
    { id: 7, color: '#96CEB4', size: 'medium', speed: 2.2 },
    { id: 8, color: '#FECA57', size: 'small', speed: 2.8 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl h-[80vh] bg-gradient-to-b from-cyan-200 via-blue-300 to-blue-500 rounded-3xl border-8 border-gray-300 shadow-2xl overflow-hidden cursor-pointer"
           ref={tankRef}
           onClick={handleTankClick}>
        
        {/* Tank glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-3xl"></div>
        
        {/* Water surface shimmer */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-cyan-100/30 to-transparent animate-pulse"></div>
        
        {/* Tank bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-yellow-600/40 via-yellow-500/30 to-transparent"></div>
        
        {/* Decorative seaweed */}
        <div className="absolute bottom-0 left-8 w-6 h-32 bg-green-500 rounded-t-full opacity-60 animate-sway"></div>
        <div className="absolute bottom-0 right-12 w-4 h-28 bg-green-600 rounded-t-full opacity-70 animate-sway-reverse"></div>
        <div className="absolute bottom-0 left-1/3 w-5 h-36 bg-green-400 rounded-t-full opacity-50 animate-sway"></div>
        
        {/* Bubbles */}
        <Bubbles />
        
        {/* Fish */}
        {fishData.map((fish) => (
          <Fish
            key={fish.id}
            color={fish.color}
            size={fish.size}
            speed={fish.speed}
            foodParticles={foodParticles}
          />
        ))}
        
        {/* Food particles */}
        {foodParticles.map((food) => (
          <FoodParticle
            key={food.id}
            x={food.x}
            y={food.y}
            onRemove={() => setFoodParticles(prev => prev.filter(f => f.id !== food.id))}
          />
        ))}
        
        {/* Instructions */}
        <div className="absolute top-4 left-4 text-white/80 font-medium text-lg drop-shadow-lg">
          🐠 Click anywhere to feed the fish!
        </div>
      </div>
    </div>
  );
};

export default FishTank;
