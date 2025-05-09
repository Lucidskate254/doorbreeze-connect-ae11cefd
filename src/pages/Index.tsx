
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, ClipboardList, ChevronRight, Phone, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const backgroundImages = [
    "/lovable-uploads/ae28c793-25cd-428e-879b-1add7982c20a.png",
    "/lovable-uploads/681c4d9b-d7f5-42fe-b1f3-4ac47ecaa77c.png",
    "/lovable-uploads/fb1dad1b-428a-401f-bc37-8114217e8ba1.png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Phone number copied!",
      description: "The phone number has been copied to clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePhoneClick = () => {
    // You can either open the phone app or copy to clipboard
    copyToClipboard("+254758301710");
  };
  
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-doorrush-primary logo-text flex items-center">
              <span className="bg-doorrush-primary text-white p-1.5 rounded-full mr-2">
                <Phone size={20} />
              </span>
              DoorRush
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-doorrush-primary hover:text-doorrush-dark font-medium"
            >
              Login
            </Link>
            <Link to="/register">
              <Button className="bg-doorrush-primary hover:bg-doorrush-dark">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero Section with Background Image */}
        <section className="relative py-24 px-4 overflow-hidden section-gradient-connector white-to-blue">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
            style={{ 
              backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
              opacity: 0.25,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `scale(${1 + (currentImageIndex * 0.05)}) translateX(${currentImageIndex * 5}px)`,
            }}
          ></div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-doorrush-primary/20 to-background/95"></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Your Delivery Partner in Eldoret
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Fast, reliable delivery services for all your needs. Shopping, deliveries, and errand services at your fingertips.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link to="/register">
                    <Button size="lg" className="bg-doorrush-primary hover:bg-doorrush-dark w-full sm:w-auto">
                      Get Started
                      <ChevronRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex justify-center items-center">
                <img 
                  src={backgroundImages[(currentImageIndex + 1) % backgroundImages.length]}
                  alt="DoorRush Delivery"
                  className="rounded-lg shadow-lg max-w-sm h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Founder Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Founder</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="founder-image-container">
                <img 
                  src="/lovable-uploads/64ce1a36-da00-4502-959e-1052049e4fa1.png" 
                  alt="Ryane Munyasa - Founder" 
                  className="founder-image"
                />
                <div className="border-animation"></div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-doorrush-primary">Ryane Munyasa</h3>
                <p className="text-sm text-muted-foreground">Founder & CEO, IT Graduate</p>
                <p className="text-lg">
                  Welcome to DoorRush! I started this company with a simple vision - to revolutionize 
                  delivery services in Eldoret by combining technology with exceptional customer service.
                </p>
                <p className="text-lg">
                  As an IT graduate, I understand the power of technology in solving everyday problems. 
                  Our platform is designed to be intuitive, fast, and reliable - just like our delivery service.
                </p>
                <p className="text-lg">
                  We're more than just a delivery service; we're your partner in making life easier. 
                  Join us and experience the convenience of DoorRush today.
                </p>
                <Link to="/register">
                  <Button className="bg-doorrush-primary hover:bg-doorrush-dark mt-4">
                    Join DoorRush
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-white section-gradient-connector blue-to-primary">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-doorrush-light p-6 rounded-lg text-center service-card">
                <div className="w-16 h-16 bg-doorrush-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Shopping</h3>
                <p className="text-muted-foreground">
                  We'll shop for your groceries, electronics, or any items you need and deliver them straight to your doorstep.
                </p>
              </div>
              
              <div className="bg-doorrush-light p-6 rounded-lg text-center service-card">
                <div className="w-16 h-16 bg-doorrush-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Delivery</h3>
                <p className="text-muted-foreground">
                  Fast and reliable delivery services for packages, documents, food and more throughout Eldoret.
                </p>
              </div>
              
              <div className="bg-doorrush-light p-6 rounded-lg text-center service-card">
                <div className="w-16 h-16 bg-doorrush-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Errands</h3>
                <p className="text-muted-foreground">
                  We'll handle your errands like bill payments, picking up prescriptions, or any other tasks you need assistance with.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section - Add footer-gradient-connector class */}
        <section className="py-16 px-4 bg-doorrush-primary footer-gradient-connector">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Create an account today and experience the convenience of DoorRush delivery services in Eldoret.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-doorrush-primary hover:bg-gray-100 glow-on-hover">
                Sign Up Now
                <ChevronRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-8 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DoorRush</h3>
              <p className="text-gray-300">
                Your trusted delivery partner in Eldoret. Fast, reliable, and affordable.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-300 hover:text-white">Login</Link></li>
                <li><Link to="/register" className="text-gray-300 hover:text-white">Sign Up</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-300">Eldoret, Kenya</p>
              <p className="text-gray-300">info@doorrush.com</p>
              <div 
                className="flex items-center text-gray-300 hover:text-white cursor-pointer transition-colors group"
                onClick={handlePhoneClick}
              >
                <span>+254758301710</span>
                <Copy size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                {copied && <span className="ml-2 text-xs text-green-400">Copied!</span>}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>© {new Date().getFullYear()} DoorRush. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
