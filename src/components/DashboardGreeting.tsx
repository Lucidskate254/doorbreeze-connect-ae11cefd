
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { Sun, Sunrise, Flower, City, Moon, Stars } from 'lucide-react';

export const DashboardGreeting = ({ customerName }: { customerName: string | undefined }) => {
  const [greeting, setGreeting] = useState('');
  const [timeEmoji, setTimeEmoji] = useState<React.ReactNode | null>(null);
  
  // Time-based greeting and emoji
  useEffect(() => {
    const hour = new Date().getHours();
    let timeGreeting = '';
    let emoji = null;
    
    if (hour < 12) {
      timeGreeting = 'Good Morning';
      // Pick a random morning emoji
      const morningEmojis = [
        <Sun size={24} className="text-yellow-500" />, 
        <Sunrise size={24} className="text-orange-400" />
      ];
      emoji = morningEmojis[Math.floor(Math.random() * morningEmojis.length)];
    } else if (hour < 17) {
      timeGreeting = 'Good Afternoon';
      // Pick a random afternoon emoji
      const afternoonEmojis = [
        <Sun size={24} className="text-yellow-500" />, 
        <Flower size={24} className="text-pink-400" />
      ];
      emoji = afternoonEmojis[Math.floor(Math.random() * afternoonEmojis.length)];
    } else {
      timeGreeting = 'Good Evening';
      // Pick a random evening emoji
      const eveningEmojis = [
        <Moon size={24} className="text-blue-400" />, 
        <Stars size={24} className="text-purple-400" />,
        <City size={24} className="text-indigo-400" />
      ];
      emoji = eveningEmojis[Math.floor(Math.random() * eveningEmojis.length)];
    }
    
    setGreeting(timeGreeting);
    setTimeEmoji(emoji);
  }, []);

  return (
    <div className="flex items-center mb-6">
      <motion.div 
        className="mr-2" 
        animate={{ 
          y: [0, -10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          repeatType: "loop"
        }}
      >
        {timeEmoji}
      </motion.div>
      <h1 className="text-2xl font-bold">
        {greeting}, {customerName || "Customer"}
      </h1>
    </div>
  );
};
