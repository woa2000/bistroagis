import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Factory, Store, UserCog } from "lucide-react";
import { loginSchema, type LoginData } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [selectedUserType, setSelectedUserType] = useState<string>("");
  const { toast } = useToast();
  
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      window.location.reload();
    },
    onError: (error) => {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const userTypes = [
    { id: "fabricante", label: "Fabricante", icon: Factory },
    { id: "revendedor", label: "Revendedor", icon: Store },
    { id: "admin", label: "Admin", icon: UserCog },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-white text-2xl" />
          </div>
          <CardTitle className="text-2xl font-bold">Acesse sua conta</CardTitle>
          <CardDescription>Entre na plataforma de agendamento</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm">Lembrar-me</Label>
                </div>
                <Button variant="link" size="sm" className="text-primary">
                  Esqueceu a senha?
                </Button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Tipo de usuário:</p>
            <div className="flex gap-2">
              {userTypes.map((type) => (
                <Button
                  key={type.id}
                  variant="outline"
                  size="sm"
                  className={`flex-1 ${selectedUserType === type.id ? 'bg-accent' : ''}`}
                  onClick={() => setSelectedUserType(type.id)}
                >
                  <type.icon className="w-4 h-4 mr-1" />
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Contas de demonstração:</p>
            <p>Fabricante: joao@industriaabc.com / 123456</p>
            <p>Revendedor: ana@distribuidoranorte.com / 123456</p>
            <p>Admin: admin@agis.com / 123456</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
