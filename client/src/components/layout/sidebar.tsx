import { Link, useLocation } from "wouter";
import { Home, Calendar, Mail, Users, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export default function Sidebar() {
  const [location] = useLocation();

  const { data: requests = [] } = useQuery({
    queryKey: ["/api/meeting-requests/pending"],
  });

  const pendingCount = requests.length;

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Minhas Reuniões", href: "/meetings", icon: Calendar },
    { 
      name: "Solicitações", 
      href: "/requests", 
      icon: Mail,
      badge: pendingCount > 0 ? pendingCount : undefined
    },
    { name: "Participantes", href: "/participants", icon: Users },
    { name: "Relatórios", href: "/analytics", icon: BarChart3 },
    { name: "Perfil", href: "/profile", icon: User },
  ];

  return (
    <nav className="w-64 bg-white shadow-sm h-screen sticky top-0 hidden md:block">
      <div className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a
                    className={cn(
                      "nav-link flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                      isActive && "active"
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                    {item.badge && (
                      <Badge className="ml-auto bg-destructive text-white">
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
