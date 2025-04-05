
export type Customer = {
  id: string;
  full_name: string;
  phone_number: string;
  address: string;
  profile_picture?: string;
  created_at: string;
};

export type RegisterData = {
  full_name: string;
  phone_number: string;
  address: string;
  profile_picture?: File;
  password: string;
};

export type AuthContextType = {
  customer: Customer | null;
  isLoading: boolean;
  authError: string | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
};
