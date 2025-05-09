
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export const ContactCards = () => {
  return (
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
  );
};
