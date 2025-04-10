import { useState } from 'react';
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
import MainLayout from '@/components/MainLayout';

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState('4');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the feedback to your backend
    console.log({ feedbackType, rating, name, email, message, consent });
    setSubmitted(true);
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Us
            </CardTitle>
            <CardDescription>Get in touch with our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg">support@doorbreeze.com</p>
            <p className="text-sm text-gray-500 mt-1">Response within 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Call Us
            </CardTitle>
            <CardDescription>Speak directly with our team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg">+1 (555) 123-4567</p>
            <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9am-5pm EST</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Visit Us
            </CardTitle>
            <CardDescription>Our headquarters location</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg">123 Tech Avenue</p>
            <p className="text-sm text-gray-500 mt-1">San Francisco, CA 94105</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">About DoorBreeze</h2>
          <p className="mb-4">
            DoorBreeze is a comprehensive property management platform designed to streamline the process of 
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
            document sharing, DoorBreeze is your all-in-one solution for modern property management.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 mt-1 text-blue-600" />
              <div>
                <h3 className="font-semibold">Real-time Messaging</h3>
                <p className="text-sm text-gray-600">Communicate directly with agents and clients through our secure messaging system.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 mt-1 text-blue-600" />
              <div>
                <h3 className="font-semibold">Secure Transactions</h3>
                <p className="text-sm text-gray-600">End-to-end encryption for all sensitive data and communications.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 mt-1 text-blue-600" />
              <div>
                <h3 className="font-semibold">Appointment Scheduling</h3>
                <p className="text-sm text-gray-600">Easily book and manage property viewings and meetings.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 mt-1 text-blue-600" />
              <div>
                <h3 className="font-semibold">Agent Matching</h3>
                <p className="text-sm text-gray-600">Find the perfect agent based on your specific needs and preferences.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Send Us Your Feedback</CardTitle>
          <CardDescription>
            We value your input and are constantly working to improve DoorBreeze.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
              <p className="text-gray-600">
                Your feedback has been received. We appreciate your input and will review it shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="feedbackType">Feedback Type</Label>
                <RadioGroup 
                  value={feedbackType} 
                  onValueChange={setFeedbackType}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="general" />
                    <Label htmlFor="general">General</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bug" id="bug" />
                    <Label htmlFor="bug">Bug Report</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="feature" id="feature" />
                    <Label htmlFor="feature">Feature Request</Label>
                  </div>
                  <div className="flex items-center space-x-2">
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
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value} id={`rating-${value}`} />
                      <Label htmlFor={`rating-${value}`}>
                        <Star className={`h-5 w-5 ${parseInt(rating) >= parseInt(value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
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
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  className="min-h-[150px]" 
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
                  I consent to DoorBreeze processing my data for the purpose of handling my feedback.
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={!consent}>
                <Send className="mr-2 h-4 w-4" />
                Submit Feedback
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Accessibility Information</h2>
        <p className="mb-4">
          DoorBreeze is committed to ensuring digital accessibility for people with disabilities. 
          We are continually improving the user experience for everyone and applying the relevant 
          accessibility standards.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Conformance Status</h3>
            <p className="text-sm text-gray-600">
              DoorBreeze is partially conformant with WCAG 2.1 level AA. Partially conformant means 
              that some parts of the content do not fully conform to the accessibility standard.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Compatibility</h3>
            <p className="text-sm text-gray-600">
              DoorBreeze is designed to be compatible with the following assistive technologies:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
              <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
              <li>Keyboard navigation</li>
              <li>High contrast mode</li>
              <li>Text-to-speech software</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Feedback</h3>
          <p className="text-sm text-gray-600">
            We welcome your feedback on the accessibility of DoorBreeze. Please let us know if you 
            encounter accessibility barriers by contacting us at accessibility@doorbreeze.com or by 
            phone at +1 (555) 123-4567.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
