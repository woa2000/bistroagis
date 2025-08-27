import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarDays, Clock, MapPin, User, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface TimeSlot {
  time: string;
  hour: number;
  minute: number;
}

interface Meeting {
  id: number;
  eventId: number;
  fabricanteId: number;
  revendedorId: number;
  scheduledAt: string;
  duration: number;
  location?: string;
  status: string;
  notes?: string;
}

interface ScheduleData {
  date: string;
  timeSlots: TimeSlot[];
  fabricantes: any[];
  meetings: Meeting[];
  settings: {
    startTime: number;
    endTime: number;
    slotDuration: number;
  };
}

export default function Schedule() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: scheduleData, isLoading } = useQuery<ScheduleData>({
    queryKey: ["/api/schedule/daily", selectedDate],
    queryFn: async () => {
      const response = await fetch(`/api/schedule/daily?date=${selectedDate}`);
      if (!response.ok) throw new Error('Failed to fetch schedule');
      return response.json();
    },
  });

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ["/api/users"],
  });

  const getUserById = (id: number) => {
    return users.find((u: any) => u.id === id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getMeetingForSlot = (fabricanteId: number, timeSlot: TimeSlot) => {
    if (!scheduleData) return null;
    
    return scheduleData.meetings.find(meeting => {
      const meetingTime = new Date(meeting.scheduledAt);
      const slotTime = new Date(`${scheduleData.date}T${timeSlot.time}:00`);
      
      return meeting.fabricanteId === fabricanteId && 
             meetingTime.getTime() === slotTime.getTime();
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!scheduleData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Erro ao carregar agenda</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Agenda do Dia</h2>
        <p className="text-muted-foreground">
          Visualize os eventos agendados por fabricante
          {user?.userType !== 'admin' && ` - Modo ${user?.userType}`}
        </p>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            
            <div className="flex items-center space-x-4">
              <CalendarDays className="w-5 h-5 text-muted-foreground" />
              <div className="text-center">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-48"
                />
                <p className="text-sm text-muted-foreground mt-1 capitalize">
                  {formatDate(selectedDate)}
                </p>
              </div>
            </div>
            
            <Button variant="outline" onClick={() => navigateDate('next')}>
              Próximo
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Cronograma ({scheduleData.settings.startTime}h às {scheduleData.settings.endTime}h)
            </CardTitle>
            
            {/* Legend */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
                <span>Confirmada</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></div>
                <span>Pendente</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
                <span>Concluída</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded border-2 border-dashed border-gray-200 bg-gray-50"></div>
                <span>Disponível</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {scheduleData.fabricantes.length === 0 ? (
            <div className="text-center py-8">
              <Info className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {user?.userType === 'revendedor' 
                  ? "Você não possui reuniões agendadas para este dia."
                  : "Nenhum fabricante encontrado para exibir."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-max">
                {/* Header */}
                <div className="grid gap-2 mb-4" style={{ 
                  gridTemplateColumns: `100px repeat(${scheduleData.fabricantes.length}, minmax(250px, 1fr))` 
                }}>
                  <div className="font-medium text-center py-2">Horário</div>
                  {scheduleData.fabricantes.map((fabricante) => (
                    <div key={fabricante.id} className="bg-muted rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary text-white text-sm">
                            {fabricante.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{fabricante.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{fabricante.company}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="space-y-1">
                  {scheduleData.timeSlots.map((timeSlot) => (
                    <div key={timeSlot.time} className="grid gap-2" style={{ 
                      gridTemplateColumns: `100px repeat(${scheduleData.fabricantes.length}, minmax(250px, 1fr))` 
                    }}>
                      <div className="flex items-center justify-center py-3 text-sm font-medium text-muted-foreground border-r">
                        {timeSlot.time}
                      </div>
                      {scheduleData.fabricantes.map((fabricante) => {
                        const meeting = getMeetingForSlot(fabricante.id, timeSlot);
                        return (
                          <div key={fabricante.id} className="p-1">
                            {meeting ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className={`p-3 rounded-lg border-2 ${getStatusColor(meeting.status)} transition-all hover:shadow-md cursor-pointer`}>
                                    <div className="flex items-start justify-between mb-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {getStatusLabel(meeting.status)}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {meeting.duration}min
                                      </span>
                                    </div>
                                    
                                    {/* Participant Info */}
                                    {(() => {
                                      const participant = getUserById(
                                        meeting.fabricanteId === fabricante.id 
                                          ? meeting.revendedorId 
                                          : meeting.fabricanteId
                                      );
                                      return participant ? (
                                        <div className="mb-2">
                                          <div className="flex items-center space-x-2">
                                            <User className="w-3 h-3" />
                                            <span className="text-xs font-medium truncate">{participant.name}</span>
                                          </div>
                                          <p className="text-xs text-muted-foreground ml-5 truncate">
                                            {participant.company}
                                          </p>
                                        </div>
                                      ) : null;
                                    })()}
                                    
                                    {meeting.location && (
                                      <div className="flex items-center space-x-1 mb-1">
                                        <MapPin className="w-3 h-3" />
                                        <span className="text-xs truncate">{meeting.location}</span>
                                      </div>
                                    )}
                                    
                                    {meeting.notes && (
                                      <p className="text-xs text-muted-foreground italic truncate">
                                        {meeting.notes}
                                      </p>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <div className="space-y-2">
                                    <div className="font-medium">
                                      Reunião com {getUserById(meeting.fabricanteId === fabricante.id ? meeting.revendedorId : meeting.fabricanteId)?.name}
                                    </div>
                                    <div className="text-sm">
                                      <p><strong>Empresa:</strong> {getUserById(meeting.fabricanteId === fabricante.id ? meeting.revendedorId : meeting.fabricanteId)?.company}</p>
                                      <p><strong>Local:</strong> {meeting.location}</p>
                                      <p><strong>Status:</strong> {getStatusLabel(meeting.status)}</p>
                                      <p><strong>Duração:</strong> {meeting.duration} minutos</p>
                                      {meeting.notes && <p><strong>Observações:</strong> {meeting.notes}</p>}
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="p-3 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-center hover:bg-gray-100 transition-colors cursor-pointer">
                                    <span className="text-xs text-muted-foreground">Disponível</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>Slot disponível para agendamento</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {scheduleData.meetings.filter(m => m.status === 'confirmed').length}
              </div>
              <p className="text-sm text-muted-foreground">Confirmadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {scheduleData.meetings.filter(m => m.status === 'pending').length}
              </div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {scheduleData.meetings.filter(m => m.status === 'completed').length}
              </div>
              <p className="text-sm text-muted-foreground">Concluídas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {scheduleData.timeSlots.length * scheduleData.fabricantes.length - scheduleData.meetings.length}
              </div>
              <p className="text-sm text-muted-foreground">Slots Livres</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
