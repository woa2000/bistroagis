import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Handshake, Clock, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Analytics() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: meetings = [] } = useQuery({
    queryKey: ["/api/meetings"],
  });

  const { data: allMeetings = [] } = useQuery({
    queryKey: user?.userType === 'admin' ? ["/api/meetings/all"] : ["/api/meetings"],
  });

  const calculateMetrics = () => {
    const totalMeetings = allMeetings.length;
    const completedMeetings = allMeetings.filter((m: any) => m.status === 'completed').length;
    const confirmedMeetings = allMeetings.filter((m: any) => m.status === 'confirmed').length;
    const pendingMeetings = allMeetings.filter((m: any) => m.status === 'pending').length;

    const attendanceRate = totalMeetings > 0 ? Math.round((completedMeetings / totalMeetings) * 100) : 0;
    const confirmationRate = totalMeetings > 0 ? Math.round((confirmedMeetings / totalMeetings) * 100) : 0;
    
    // Calculate average meeting duration (assuming 30 minutes default)
    const avgDuration = allMeetings.length > 0 ? 
      allMeetings.reduce((sum: number, meeting: any) => sum + (meeting.duration || 30), 0) / allMeetings.length : 0;

    return {
      totalMeetings,
      completedMeetings,
      confirmedMeetings,
      pendingMeetings,
      attendanceRate,
      confirmationRate,
      avgDuration: Math.round(avgDuration),
    };
  };

  const metrics = calculateMetrics();

  const analyticsCards = [
    {
      title: "Taxa de Comparecimento",
      value: `${metrics.attendanceRate}%`,
      icon: TrendingUp,
      change: "+5%",
      changeType: "positive" as const,
      description: "vs. último evento",
    },
    {
      title: "Reuniões Realizadas",
      value: metrics.totalMeetings,
      icon: Handshake,
      change: "+12%",
      changeType: "positive" as const,
      description: "vs. último evento",
    },
    {
      title: "Tempo Médio",
      value: `${metrics.avgDuration}min`,
      icon: Clock,
      change: "",
      changeType: "neutral" as const,
      description: "Por reunião",
    },
    {
      title: "Taxa de Confirmação",
      value: `${metrics.confirmationRate}%`,
      icon: Users,
      change: "+8%",
      changeType: "positive" as const,
      description: "vs. último evento",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Relatórios</h2>
        <p className="text-muted-foreground">Analise métricas e performance do evento</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">{card.title}</h3>
                <card.icon className={`w-5 h-5 ${
                  card.changeType === 'positive' ? 'text-green-600' : 
                  card.changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'
                }`} />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{card.value}</div>
              <div className="flex items-center gap-2">
                {card.change && (
                  <Badge 
                    variant="outline" 
                    className={
                      card.changeType === 'positive' ? 'text-green-600 border-green-600' :
                      card.changeType === 'negative' ? 'text-red-600 border-red-600' : ''
                    }
                  >
                    {card.changeType === 'positive' && <TrendingUp className="w-3 h-3 mr-1" />}
                    {card.changeType === 'negative' && <TrendingDown className="w-3 h-3 mr-1" />}
                    {card.change}
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">{card.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Concluídas</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(metrics.completedMeetings / metrics.totalMeetings) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{metrics.completedMeetings}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Confirmadas</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(metrics.confirmedMeetings / metrics.totalMeetings) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{metrics.confirmedMeetings}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pendentes</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(metrics.pendingMeetings / metrics.totalMeetings) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{metrics.pendingMeetings}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total de Reuniões</span>
                <span className="text-2xl font-bold">{metrics.totalMeetings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Taxa de Sucesso</span>
                <span className="text-2xl font-bold text-green-600">{metrics.attendanceRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Duração Média</span>
                <span className="text-2xl font-bold">{metrics.avgDuration}min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Confirmações</span>
                <span className="text-2xl font-bold text-blue-600">{metrics.confirmationRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Reuniões por Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-muted-foreground mb-4">📊</div>
              <p className="text-muted-foreground">
                Gráfico de reuniões por período será implementado aqui
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Visualização interativa dos dados históricos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
