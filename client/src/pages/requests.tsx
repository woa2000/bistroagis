import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Check, X } from "lucide-react";

export default function Requests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["/api/meeting-requests"],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, status, responseMessage }: { id: number; status: string; responseMessage?: string }) => {
      const response = await apiRequest("PUT", `/api/meeting-requests/${id}`, {
        status,
        responseMessage,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meeting-requests"] });
      toast({
        title: "Solicitação atualizada",
        description: "A solicitação foi processada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getUserById = (id: number) => {
    return users.find((user: any) => user.id === id);
  };

  const handleAccept = (requestId: number) => {
    updateRequestMutation.mutate({
      id: requestId,
      status: "approved",
      responseMessage: "Solicitação aceita",
    });
  };

  const handleReject = (requestId: number) => {
    updateRequestMutation.mutate({
      id: requestId,
      status: "rejected",
      responseMessage: "Solicitação recusada",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Aprovada", className: "bg-green-100 text-green-800" },
      rejected: { label: "Rejeitada", className: "bg-red-100 text-red-800" },
    };

    const config = statusMap[status as keyof typeof statusMap] || { label: status, className: "" };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const pendingRequests = requests.filter((request: any) => request.status === "pending");
  const processedRequests = requests.filter((request: any) => request.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Solicitações</h2>
        <p className="text-muted-foreground">Gerencie solicitações de reuniões</p>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Solicitações Pendentes
            <Badge variant="outline">{pendingRequests.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma solicitação pendente
            </p>
          ) : (
            <div className="divide-y">
              {pendingRequests.map((request: any) => {
                const requester = getUserById(request.requesterId);
                const requestedDate = new Date(request.requestedAt);
                
                return (
                  <div key={request.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-primary text-white">
                            {requester?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{requester?.name}</h4>
                          <p className="text-sm text-muted-foreground">{requester?.company}</p>
                          <p className="text-xs text-muted-foreground">
                            Solicitou reunião para {requestedDate.toLocaleDateString('pt-BR')} às {requestedDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {request.message && (
                            <p className="text-sm text-muted-foreground mt-1 italic">
                              "{request.message}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(request.id)}
                          disabled={updateRequestMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Aceitar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                          disabled={updateRequestMutation.isPending}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Recusar
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

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Solicitações Processadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {processedRequests.map((request: any) => {
                const requester = getUserById(request.requesterId);
                const requestedDate = new Date(request.requestedAt);
                
                return (
                  <div key={request.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-secondary text-white">
                            {requester?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{requester?.name}</h4>
                          <p className="text-sm text-muted-foreground">{requester?.company}</p>
                          <p className="text-xs text-muted-foreground">
                            Solicitou reunião para {requestedDate.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
