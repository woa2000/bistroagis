import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface MeetingCardProps {
  meeting: any;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  const getUserById = (id: number) => {
    return users.find((user: any) => user.id === id);
  };

  const fabricante = getUserById(meeting.fabricanteId);
  const revendedor = getUserById(meeting.revendedorId);
  const participant = fabricante?.id === meeting.fabricanteId ? revendedor : fabricante;

  const getStatusBadge = (status: string) => {
    const statusMap = {
      confirmed: { label: "Confirmada", className: "status-confirmed" },
      pending: { label: "Pendente", className: "status-pending" },
      cancelled: { label: "Cancelada", className: "status-cancelled" },
      completed: { label: "Concluída", className: "status-completed" },
    };

    const config = statusMap[status as keyof typeof statusMap] || { label: status, className: "" };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let dateStr = "";
    if (date.toDateString() === today.toDateString()) {
      dateStr = "Hoje";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dateStr = "Amanhã";
    } else {
      dateStr = date.toLocaleDateString('pt-BR');
    }

    const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${dateStr}, ${timeStr}`;
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
      <div className="flex items-center space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-primary text-white">
            {getInitials(participant?.name || "")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{participant?.name}</p>
          <p className="text-xs text-muted-foreground">{participant?.company}</p>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(meeting.scheduledAt)} • {meeting.location || 'Local não definido'}
          </p>
        </div>
      </div>
      {getStatusBadge(meeting.status)}
    </div>
  );
}
