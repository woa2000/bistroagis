import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Filter } from "lucide-react";

export default function Meetings() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ["/api/meetings"],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  const getUserById = (id: number) => {
    return users.find((user: any) => user.id === id);
  };

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

  const filteredMeetings = meetings.filter((meeting: any) => {
    if (statusFilter !== "all" && meeting.status !== statusFilter) return false;
    if (dateFilter && !meeting.scheduledAt.includes(dateFilter)) return false;
    return true;
  });

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Minhas Reuniões</h2>
        <p className="text-muted-foreground">Gerencie suas reuniões agendadas</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="confirmed">Confirmada</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-48"
            />
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Meetings List */}
      <Card>
        <CardHeader>
          <CardTitle>Reuniões Agendadas</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMeetings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma reunião encontrada
            </p>
          ) : (
            <div className="divide-y">
              {filteredMeetings.map((meeting: any) => {
                const fabricante = getUserById(meeting.fabricanteId);
                const revendedor = getUserById(meeting.revendedorId);
                const participant = fabricante?.id === meeting.fabricanteId ? revendedor : fabricante;
                const { date, time } = formatDateTime(meeting.scheduledAt);
                
                return (
                  <div key={meeting.id} className="py-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-secondary text-white">
                            {participant?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{participant?.name}</h4>
                          <p className="text-sm text-muted-foreground">{participant?.company}</p>
                          <p className="text-xs text-muted-foreground">
                            {date} • {time} • {meeting.location || 'Local não definido'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(meeting.status)}
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
