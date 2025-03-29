
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

const Layout = ({ children, title }: LayoutProps) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-medical-secondary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestão de Visitas Médicas</h1>
          
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block">Olá, {user?.username}</span>
            <Button variant="outline" onClick={logout} className="text-black border-white hover:bg-medical-primary hover:text-white">
              Sair
            </Button>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-medical-primary text-white py-2">
        <div className="container mx-auto flex gap-4">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-md transition-colors ${location.pathname === '/' ? 'bg-white text-medical-primary font-medium' : 'hover:bg-white/10'}`}
          >
            Cadastrar Visita
          </Link>
          <Link 
            to="/visits" 
            className={`px-4 py-2 rounded-md transition-colors ${location.pathname === '/visits' ? 'bg-white text-medical-primary font-medium' : 'hover:bg-white/10'}`}
          >
            Visitas Realizadas
          </Link>
          <Link 
            to="/system" 
            className={`px-4 py-2 rounded-md transition-colors ${location.pathname === '/system' ? 'bg-white text-medical-primary font-medium' : 'hover:bg-white/10'}`}
          >
            <Settings className="inline-block mr-1 h-4 w-4" />
            Sistema
          </Link>
        </div>
      </nav>
      
      {/* Page content */}
      <main className="container mx-auto py-6 px-4">
        <h2 className="soap-header">{title}</h2>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-4 border-t">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Sistema de Gestão de Visitas Médicas - Todos os direitos reservados
        </div>
      </footer>
    </div>
  );
};

export default Layout;
