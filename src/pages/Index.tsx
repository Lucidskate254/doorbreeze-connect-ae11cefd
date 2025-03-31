
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, ClipboardList, ChevronRight, Phone } from "lucide-react";

const Index = () => {
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
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-doorrush-light to-background py-16 px-4">
          <div className="container mx-auto max-w-6xl">
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
              <div className="hidden md:block">
                <img 
                  src="https://placehold.co/600x400/E3F2FD/1E88E5?text=DoorRush+Delivery"
                  alt="DoorRush Delivery"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-doorrush-light p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-doorrush-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Shopping</h3>
                <p className="text-muted-foreground">
                  We'll shop for your groceries, electronics, or any items you need and deliver them straight to your doorstep.
                </p>
              </div>
              
              <div className="bg-doorrush-light p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-doorrush-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Delivery</h3>
                <p className="text-muted-foreground">
                  Fast and reliable delivery services for packages, documents, food and more throughout Eldoret.
                </p>
              </div>
              
              <div className="bg-doorrush-light p-6 rounded-lg text-center">
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
        
        {/* CTA Section */}
        <section className="py-16 px-4 bg-doorrush-primary">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Create an account today and experience the convenience of DoorRush delivery services in Eldoret.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-doorrush-primary hover:bg-gray-100">
                Sign Up Now
                <ChevronRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-8 px-4">
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
              <p className="text-gray-300">+254 700 000 000</p>
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
