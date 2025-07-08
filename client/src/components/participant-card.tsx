import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Mail } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ParticipantCardProps {
  user: any;
}

export default function ParticipantCard({ user }: ParticipantCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMeetingRequestMutation = useMutation({
    mutationFn: async (targetId: number) => {
      const response = await apiRequest("POST", "/api/meeting-requests", {
        eventId: 1, // Assuming event ID 1 for now
        targetId,
        requestedAt: new Date().toISOString(),
        message: "Gostaria de agendar uma reunião para discutir oportunidades de negócio",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meeting-requests"] });
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de reunião foi enviada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar solicitação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getUserTypeLabel = (userType: string) => {
    const types = {
      fabricante: "Fabricante",
      revendedor: "Revendedor",
      admin: "Administrador",
    };
    return types[userType as keyof typeof types] || userType;
  };

  const getUserTypeColor = (userType: string) => {
    const colors = {
      fabricante: "bg-blue-100 text-blue-800",
      revendedor: "bg-green-100 text-green-800",
      admin: "bg-purple-100 text-purple-800",
    };
    return colors[userType as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const handleScheduleMeeting = () => {
    createMeetingRequestMutation.mutate(user.id);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-medium">{user.name}</h4>
            <p className="text-sm text-muted-foreground">{user.company}</p>
            <Badge className={getUserTypeColor(user.userType)}>
              {getUserTypeLabel(user.userType)}
            </Badge>
          </div>
        </div>
        
        {user.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {user.description}
          </p>
        )}
        
        <div className="flex space-x-2">
          <Button
            className="flex-1"
            onClick={handleScheduleMeeting}
            disabled={createMeetingRequestMutation.isPending}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {createMeetingRequestMutation.isPending ? "Enviando..." : "Agendar"}
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
