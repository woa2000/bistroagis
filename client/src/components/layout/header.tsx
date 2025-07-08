import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LogOut, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

export default function Header() {
  const { user } = useAuth();

  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      localStorage.removeItem("authToken");
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const getUserTypeLabel = (userType: string) => {
    const types = {
      fabricante: "Fabricante",
      revendedor: "Revendedor",
      admin: "Administrador",
    };
    return types[userType as keyof typeof types] || userType;
  };

  return (
    <header className="bg-white shadow-sm border-b border-border">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Calendar className="text-white text-lg" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-foreground">Agendamento B2B</h1>
              <p className="text-sm text-muted-foreground">Feira de Negócios 2024</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 px-1 py-0 text-xs min-w-[1.2rem] h-5 bg-destructive text-white">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-secondary text-white text-sm">
                  {getInitials(user?.name || "")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {getUserTypeLabel(user?.userType || "")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
