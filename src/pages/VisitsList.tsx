
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, Search, Trash2 } from "lucide-react";
import { useVisits, Visit } from "@/contexts/VisitContext";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const VisitsList = () => {
  const { visits, deleteVisit } = useVisits();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  
  // Filter the visits based on search term and date filter
  const filteredVisits = visits.filter((visit) => {
    const matchesSearch = visit.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || 
      (visit.visitDate.getDate() === dateFilter.getDate() && 
       visit.visitDate.getMonth() === dateFilter.getMonth() && 
       visit.visitDate.getFullYear() === dateFilter.getFullYear());
    
    return matchesSearch && matchesDate;
  });
  
  // Sort visits by date (most recent first)
  const sortedVisits = [...filteredVisits].sort((a, b) => 
    b.visitDate.getTime() - a.visitDate.getTime()
  );
  
  const handlePatientClick = (visit: Visit) => {
    navigate(`/patient/${encodeURIComponent(visit.patientName)}`);
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter(undefined);
  };
  
  return (
    <Layout title="Visitas Realizadas">
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome do paciente"
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !dateFilter && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter ? (
                  format(dateFilter, "dd/MM/yyyy", { locale: ptBR })
                ) : (
                  <span>Filtrar por data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
                className="pointer-events-auto"
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
          
          {(searchTerm || dateFilter) && (
            <Button variant="ghost" onClick={clearFilters}>
              Limpar filtros
            </Button>
          )}
        </div>
      </div>
      
      {sortedVisits.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-2">Nenhuma visita encontrada</p>
          <p className="text-sm text-gray-400">
            {searchTerm || dateFilter 
              ? "Tente ajustar os filtros de busca" 
              : "Cadastre novas visitas para visualizá-las aqui"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedVisits.map((visit) => (
            <Card key={visit.id} className="overflow-hidden">
              <CardContent 
                className="p-0 cursor-pointer" 
                onClick={() => handlePatientClick(visit)}
              >
                <div className="p-4">
                  <div className="font-medium text-lg">{visit.patientName}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Data de nascimento: {format(visit.birthDate, "dd/MM/yyyy", { locale: ptBR })}
                  </div>
                  <div className="text-sm text-gray-500">
                    Idade: {visit.age} anos
                  </div>
                  <div className="mt-3 text-sm font-medium text-medical-secondary">
                    Data da visita: {format(visit.visitDate, "dd/MM/yyyy", { locale: ptBR })}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end p-2 bg-gray-50 border-t">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-medical-danger">
                      <Trash2 size={16} className="mr-1" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir visita</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir esta visita? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => deleteVisit(visit.id)}
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
      )}
    </Layout>
  );
};

export default VisitsList;
