
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsersIcon, PlusCircle, Pencil, Trash2, Check, X, UserPlus } from "lucide-react";
import { useProfessionals, Professional } from "@/contexts/ProfessionalContext";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SystemManagement = () => {
  const { professionals, addProfessional, updateProfessional, deleteProfessional } = useProfessionals();
  const { isAdmin, getPendingUsers, approveUser, rejectUser } = useAuth();
  const pendingUsers = getPendingUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [currentProfessional, setCurrentProfessional] = useState<Professional | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    active: true
  });
  
  const filteredProfessionals = professionals.filter(pro => 
    pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pro.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const resetForm = () => {
    setFormData({
      name: "",
      specialty: "",
      active: true
    });
    setCurrentProfessional(null);
  };
  
  const handleOpenDialog = (professional?: Professional) => {
    if (professional) {
      setCurrentProfessional(professional);
      setFormData({
        name: professional.name,
        specialty: professional.specialty,
        active: professional.active
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.specialty) {
      return;
    }
    
    if (currentProfessional) {
      updateProfessional(currentProfessional.id, formData);
    } else {
      addProfessional(formData);
    }
    
    handleCloseDialog();
  };
  
  const handleDeleteClick = (professional: Professional) => {
    setCurrentProfessional(professional);
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDelete = () => {
    if (currentProfessional) {
      deleteProfessional(currentProfessional.id);
      setIsDeleteAlertOpen(false);
      setCurrentProfessional(null);
    }
  };
  
  return (
    <Layout title="Gerenciamento do Sistema">
      <Tabs defaultValue="professionals" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="professionals">
            <UsersIcon className="mr-2 h-4 w-4" />
            Profissionais
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="userrequests">
              <UserPlus className="mr-2 h-4 w-4" />
              Solicitações
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="professionals" className="mt-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <div className="w-full md:w-96">
              <Input
                placeholder="Buscar profissionais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Profissional
            </Button>
          </div>
          
          {filteredProfessionals.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500 mb-2">Nenhum profissional encontrado</p>
              <p className="text-sm text-gray-400">
                {searchTerm ? "Tente ajustar os termos de busca" : "Cadastre novos profissionais para visualizá-los aqui"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProfessionals.map(professional => (
                <Card key={professional.id} className={professional.active ? "" : "opacity-70"}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span className="truncate">{professional.name}</span>
                      {!professional.active && (
                        <span className="text-xs font-normal px-2 py-1 bg-gray-200 text-gray-700 rounded">
                          Inativo
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Especialidade: {professional.specialty}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(professional)}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteClick(professional)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="userrequests" className="mt-6">
            {pendingUsers.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500 mb-2">Nenhuma solicitação pendente</p>
                <p className="text-sm text-gray-400">
                  Novas solicitações aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pendingUsers.map(pendingUser => (
                  <Card key={pendingUser.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span className="truncate">{pendingUser.username}</span>
                        <span className="text-xs font-normal px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                          Pendente
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Solicitado em: {pendingUser.requestDate.toLocaleDateString()}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600" 
                        onClick={() => approveUser(pendingUser.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600" 
                        onClick={() => rejectUser(pendingUser.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rejeitar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
      
      {/* Professional Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentProfessional ? "Editar Profissional" : "Novo Profissional"}
            </DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {currentProfessional ? "editar o" : "cadastrar um novo"} profissional.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do profissional"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidade</Label>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                placeholder="Especialidade do profissional"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="active">Profissional Ativo</Label>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {currentProfessional ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Profissional</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {currentProfessional?.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default SystemManagement;
