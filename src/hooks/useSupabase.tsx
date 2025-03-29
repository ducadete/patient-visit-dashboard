
import { useState } from 'react';
import { supabase, Professional, Patient, Visit, VitalSigns } from '@/lib/supabase';
import { toast } from 'sonner';

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  
  // Professional operations
  const fetchProfessionals = async (): Promise<Professional[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error(`Erro ao carregar profissionais: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const addProfessional = async (professional: Omit<Professional, 'id' | 'created_at'>): Promise<string | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('professionals')
        .insert([professional])
        .select();
        
      if (error) throw error;
      toast.success('Profissional cadastrado com sucesso!');
      return data?.[0]?.id || null;
    } catch (error: any) {
      toast.error(`Erro ao cadastrar profissional: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfessional = async (id: string, professional: Partial<Omit<Professional, 'id' | 'created_at'>>): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('professionals')
        .update(professional)
        .eq('id', id);
        
      if (error) throw error;
      toast.success('Profissional atualizado com sucesso!');
      return true;
    } catch (error: any) {
      toast.error(`Erro ao atualizar profissional: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Patient operations
  const fetchPatients = async (): Promise<Patient[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error(`Erro ao carregar pacientes: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const addPatient = async (patient: { name: string, birth_date: string }): Promise<string | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([patient])
        .select();
        
      if (error) throw error;
      toast.success('Paciente cadastrado com sucesso!');
      return data?.[0]?.id || null;
    } catch (error: any) {
      toast.error(`Erro ao cadastrar paciente: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Visit operations
  const fetchVisits = async (): Promise<Visit[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .order('visit_date', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error(`Erro ao carregar visitas: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const addVisit = async (
    visit: Omit<Visit, 'id' | 'created_at' | 'updated_at'>,
    vitalSigns: Omit<VitalSigns, 'id' | 'visit_id' | 'created_at'>
  ): Promise<string | null> => {
    setLoading(true);
    try {
      // Start a transaction by opening a connection
      const { data, error } = await supabase
        .from('visits')
        .insert([visit])
        .select();
        
      if (error) throw error;
      
      const visitId = data?.[0]?.id;
      if (visitId) {
        // Add vital signs with the visit ID
        const { error: vitalSignsError } = await supabase
          .from('vital_signs')
          .insert([{ ...vitalSigns, visit_id: visitId }]);
          
        if (vitalSignsError) throw vitalSignsError;
      }
      
      toast.success('Visita registrada com sucesso!');
      return visitId || null;
    } catch (error: any) {
      toast.error(`Erro ao registrar visita: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const fetchVisitsByPatient = async (patientId: string): Promise<Visit[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .eq('patient_id', patientId)
        .order('visit_date', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error(`Erro ao carregar visitas do paciente: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const fetchVisitDetails = async (visitId: string): Promise<{ visit: Visit | null, vitalSigns: VitalSigns | null }> => {
    setLoading(true);
    try {
      // Fetch visit data
      const { data: visitData, error: visitError } = await supabase
        .from('visits')
        .select('*')
        .eq('id', visitId)
        .single();
        
      if (visitError) throw visitError;
      
      // Fetch vital signs data
      const { data: vitalData, error: vitalError } = await supabase
        .from('vital_signs')
        .select('*')
        .eq('visit_id', visitId)
        .single();
        
      if (vitalError && vitalError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error, which is fine
        throw vitalError;
      }
      
      return { 
        visit: visitData || null, 
        vitalSigns: vitalData || null 
      };
    } catch (error: any) {
      toast.error(`Erro ao carregar detalhes da visita: ${error.message}`);
      return { visit: null, vitalSigns: null };
    } finally {
      setLoading(false);
    }
  };
  
  const deleteVisit = async (visitId: string): Promise<boolean> => {
    setLoading(true);
    try {
      // First delete associated vital signs (due to foreign key constraint)
      const { error: vitalError } = await supabase
        .from('vital_signs')
        .delete()
        .eq('visit_id', visitId);
        
      // If there's an error and it's not "no rows affected", handle it
      if (vitalError && vitalError.code !== 'PGRST116') {
        throw vitalError;
      }
      
      // Then delete the visit
      const { error } = await supabase
        .from('visits')
        .delete()
        .eq('id', visitId);
        
      if (error) throw error;
      
      toast.success('Visita excluída com sucesso!');
      return true;
    } catch (error: any) {
      toast.error(`Erro ao excluir visita: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return { 
    loading,
    fetchProfessionals,
    addProfessional,
    updateProfessional,
    fetchPatients,
    addPatient,
    fetchVisits,
    addVisit,
    fetchVisitsByPatient,
    fetchVisitDetails,
    deleteVisit
  };
};
