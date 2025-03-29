
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useVisits } from "@/contexts/VisitContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PatientVisits = () => {
  const { patientName } = useParams<{ patientName: string }>();
  const { visits, deleteVisit } = useVisits();
  const navigate = useNavigate();
  
  // Filter visits for this patient
  const patientVisits = visits.filter(
    (visit) => visit.patientName === decodeURIComponent(patientName || "")
  );
  
  // Sort visits by date (most recent first)
  const sortedVisits = [...patientVisits].sort(
    (a, b) => b.visitDate.getTime() - a.visitDate.getTime()
  );
  
  // Get patient info from the first visit (should be the same for all)
  const patientInfo = sortedVisits[0];
  
  if (!patientInfo) {
    return (
      <Layout title="Paciente não encontrado">
        <div className="text-center">
          <p className="mb-4">Não foram encontradas visitas para este paciente.</p>
          <Button onClick={() => navigate("/visits")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a lista de visitas
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title={`Visitas de ${patientInfo.patientName}`}>
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/visits")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a lista de visitas
        </Button>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-500">Paciente</h3>
                <p className="text-lg">{patientInfo.patientName}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Data de Nascimento</h3>
                <p className="text-lg">
                  {format(patientInfo.birthDate, "dd/MM/yyyy", { locale: ptBR })} 
                  <span className="text-gray-500 ml-2">({patientInfo.age} anos)</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <h3 className="text-xl font-medium mb-4">Histórico de Visitas</h3>
        
        <div className="space-y-4">
          {sortedVisits.map((visit) => (
            <Card key={visit.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-medical-secondary">
                  Visita em {format(visit.visitDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="s">
                    <AccordionTrigger className="font-medium">
                      S - Subjetivo (Motivo da consulta / Queixa)
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                        {visit.subjective}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="o">
                    <AccordionTrigger className="font-medium">
                      O - Objetivo (Exames Físicos e Complementares)
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                        {visit.objective}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="a">
                    <AccordionTrigger className="font-medium">
                      A - Avaliação (Problema Detectado / Hipótese)
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                        {visit.assessment}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="p">
                    <AccordionTrigger className="font-medium">
                      P - Plano (Intervenção - Procedimento)
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                        {visit.plan}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              
              <CardFooter className="flex justify-end pt-2 pb-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-medical-danger">
                      <Trash2 size={16} className="mr-1" />
                      Excluir visita
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir visita</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir esta visita de {format(visit.visitDate, "dd/MM/yyyy")}? 
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          deleteVisit(visit.id);
                          if (sortedVisits.length === 1) {
                            navigate("/visits");
                          }
                        }}
                        className="bg-medical-danger hover:bg-red-600"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PatientVisits;
