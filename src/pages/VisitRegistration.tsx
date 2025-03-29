
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useVisits } from "@/contexts/VisitContext";
import { useProfessionals } from "@/contexts/ProfessionalContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import DateInput from "@/components/DateInput";
import VitalSigns from "@/components/VitalSigns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const VisitRegistration = () => {
  const { addVisit } = useVisits();
  const { getActiveProfessionals } = useProfessionals();
  const [patientName, setPatientName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [visitDate, setVisitDate] = useState<Date>(new Date());
  const [professionalId, setProfessionalId] = useState("");
  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");
  
  // Vital signs state
  const [temperature, setTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [oxygenSaturation, setOxygenSaturation] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodGlucose, setBloodGlucose] = useState("");
  
  const activeProfessionals = getActiveProfessionals();
  
  // Calculate age from birth date
  const calculateAge = (birthDate: Date | undefined): number => {
    if (!birthDate) return 0;
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  const age = calculateAge(birthDate);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientName || !birthDate || !professionalId || !subjective || !objective || !assessment || !plan) {
      return;
    }
    
    // Find professional name by id
    const professional = activeProfessionals.find(p => p.id === professionalId);
    if (!professional) return;
    
    addVisit({
      patientName,
      birthDate,
      age,
      visitDate,
      professionalId,
      professionalName: professional.name,
      subjective,
      objective,
      assessment,
      plan,
      // Add vital signs
      temperature,
      heartRate,
      respiratoryRate,
      bloodPressure,
      oxygenSaturation,
      weight,
      bloodGlucose,
    });
    
    // Reset form
    setPatientName("");
    setBirthDate(undefined);
    setVisitDate(new Date());
    setProfessionalId("");
    setSubjective("");
    setObjective("");
    setAssessment("");
    setPlan("");
    setTemperature("");
    setHeartRate("");
    setRespiratoryRate("");
    setBloodPressure("");
    setOxygenSaturation("");
    setWeight("");
    setBloodGlucose("");
  };
  
  return (
    <Layout title="Cadastro de Visita">
      <div className="soap-container">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="soap-field">
              <Label htmlFor="patientName" className="soap-label">Usuário do Serviço</Label>
              <Input 
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="soap-input"
                placeholder="Nome completo do paciente"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="soap-field">
                <Label htmlFor="birthDate" className="soap-label">Data de Nascimento</Label>
                <DateInput
                  value={birthDate}
                  onChange={setBirthDate}
                  label="Data de Nascimento"
                  placeholder="DD/MM/AAAA"
                  disableFuture={true}
                />
              </div>
              
              <div className="soap-field">
                <Label htmlFor="age" className="soap-label">Idade</Label>
                <Input 
                  id="age"
                  value={birthDate ? age : ""}
                  readOnly
                  className="soap-input bg-gray-100"
                  placeholder="Calculado automaticamente"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="soap-field">
              <Label htmlFor="visitDate" className="soap-label">Data da Visita</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !visitDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {visitDate ? (
                      format(visitDate, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={visitDate}
                    onSelect={(date) => date && setVisitDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                    disabled={(date) => date > new Date()}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="soap-field">
              <Label htmlFor="professional" className="soap-label">Profissional</Label>
              <Select 
                value={professionalId} 
                onValueChange={setProfessionalId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o profissional" />
                </SelectTrigger>
                <SelectContent>
                  {activeProfessionals.length === 0 ? (
                    <SelectItem value="none" disabled>
                      Nenhum profissional cadastrado
                    </SelectItem>
                  ) : (
                    activeProfessionals.map((professional) => (
                      <SelectItem key={professional.id} value={professional.id}>
                        {professional.name} ({professional.specialty})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="soap-field">
            <Label htmlFor="subjective" className="soap-label">
              S - Subjetivo (Motivo da consulta / Queixa do Paciente / Entrevista Clínica)
            </Label>
            <Textarea 
              id="subjective"
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              className="soap-textarea"
              placeholder="Descreva os sintomas, queixas e informações relatadas pelo paciente"
              required
            />
          </div>
          
          <div className="soap-field">
            <Label htmlFor="objective" className="soap-label">
              O - Objetivo (Exames Físicos e Complementares)
            </Label>
            <Textarea 
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="soap-textarea"
              placeholder="Registre os achados clínicos, sinais vitais e resultados de exames"
              required
            />
          </div>
          
          <div className="soap-field">
            <Label htmlFor="assessment" className="soap-label">
              A - Avaliação (Problema Detectado / Hipótese Diagnóstica)
            </Label>
            <Textarea 
              id="assessment"
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              className="soap-textarea"
              placeholder="Indique diagnósticos, problemas identificados ou hipóteses"
              required
            />
          </div>
          
          <div className="soap-field">
            <Label htmlFor="plan" className="soap-label">
              P - Plano (Intervenção - Procedimento)
            </Label>
            <Textarea 
              id="plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="soap-textarea"
              placeholder="Descreva o tratamento, medicações, procedimentos ou encaminhamentos"
              required
            />
          </div>
          
          {/* Vital Signs Section */}
          <VitalSigns 
            temperature={temperature}
            setTemperature={setTemperature}
            heartRate={heartRate}
            setHeartRate={setHeartRate}
            respiratoryRate={respiratoryRate}
            setRespiratoryRate={setRespiratoryRate}
            bloodPressure={bloodPressure}
            setBloodPressure={setBloodPressure}
            oxygenSaturation={oxygenSaturation}
            setOxygenSaturation={setOxygenSaturation}
            weight={weight}
            setWeight={setWeight}
            bloodGlucose={bloodGlucose}
            setBloodGlucose={setBloodGlucose}
          />
          
          <div className="flex justify-end">
            <Button type="submit" className="soap-button">
              Salvar Visita
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default VisitRegistration;
