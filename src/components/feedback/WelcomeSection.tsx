
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';

export const WelcomeSection = () => {
  const [greeting, setGreeting] = useState('');
  const [bounceEmoji, setBounceEmoji] = useState('👋');
  
  // Time-based greeting and emoji
  useEffect(() => {
    const hour = new Date().getHours();
    let timeGreeting = '';
    let emoji = '';
    
    if (hour < 12) {
      timeGreeting = 'Good Morning';
      emoji = ['☀️', '🌞', '🌅', '🍳', '☕'][Math.floor(Math.random() * 5)];
    } else if (hour < 17) {
      timeGreeting = 'Good Afternoon';
      emoji = ['🌤️', '☀️', '🌻', '🍹', '🏄‍♂️'][Math.floor(Math.random() * 5)];
    } else {
      timeGreeting = 'Good Evening';
      emoji = ['🌙', '✨', '🌆', '🍷', '🌃'][Math.floor(Math.random() * 5)];
    }
    
    setGreeting(timeGreeting);
    setBounceEmoji(emoji);
  }, []);

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-background to-background/50 p-8 rounded-xl border border-border/50 dark:border-border/20 shadow-sm"
    >
      <div className="flex items-center space-x-3 mb-4">
        <motion.div 
          className="text-4xl" 
          animate={{ 
            y: [0, -15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            repeatType: "loop"
          }}
        >
          {bounceEmoji}
        </motion.div>
        <h2 className="text-2xl font-bold">{greeting}! Welcome to DoorRush 254</h2>
      </div>
      <p className="mb-4">
        DoorRush 254 is a comprehensive property management platform designed to streamline the process of 
        managing properties, connecting with agents, and facilitating smooth transactions between buyers, 
        sellers, and real estate professionals.
      </p>
      <p className="mb-4">
        Our mission is to simplify real estate transactions by providing a user-friendly platform that 
        connects all stakeholders in the property market, from property owners to real estate agents 
        and potential buyers.
      </p>
      <p>
        With features like real-time messaging, property listings, appointment scheduling, and secure 
        document sharing, DoorRush 254 is your all-in-one solution for modern property management.
      </p>
    </motion.div>
  );
};
