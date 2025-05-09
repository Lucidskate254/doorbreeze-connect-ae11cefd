import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, Check, User } from "lucide-react";
import { ELDORET_LOCATIONS } from "@/types";
import { motion } from "framer-motion";

const Profile = () => {
  const { customer, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: customer?.full_name || "",
    phone_number: customer?.phone_number || "",
    address: customer?.address || "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(
    customer?.profile_picture || null
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (value: string) => {
    setFormData((prev) => ({ ...prev, address: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
    
    setEditing(false);
  };
  
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* 3D Emblem Logo */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 1
            }}
            className="relative" 
          >
            <motion.img 
              src="/lovable-uploads/35bccf6c-f632-44dc-a955-1b2180de6ef8.png" 
              alt="DoorRush 254 3D Emblem"
              className="h-24 w-24 object-contain"
              animate={{
                rotateY: [0, 10, 0, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
            <motion.div 
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-4 w-16 bg-black/10 rounded-full blur-md dark:bg-white/10"
              animate={{
                scaleX: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </motion.div>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  {editing 
                    ? "Edit your profile information below" 
                    : "View and manage your personal details"}
                </CardDescription>
              </div>
              
              {!editing && (
                <Button 
                  variant="outline"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-32 w-32 rounded-full overflow-hidden bg-muted">
                  {profilePreview ? (
                    <img 
                      src={profilePreview} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-doorrush-primary text-white">
                      <User size={48} />
                    </div>
                  )}
                </div>
                
                {editing && (
                  <label 
                    htmlFor="profile_picture" 
                    className="absolute bottom-0 right-0 bg-doorrush-primary text-white p-2 rounded-full cursor-pointer hover:bg-doorrush-dark transition-colors"
                  >
                    <Camera size={16} />
                    <Input
                      id="profile_picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address (Eldoret)</Label>
                {editing ? (
                  <Select 
                    value={formData.address} 
                    onValueChange={handleAddressChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      {ELDORET_LOCATIONS.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="address"
                    value={formData.address}
                    disabled
                  />
                )}
              </div>
            </div>
          </CardContent>
          
          {editing && (
            <CardFooter className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-doorrush-primary hover:bg-doorrush-dark"
                onClick={handleSave}
              >
                <Check size={16} className="mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <div className="mt-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start text-left"
                onClick={() => navigate("/change-password")}
              >
                Change Password
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-left"
                onClick={() => navigate("/notification-preferences")}
              >
                Notification Preferences
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-left text-destructive hover:text-destructive"
                onClick={logout}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
