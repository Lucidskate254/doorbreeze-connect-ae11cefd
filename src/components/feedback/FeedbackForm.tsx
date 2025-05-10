
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function FeedbackForm() {
  const [feedbackType, setFeedbackType] = useState("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a custom table insertion to handle the feedbacks table
      const { error } = await supabase.rpc('insert_feedback', {
        p_feedback_type: feedbackType,
        p_name: name,
        p_email: email, 
        p_message: message,
        p_rating: rating
      });

      if (error) throw error;

      toast({
        title: "Feedback received!",
        description: "Thank you for your feedback. We'll get back to you soon.",
      });

      setSubmitted(true);
      
      // Reset form after animation completes
      setTimeout(() => {
        setFeedbackType("general");
        setName("");
        setEmail("");
        setMessage("");
        setRating(5);
      }, 2000);
      
      // Reset submitted state after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-10 mb-8 overflow-hidden shadow-lg border-t-4 border-blue-400 dark:border-blue-600 dark:bg-gray-800 transition-all">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Send Us Your Feedback</h2>
          <p className="text-muted-foreground">
            We value your input to improve our services
          </p>
        </div>

        {submitted ? (
          <motion.div 
            className="flex flex-col items-center py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.div
              animate={{
                scale: [0.8, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
            >
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            </motion.div>
            <h3 className="text-xl font-bold">Thank You!</h3>
            <p className="text-muted-foreground mt-2 text-center max-w-sm">
              Your feedback has been submitted successfully. We appreciate your input!
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="feedbackType">Feedback Type</Label>
              <Select
                value={feedbackType}
                onValueChange={setFeedbackType}
              >
                <SelectTrigger id="feedbackType">
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Feedback</SelectItem>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
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
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rate your experience (1-5)</Label>
              <div className="flex space-x-4 items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    variant={rating >= star ? "default" : "outline"}
                    className={`h-10 w-10 rounded-full p-0 ${
                      rating >= star 
                        ? "bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600" 
                        : ""
                    }`}
                    onClick={() => setRating(star)}
                  >
                    {star}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="w-full md:w-auto min-w-[150px] bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
