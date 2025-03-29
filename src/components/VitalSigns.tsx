
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface VitalSignsProps {
  temperature: string;
  setTemperature: (value: string) => void;
  heartRate: string;
  setHeartRate: (value: string) => void;
  respiratoryRate: string;
  setRespiratoryRate: (value: string) => void;
  bloodPressure: string;
  setBloodPressure: (value: string) => void;
  oxygenSaturation: string;
  setOxygenSaturation: (value: string) => void;
  weight: string;
  setWeight: (value: string) => void;
  bloodGlucose: string;
  setBloodGlucose: (value: string) => void;
}

const VitalSigns: React.FC<VitalSignsProps> = ({
  temperature,
  setTemperature,
  heartRate,
  setHeartRate,
  respiratoryRate,
  setRespiratoryRate,
  bloodPressure,
  setBloodPressure,
  oxygenSaturation,
  setOxygenSaturation,
  weight,
  setWeight,
  bloodGlucose,
  setBloodGlucose,
}) => {
  return (
    <div className="soap-field">
      <Label className="soap-label font-bold text-lg">Sinais Vitais</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div>
          <Label htmlFor="temperature" className="soap-label">
            Temperatura corporal (°C)
          </Label>
          <Input
            id="temperature"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="Ex: 36.5"
            className="soap-input"
          />
        </div>
        <div>
          <Label htmlFor="heartRate" className="soap-label">
            Frequência cardíaca (bpm)
          </Label>
          <Input
            id="heartRate"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            placeholder="Ex: 80"
            className="soap-input"
          />
        </div>
        <div>
          <Label htmlFor="respiratoryRate" className="soap-label">
            Frequência respiratória (irpm)
          </Label>
          <Input
            id="respiratoryRate"
            value={respiratoryRate}
            onChange={(e) => setRespiratoryRate(e.target.value)}
            placeholder="Ex: 16"
            className="soap-input"
          />
        </div>
        <div>
          <Label htmlFor="bloodPressure" className="soap-label">
            Pressão arterial (mmHg)
          </Label>
          <Input
            id="bloodPressure"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            placeholder="Ex: 120/80"
            className="soap-input"
          />
        </div>
        <div>
          <Label htmlFor="oxygenSaturation" className="soap-label">
            Saturação de O₂ (%)
          </Label>
          <Input
            id="oxygenSaturation"
            value={oxygenSaturation}
            onChange={(e) => setOxygenSaturation(e.target.value)}
            placeholder="Ex: 98"
            className="soap-input"
          />
        </div>
        <div>
          <Label htmlFor="weight" className="soap-label">
            Peso (kg)
          </Label>
          <Input
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Ex: 70.5"
            className="soap-input"
          />
        </div>
        <div>
          <Label htmlFor="bloodGlucose" className="soap-label">
            Glicemia capilar (mg/dL)
          </Label>
          <Input
            id="bloodGlucose"
            value={bloodGlucose}
            onChange={(e) => setBloodGlucose(e.target.value)}
            placeholder="Ex: 100"
            className="soap-input"
          />
        </div>
      </div>
    </div>
  );
};

export default VitalSigns;
