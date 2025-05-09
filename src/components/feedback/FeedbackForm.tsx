
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Send, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const FeedbackForm = () => {
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState('4');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create a specific feedback type for the database
      // Note: Make sure 'feedbacks' table exists in your database
      const { data, error } = await supabase
        .from('feedbacks')
        .insert([
          { 
            feedback_type: feedbackType, 
            rating: parseInt(rating), 
            name, 
            email, 
            message 
          }
        ]);

      if (error) throw error;
      
      // Show success message
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your valuable feedback!",
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-12 relative overflow-hidden border-opacity-30 dark:border-opacity-20">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-doorrush-light/10 dark:to-doorrush-dark/20 pointer-events-none"></div>
      <CardHeader>
        <CardTitle>Send Us Your Feedback</CardTitle>
        <CardDescription>
          We value your input and are constantly working to improve DoorRush 254.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-8"
            >
              <motion.div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut"
                }}
              >
                <Send className="h-8 w-8 text-green-600 dark:text-green-400" />
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Thank You!
              </motion.h3>
              <motion.p 
                className="text-gray-600 dark:text-gray-400"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Your feedback has been received. We appreciate your input and will review it shortly.
              </motion.p>
            </motion.div>
          ) : (
            <motion.form
              key="form" 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="space-y-2">
                <Label htmlFor="feedbackType">Feedback Type</Label>
                <RadioGroup 
                  value={feedbackType} 
                  onValueChange={setFeedbackType}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2 transition-all hover:scale-105">
                    <RadioGroupItem value="general" id="general" />
                    <Label htmlFor="general">General</Label>
                  </div>
                  <div className="flex items-center space-x-2 transition-all hover:scale-105">
                    <RadioGroupItem value="bug" id="bug" />
                    <Label htmlFor="bug">Bug Report</Label>
                  </div>
                  <div className="flex items-center space-x-2 transition-all hover:scale-105">
                    <RadioGroupItem value="feature" id="feature" />
                    <Label htmlFor="feature">Feature Request</Label>
                  </div>
                  <div className="flex items-center space-x-2 transition-all hover:scale-105">
                    <RadioGroupItem value="support" id="support" />
                    <Label htmlFor="support">Support</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">How would you rate your experience?</Label>
                <RadioGroup 
                  value={rating} 
                  onValueChange={setRating}
                  className="flex gap-4"
                >
                  {['1', '2', '3', '4', '5'].map((value) => (
                    <div key={value} className="flex items-center space-x-2 transition-all hover:scale-110">
                      <RadioGroupItem value={value} id={`rating-${value}`} />
                      <Label htmlFor={`rating-${value}`}>
                        <Star className={`h-5 w-5 ${parseInt(rating) >= parseInt(value) ? 'text-yellow-400 dark:text-yellow-300 fill-yellow-400 dark:fill-yellow-300' : 'text-gray-300 dark:text-gray-600'}`} />
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    className="transition-all focus:ring-2 focus:ring-doorrush-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="transition-all focus:ring-2 focus:ring-doorrush-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  className="min-h-[150px] transition-all focus:ring-2 focus:ring-doorrush-primary/20" 
                  required 
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="consent" 
                  checked={consent} 
                  onCheckedChange={(checked) => setConsent(checked === true)} 
                />
                <Label htmlFor="consent" className="text-sm">
                  I consent to DoorRush 254 processing my data for the purpose of handling my feedback.
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full group relative overflow-hidden"
                disabled={!consent || isSubmitting}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-r-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Feedback
                    </>
                  )}
                </span>
                <span className="absolute inset-0 overflow-hidden rounded-md before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-doorrush-primary/0 before:via-doorrush-primary/50 before:to-doorrush-primary/0 before:opacity-0 before:transition before:duration-500 group-hover:before:animate-[shimmer_1s_ease-in-out_infinite] before:-translate-x-full before:animate-[shimmer_2s_ease-in-out_infinite]"></span>
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
