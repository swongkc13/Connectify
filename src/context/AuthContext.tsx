import { getCurrentUser } from "@/lib/appwrite/api";
import { IUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const cookieFallback = localStorage.getItem('cookieFallback');
    // || cookieFallback === null
    if (cookieFallback === '[]') {
      navigate('/sign-in');
    } else {
      checkAuthUser(); // Call checkAuthUser if cookieFallback is not empty or null
    }
  }, []);

  const checkAuthUser = async (): Promise<boolean> => {
    try {
      const currentAccount = await getCurrentUser();
  
      if (currentAccount) {
        const userData = {
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio
        };
  
        setUser(userData);
        setIsAuthenticated(true);
  
        localStorage.setItem('user', JSON.stringify(userData));
  
        return true; // Return true if user is authenticated
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('user');
  
        return false; // Return false if user is not authenticated
      }
    } catch (error) {
      console.log(error);
      return false; // Return false if there's an error
    } finally {
      setIsLoading(false);
    }
  };
  

  const logout = () => {
    localStorage.removeItem('user');
    setUser(INITIAL_USER);
    setIsAuthenticated(false);
    navigate('/sign-in');
  };

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
