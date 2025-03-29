
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export type Visit = {
  id: string;
  patientName: string;
  birthDate: Date;
  age: number;
  visitDate: Date;
  subjective: string; // Motivo da consulta / Queixa / Entrevista
  objective: string; // Exames Físicos e Complementares
  assessment: string; // Avaliação / Problema / Hipótese
  plan: string; // Plano / Intervenção / Procedimento
};

type VisitContextType = {
  visits: Visit[];
  addVisit: (visit: Omit<Visit, "id">) => void;
  deleteVisit: (id: string) => void;
  getVisitsByPatient: (patientName: string) => Visit[];
  getPatients: () => { name: string; birthDate: Date; visits: number }[];
};

const VisitContext = createContext<VisitContextType | undefined>(undefined);

export const VisitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visits, setVisits] = useState<Visit[]>([]);

  // Load visits from localStorage on initial load
  useEffect(() => {
    const storedVisits = localStorage.getItem("visits");
    if (storedVisits) {
      // Convert date strings back to Date objects
      const parsedVisits = JSON.parse(storedVisits, (key, value) => {
        if (key === "birthDate" || key === "visitDate") {
          return new Date(value);
        }
        return value;
      });
      setVisits(parsedVisits);
    }
  }, []);

  // Save visits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("visits", JSON.stringify(visits));
  }, [visits]);

  const addVisit = (visit: Omit<Visit, "id">) => {
    const newVisit = {
      ...visit,
      id: crypto.randomUUID(),
    };
    setVisits((prev) => [...prev, newVisit]);
    toast.success("Visita registrada com sucesso!");
  };

  const deleteVisit = (id: string) => {
    setVisits((prev) => prev.filter((visit) => visit.id !== id));
    toast.success("Visita excluída com sucesso!");
  };

  const getVisitsByPatient = (patientName: string) => {
    return visits.filter(
      (visit) => visit.patientName.toLowerCase().includes(patientName.toLowerCase())
    );
  };

  const getPatients = () => {
    const patientsMap = new Map<string, { name: string; birthDate: Date; visits: number }>();

    visits.forEach((visit) => {
      const key = `${visit.patientName}-${visit.birthDate.toISOString()}`;
      if (patientsMap.has(key)) {
        const current = patientsMap.get(key)!;
        patientsMap.set(key, { ...current, visits: current.visits + 1 });
      } else {
        patientsMap.set(key, {
          name: visit.patientName,
          birthDate: visit.birthDate,
          visits: 1,
        });
      }
    });

    return Array.from(patientsMap.values());
  };

  return (
    <VisitContext.Provider
      value={{ visits, addVisit, deleteVisit, getVisitsByPatient, getPatients }}
    >
      {children}
    </VisitContext.Provider>
  );
};

export const useVisits = () => {
  const context = useContext(VisitContext);
  if (context === undefined) {
    throw new Error("useVisits must be used within a VisitProvider");
  }
  return context;
};
