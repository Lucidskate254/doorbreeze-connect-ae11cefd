
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Phone, Upload, Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, isLoading } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddressChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      address: value
    }));
    
    // Clear error when user selects an address
    if (formErrors.address) {
      setFormErrors(prev => ({ ...prev, address: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, profile_picture: "File size should be less than 5MB" }));
        return;
      }
      
      // Validate file type (only images)
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({ ...prev, profile_picture: "Only image files are allowed" }));
        return;
      }
      
      setProfilePicture(file);
      setFormErrors(prev => ({ ...prev, profile_picture: "" }));

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.full_name.trim()) {
      errors.full_name = "Full name is required";
    }
    
    if (!formData.phone_number.trim()) {
      errors.phone_number = "Phone number is required";
    } else if (!/^0\d{9}$/.test(formData.phone_number.trim())) {
      errors.phone_number = "Phone number must be 10 digits starting with 0";
    }
    
    if (!formData.address) {
      errors.address = "Address is required";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submission initiated");
    
    if (!validateForm()) {
      console.log("Form validation failed", formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Calling register with user data");
      await register({
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        address: formData.address,
        password: formData.password,
        profile_picture: profilePicture || undefined
      });
      
      console.log("Registration call completed successfully");
    } catch (error) {
      console.error("Error during registration submission:", error);
      // Error is handled in the register function via toast
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength indicators
  const getPasswordStrength = (password: string) => {
    if (password.length >= 8) return 'strong';
    if (password.length >= 6) return 'medium';
    if (password.length >= 4) return 'weak';
    if (password.length > 0) return 'very-weak';
    return 'none';
  };

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsDontMatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-doorrush-light to-background p-4">
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
                <Input 
                  id="full_name" 
                  name="full_name" 
                  placeholder="John Doe" 
                  value={formData.full_name} 
                  onChange={handleInputChange} 
                  className={formErrors.full_name ? "border-red-500" : ""}
                  required 
                />
                {formErrors.full_name && (
                  <p className="text-xs text-red-500">{formErrors.full_name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input 
                  id="phone_number" 
                  name="phone_number" 
                  type="tel" 
                  placeholder="07XX XXX XXX" 
                  value={formData.phone_number} 
                  onChange={handleInputChange} 
                  className={formErrors.phone_number ? "border-red-500" : ""}
                  required 
                />
                {formErrors.phone_number && (
                  <p className="text-xs text-red-500">{formErrors.phone_number}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Location (Eldoret)</Label>
                <Select 
                  onValueChange={handleAddressChange}
                  value={formData.address}
                >
                  <SelectTrigger className={formErrors.address ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent>
                    {ELDORET_LOCATIONS.map(location => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.address && (
                  <p className="text-xs text-red-500">{formErrors.address}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profile_picture">Profile Picture</Label>
                <div className="flex items-center gap-4">
                  {profilePreview && (
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img src={profilePreview} alt="Profile preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label htmlFor="profile_picture" className={`flex-1 cursor-pointer border border-input ${formErrors.profile_picture ? "border-red-500" : ""} bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm flex items-center gap-2`}>
                    <Upload size={16} />
                    {profilePicture ? 'Change photo' : 'Upload photo'}
                    <Input id="profile_picture" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
                {formErrors.profile_picture && (
                  <p className="text-xs text-red-500">{formErrors.profile_picture}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    required
                    className={`pr-10 ${formErrors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-xs text-red-500">{formErrors.password}</p>
                )}
                {formData.password && (
                  <div className="flex gap-1 mt-1">
                    <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${formData.password.length > 0 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${formData.password.length >= 4 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${formData.password.length >= 6 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={formData.confirmPassword} 
                    onChange={handleInputChange}
                    required
                    className={`pr-10 ${passwordsMatch ? 'border-green-500' : ''} ${passwordsDontMatch || formErrors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                    onClick={toggleShowConfirmPassword}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-xs text-red-500">{formErrors.confirmPassword}</p>
                )}
                {passwordsMatch && (
                  <p className="text-xs text-green-500 animate-fade-in">Passwords match</p>
                )}
                {passwordsDontMatch && (
                  <p className="text-xs text-red-500 animate-fade-in">Passwords don't match</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full bg-doorrush-primary hover:bg-doorrush-dark" 
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? "Creating account..." : "Create Account"}
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
    </div>
  );
};

export default Register;
