import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, Percent, Plus, Download, CalendarDays } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import StatsCard from "@/components/stats-card";
import MeetingCard from "@/components/meeting-card";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: meetings = [] } = useQuery({
    queryKey: ["/api/meetings"],
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const upcomingMeetings = meetings
    .filter((meeting: any) => new Date(meeting.scheduledAt) > new Date())
    .sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3);

  const unreadNotifications = notifications.filter((n: any) => !n.isRead).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Bem-vindo, {user?.name}! Aqui está sua visão geral das atividades.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Reuniões Agendadas"
          value={stats?.totalMeetings || 0}
          icon={Calendar}
          color="primary"
        />
        <StatsCard
          title="Reuniões Realizadas"
          value={stats?.completedMeetings || 0}
          icon={CheckCircle}
          color="success"
        />
        <StatsCard
          title="Pendentes"
          value={stats?.pendingMeetings || 0}
          icon={Clock}
          color="warning"
        />
        <StatsCard
          title="Taxa de Comparecimento"
          value={`${stats?.attendanceRate || 0}%`}
          icon={Percent}
          color="secondary"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Meetings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Próximas Reuniões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMeetings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhuma reunião agendada
                  </p>
                ) : (
                  upcomingMeetings.map((meeting: any) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Reunião
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver Agenda
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Dados
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unreadNotifications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma notificação
                  </p>
                ) : (
                  unreadNotifications.map((notification: any) => (
                    <div key={notification.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notification.type === 'error' ? 'bg-red-500' :
                        notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
