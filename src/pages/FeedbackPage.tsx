
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { AnimatedTestimonialsDemo } from '@/components/ui/AnimatedTestimonialsDemo';
import { ContactCards } from '@/components/feedback/ContactCards';
import { WelcomeSection } from '@/components/feedback/WelcomeSection';
import { FeaturesSection } from '@/components/feedback/FeaturesSection';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { AccessibilityInfo } from '@/components/feedback/AccessibilityInfo';

export default function FeedbackPage() {
  const navigate = useNavigate();

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
      
      <ContactCards />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <WelcomeSection />
        <FeaturesSection />
      </div>

      <FeedbackForm />
      <AccessibilityInfo />
      
      <AnimatedTestimonialsDemo />
    </MainLayout>
  );
}
