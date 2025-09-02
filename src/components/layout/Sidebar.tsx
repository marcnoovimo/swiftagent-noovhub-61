import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

import { 
  BarChart3,
  Calendar, 
  Database,
  FileText, 
  Headphones, 
  Home, 
  Menu, 
  MessageSquare, 
  Settings,
  UserRound,
  MapPin,
  X
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const iconSize = 20;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Fermer le menu sur changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { name: 'Tableau de bord', path: '/', icon: <Home size={iconSize} /> },
    { name: 'Documents', path: '/documents', icon: <FileText size={iconSize} /> },
    { name: 'Contacts', path: '/contacts', icon: <UserRound size={iconSize} /> },
    { name: 'Equipe Noovimo', path: '/team', icon: <MapPin size={iconSize} /> },
    { name: 'Agenda', path: '/calendar', icon: <Calendar size={iconSize} /> },
    { name: 'Communication', path: '/messages', icon: <MessageSquare size={iconSize} /> },
    { name: 'Statistiques', path: '/stats', icon: <BarChart3 size={iconSize} /> },
    { name: 'Support', path: '/support', icon: <Headphones size={iconSize} /> },
    { name: 'Intégration Notion', path: '/notion-integration', icon: <Database size={iconSize} /> },
    { name: 'Paramètres', path: '/settings', icon: <Settings size={iconSize} /> },
  ];
  
  const MobileMenu = () => (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetContent side="left" className="w-64 p-0 z-50 bg-background">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <img 
                src="/lovable-uploads/95557113-347d-4013-8965-a832356ec898.png" 
                alt="Noovimo Logo" 
                className="h-8 w-auto"
              />
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold">Noov'Hub</span>
                <span className="text-xs text-muted-foreground">Votre couteau suisse digital</span>
              </div>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
              <X size={18} />
            </Button>
          </div>
          
          <div className="flex flex-col gap-1 p-2">
            {menuItems.map((item) => (
              <Button
                key={item.name}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                asChild
                className={cn(
                  "justify-start font-normal w-full",
                  location.pathname === item.path && "bg-noovimo-100 text-noovimo-700 hover:bg-noovimo-200 hover:text-noovimo-800"
                )}
              >
                <Link to={item.path} onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
          
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={user?.user_metadata?.full_name || "Agent"} />
                <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || "A"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.user_metadata?.full_name || "Agent Noovimo"}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden fixed top-4 left-4 z-40" 
        onClick={() => setIsMenuOpen(true)}
      >
        <Menu strokeWidth={1.5} />
      </Button>
      
      {MobileMenu()}

      <aside className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col w-64 border-r h-screen sticky top-0 overflow-y-auto animate-in fade-in-0 duration-75 bg-background`}>
        <div className="px-4 py-6 text-center border-b">
          <Link to="/" className="flex items-center justify-center gap-2 font-bold">
            <img 
              src="/lovable-uploads/95557113-347d-4013-8965-a832356ec898.png" 
              alt="Noovimo Logo" 
              className="h-8 w-auto"
            />
            <div className="flex flex-col items-start">
              <span className="text-xl">Noov'Hub</span>
              <span className="text-xs text-muted-foreground">Votre couteau suisse digital</span>
            </div>
          </Link>
        </div>
        
        <div className="flex flex-col gap-1 p-2">
          {menuItems.map((item) => (
            <Button
              key={item.name}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              asChild
              className={cn(
                "justify-start font-normal w-full",
                location.pathname === item.path && "bg-noovimo-100 text-noovimo-700 hover:bg-noovimo-200 hover:text-noovimo-800"
              )}
            >
              <Link to={item.path}>
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </Link>
            </Button>
          ))}
        </div>
        
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={user?.user_metadata?.full_name || "Agent"} />
              <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.user_metadata?.full_name || "Agent Noovimo"}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
