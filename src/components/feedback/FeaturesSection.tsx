
import { motion } from "framer-motion";
import { MessageSquare, Shield, Clock, Users } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-background to-background/50 p-8 rounded-xl border border-border/50 dark:border-border/20 shadow-sm"
    >
      <h2 className="text-2xl font-bold mb-4">Key Features</h2>
      <div className="space-y-4">
        <div className="flex items-start gap-3 group">
          <div className="bg-doorrush-light dark:bg-doorrush-dark/30 p-2 rounded-lg transition-all group-hover:scale-110 duration-300">
            <MessageSquare className="h-5 w-5 text-doorrush-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Real-time Messaging</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Communicate directly with agents and clients through our secure messaging system.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 group">
          <div className="bg-doorrush-light dark:bg-doorrush-dark/30 p-2 rounded-lg transition-all group-hover:scale-110 duration-300">
            <Shield className="h-5 w-5 text-doorrush-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Secure Transactions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">End-to-end encryption for all sensitive data and communications.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 group">
          <div className="bg-doorrush-light dark:bg-doorrush-dark/30 p-2 rounded-lg transition-all group-hover:scale-110 duration-300">
            <Clock className="h-5 w-5 text-doorrush-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Appointment Scheduling</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Easily book and manage property viewings and meetings.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 group">
          <div className="bg-doorrush-light dark:bg-doorrush-dark/30 p-2 rounded-lg transition-all group-hover:scale-110 duration-300">
            <Users className="h-5 w-5 text-doorrush-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Agent Matching</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Find the perfect agent based on your specific needs and preferences.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
