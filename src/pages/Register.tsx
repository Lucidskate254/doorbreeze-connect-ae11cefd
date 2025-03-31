import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Phone, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ELDORET_LOCATIONS } from "@/types";
const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    password: "",
    confirmPassword: ""
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const {
    register,
    isLoading
  } = useAuth();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleAddressChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      address: value
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await register({
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        address: formData.address,
        password: formData.password,
        profile_picture: profilePicture || undefined
      });
    } catch (error) {
      console.error(error);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-doorrush-light to-background p-4 bg-cyan-700">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-doorrush-primary logo-text flex justify-center items-center">
            <span className="bg-doorrush-primary text-white p-2 rounded-full mr-2">
              <Phone size={24} />
            </span>
            DoorRush
          </h1>
          <p className="text-muted-foreground mt-2">Join DoorRush today</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Sign up to start using DoorRush services</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" name="full_name" placeholder="John Doe" value={formData.full_name} onChange={handleInputChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input id="phone_number" name="phone_number" type="tel" placeholder="07XX XXX XXX" value={formData.phone_number} onChange={handleInputChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Location (Eldoret)</Label>
                <Select onValueChange={handleAddressChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent>
                    {ELDORET_LOCATIONS.map(location => <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profile_picture">Profile Picture</Label>
                <div className="flex items-center gap-4">
                  {profilePreview && <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img src={profilePreview} alt="Profile preview" className="w-full h-full object-cover" />
                    </div>}
                  <label htmlFor="profile_picture" className="flex-1 cursor-pointer border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm flex items-center gap-2">
                    <Upload size={16} />
                    {profilePicture ? 'Change photo' : 'Upload photo'}
                    <Input id="profile_picture" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full bg-doorrush-primary hover:bg-doorrush-dark" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-doorrush-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>;
};
export default Register;