
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export type Professional = {
  id: string;
  name: string;
  specialty: string;
  active: boolean;
};

type ProfessionalContextType = {
  professionals: Professional[];
  addProfessional: (professional: Omit<Professional, "id">) => void;
  updateProfessional: (id: string, professional: Omit<Professional, "id">) => void;
  deleteProfessional: (id: string) => void;
  getProfessionals: () => Professional[];
  getActiveProfessionals: () => Professional[];
};

const ProfessionalContext = createContext<ProfessionalContextType | undefined>(undefined);

export const ProfessionalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  // Load professionals from localStorage on initial load
  useEffect(() => {
    const storedProfessionals = localStorage.getItem("professionals");
    if (storedProfessionals) {
      setProfessionals(JSON.parse(storedProfessionals));
    }
  }, []);

  // Save professionals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("professionals", JSON.stringify(professionals));
  }, [professionals]);

  const addProfessional = (professional: Omit<Professional, "id">) => {
    const newProfessional = {
      ...professional,
      id: crypto.randomUUID(),
    };
    setProfessionals((prev) => [...prev, newProfessional]);
    toast.success("Profissional cadastrado com sucesso!");
  };

  const updateProfessional = (id: string, professional: Omit<Professional, "id">) => {
    setProfessionals((prev) =>
      prev.map((p) => (p.id === id ? { ...professional, id } : p))
    );
    toast.success("Profissional atualizado com sucesso!");
  };

  const deleteProfessional = (id: string) => {
    setProfessionals((prev) => prev.filter((professional) => professional.id !== id));
    toast.success("Profissional excluído com sucesso!");
  };

  const getProfessionals = () => professionals;
  
  const getActiveProfessionals = () => professionals.filter(p => p.active);

  return (
    <ProfessionalContext.Provider
      value={{ 
        professionals, 
        addProfessional, 
        updateProfessional, 
        deleteProfessional, 
        getProfessionals,
        getActiveProfessionals
      }}
    >
      {children}
    </ProfessionalContext.Provider>
  );
};

export const useProfessionals = () => {
  const context = useContext(ProfessionalContext);
  if (context === undefined) {
    throw new Error("useProfessionals must be used within a ProfessionalProvider");
  }
  return context;
};
