
-- Create the necessary types
CREATE TYPE professional_specialty AS ENUM (
  'Médico(a)',
  'Enfermeiro(a)',
  'Fisioterapeuta',
  'Nutricionista',
  'Psicólogo(a)',
  'Odontólogo(a)',
  'Outro'
);

-- Create the professionals table
CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty professional_specialty NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create the patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create the visits table
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id),
  visit_date DATE NOT NULL,
  subjective TEXT NOT NULL,
  objective TEXT NOT NULL,
  assessment TEXT NOT NULL,
  plan TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create the vital signs table
CREATE TABLE vital_signs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  temperature TEXT,
  heart_rate TEXT,
  respiratory_rate TEXT,
  blood_pressure TEXT,
  oxygen_saturation TEXT,
  weight TEXT,
  blood_glucose TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to access all rows
CREATE POLICY "Authenticated users can read professionals"
  ON professionals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert professionals"
  ON professionals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update professionals"
  ON professionals FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read patients"
  ON patients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert patients"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read visits"
  ON visits FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert visits"
  ON visits FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete visits"
  ON visits FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read vital signs"
  ON vital_signs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert vital signs"
  ON vital_signs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete vital signs"
  ON vital_signs FOR DELETE
  TO authenticated
  USING (true);
