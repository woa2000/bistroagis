import { Link, useLocation } from "wouter";
import { Home, Calendar, CalendarDays, Mail, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function MobileNav() {
  const [location] = useLocation();

  const { data: requests = [] } = useQuery<any[]>({
    queryKey: ["/api/meeting-requests/pending"],
  });

  const pendingCount = (requests as any[]).length;

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Agenda", href: "/schedule", icon: CalendarDays },
    { name: "Reuniões", href: "/meetings", icon: Calendar },
    { 
      name: "Solicitações", 
      href: "/requests", 
      icon: Mail,
      badge: pendingCount > 0
    },
    { name: "Participantes", href: "/participants", icon: Users },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-40">
      <div className="flex">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "nav-link-mobile flex-1 py-3 text-center transition-colors relative",
                  isActive && "active"
                )}
              >
                <div className="relative inline-flex flex-col items-center">
                  <item.icon className="w-5 h-5 mb-1" />
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                  )}
                </div>
                <span className="text-xs block">{item.name}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
