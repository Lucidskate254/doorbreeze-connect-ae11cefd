
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, Star, HelpCircle, Shield, Clock, Users, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/MainLayout';
import { AnimatedTestimonialsDemo } from '@/components/ui/AnimatedTestimonialsDemo';

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState('4');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [bounceEmoji, setBounceEmoji] = useState('👋');
  
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save feedback to Supabase
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
    <MainLayout title="Feedback & Contact" showBackButton={true}>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/dashboard')}>
              <Home className="h-4 w-4 mr-1 inline" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Feedback & Contact</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10 border-opacity-30 dark:border-opacity-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-doorrush-primary" />
                Email Us
              </CardTitle>
              <CardDescription>Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <a 
                href="mailto:ryanemunyasa@gmail.com" 
                className="text-lg text-doorrush-primary hover:underline"
              >
                ryanemunyasa@gmail.com
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Response within 24 hours</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10 border-opacity-30 dark:border-opacity-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-doorrush-primary" />
                Call Us
              </CardTitle>
              <CardDescription>Speak directly with our team</CardDescription>
            </CardHeader>
            <CardContent>
              <a 
                href="tel:+254758301710" 
                className="text-lg text-doorrush-primary hover:underline"
              >
                +254 758 301 710
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mon-Fri, 9am-5pm EAT</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="h-full transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10 border-opacity-30 dark:border-opacity-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-doorrush-primary" />
                Visit Us
              </CardTitle>
              <CardDescription>Our headquarters location</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Eldoret</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Uasin Gishu County, Kenya</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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
      </div>

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

      <div className="bg-gradient-to-br from-background via-background to-doorrush-light/5 dark:to-doorrush-dark/10 p-6 rounded-lg mb-12 shadow-sm border border-border/30 dark:border-border/10">
        <h2 className="text-2xl font-bold mb-4">Accessibility Information</h2>
        <p className="mb-4">
          DoorRush 254 is committed to ensuring digital accessibility for people with disabilities. 
          We are continually improving the user experience for everyone and applying the relevant 
          accessibility standards.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold mb-2">Conformance Status</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              DoorRush 254 is partially conformant with WCAG 2.1 level AA. Partially conformant means 
              that some parts of the content do not fully conform to the accessibility standard.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold mb-2">Compatibility</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              DoorRush 254 is designed to be compatible with the following assistive technologies:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-2">
              <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
              <li>Keyboard navigation</li>
              <li>High contrast mode</li>
              <li>Text-to-speech software</li>
            </ul>
          </motion.div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Feedback</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We welcome your feedback on the accessibility of DoorRush 254. Please let us know if you 
            encounter accessibility barriers by contacting us at{' '}
            <a href="mailto:ryanemunyasa@gmail.com" className="text-doorrush-primary hover:underline">
              ryanemunyasa@gmail.com
            </a> or by 
            phone at <a href="tel:+254758301710" className="text-doorrush-primary hover:underline">+254 758 301 710</a>.
          </p>
        </div>
      </div>
      
      <AnimatedTestimonialsDemo />
    </MainLayout>
  );
}
