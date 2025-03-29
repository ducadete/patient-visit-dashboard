
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export type UserRole = "admin" | "professional";

type User = {
  username: string;
  role: UserRole;
  approved: boolean;
};

type PendingUser = {
  id: string;
  username: string;
  password: string;
  requestDate: Date;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  registerRequest: (username: string, password: string) => void;
  getPendingUsers: () => PendingUser[];
  approveUser: (id: string) => void;
  rejectUser: (id: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  
  // Check for existing user and pending users in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    const storedPendingUsers = localStorage.getItem("pendingUsers");
    if (storedPendingUsers) {
      setPendingUsers(JSON.parse(storedPendingUsers, (key, value) => {
        if (key === "requestDate") {
          return new Date(value);
        }
        return value;
      }));
    }
  }, []);
  
  // Save pending users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pendingUsers", JSON.stringify(pendingUsers));
  }, [pendingUsers]);

  const login = (username: string, password: string) => {
    // Main admin (hardcoded as requested)
    if (username === "VILADUTRA" && password === "Saude2025") {
      const userObj = { username, role: "admin" as UserRole, approved: true };
      setUser(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));
      toast.success("Login realizado com sucesso!");
      return true;
    } 
    
    // Check for approved professionals in localStorage
    const storedApprovedUsers = localStorage.getItem("approvedUsers");
    if (storedApprovedUsers) {
      const approvedUsers = JSON.parse(storedApprovedUsers);
      const foundUser = approvedUsers.find((u: any) => 
        u.username === username && u.password === password
      );
      
      if (foundUser) {
        const userObj = { 
          username: foundUser.username, 
          role: "professional" as UserRole, 
          approved: true 
        };
        setUser(userObj);
        localStorage.setItem("user", JSON.stringify(userObj));
        toast.success("Login realizado com sucesso!");
        return true;
      }
    }
    
    toast.error("Credenciais inválidas");
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Você foi desconectado");
  };
  
  const registerRequest = (username: string, password: string) => {
    // Check if username already exists in pending requests
    const existsInPending = pendingUsers.some(u => u.username === username);
    
    // Check if username already exists in approved users
    const storedApprovedUsers = localStorage.getItem("approvedUsers");
    const approvedUsers = storedApprovedUsers ? JSON.parse(storedApprovedUsers) : [];
    const existsInApproved = approvedUsers.some((u: any) => u.username === username);
    
    if (existsInPending || existsInApproved) {
      toast.error("Este nome de usuário já está em uso");
      return;
    }
    
    const newPendingUser = {
      id: crypto.randomUUID(),
      username,
      password,
      requestDate: new Date()
    };
    
    setPendingUsers(prev => [...prev, newPendingUser]);
    toast.success("Solicitação de cadastro enviada com sucesso! Aguarde aprovação.");
  };
  
  const getPendingUsers = () => pendingUsers;
  
  const approveUser = (id: string) => {
    const userToApprove = pendingUsers.find(u => u.id === id);
    if (!userToApprove) return;
    
    // Add to approved users
    const storedApprovedUsers = localStorage.getItem("approvedUsers");
    const approvedUsers = storedApprovedUsers ? JSON.parse(storedApprovedUsers) : [];
    
    approvedUsers.push({
      username: userToApprove.username,
      password: userToApprove.password
    });
    
    localStorage.setItem("approvedUsers", JSON.stringify(approvedUsers));
    
    // Remove from pending
    setPendingUsers(prev => prev.filter(u => u.id !== id));
    
    toast.success("Usuário aprovado com sucesso");
  };
  
  const rejectUser = (id: string) => {
    setPendingUsers(prev => prev.filter(u => u.id !== id));
    toast.success("Solicitação de cadastro rejeitada");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        registerRequest,
        getPendingUsers,
        approveUser,
        rejectUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
