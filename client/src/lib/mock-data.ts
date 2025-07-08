// This file contains mock data generators for development
// In a production environment, this would be replaced with actual API calls

export const generateMockEvents = () => {
  return [
    {
      id: 1,
      name: "Feira de Negócios 2024",
      description: "Evento de networking B2B para fabricantes e revendedores",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: "Centro de Convenções São Paulo",
      slotDuration: 30,
      isActive: true,
    },
  ];
};

export const generateMockUsers = () => {
  return [
    {
      id: 1,
      email: "joao@industriaabc.com",
      name: "João Silva",
      company: "Indústria ABC",
      phone: "(11) 9999-9999",
      userType: "fabricante",
      description: "Fabricação de componentes eletrônicos para indústria automotiva",
      isActive: true,
    },
    {
      id: 2,
      email: "ana@distribuidoranorte.com",
      name: "Ana Beatriz Santos",
      company: "Distribuidora Norte Ltda.",
      phone: "(11) 8888-8888",
      userType: "revendedor",
      description: "Distribuição de produtos eletrônicos para o nordeste",
      isActive: true,
    },
    {
      id: 3,
      email: "carlos@varejoSul.com",
      name: "Carlos Santos",
      company: "Rede Varejo Sul",
      phone: "(11) 7777-7777",
      userType: "revendedor",
      description: "Rede de lojas de varejo no sul do país",
      isActive: true,
    },
    {
      id: 4,
      email: "marina@atacadocentro.com",
      name: "Marina Rodrigues",
      company: "Atacado Centro",
      phone: "(11) 6666-6666",
      userType: "revendedor",
      description: "Atacado de produtos diversos para o centro-oeste",
      isActive: true,
    },
    {
      id: 5,
      email: "admin@agis.com",
      name: "Administrador",
      company: "Agis Eventos",
      phone: "(11) 5555-5555",
      userType: "admin",
      description: "Administração da plataforma",
      isActive: true,
    },
  ];
};

export const generateMockMeetings = () => {
  return [
    {
      id: 1,
      eventId: 1,
      fabricanteId: 1,
      revendedorId: 2,
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      duration: 30,
      location: "Mesa 15",
      status: "confirmed",
      notes: "Discussão sobre novos produtos",
    },
    {
      id: 2,
      eventId: 1,
      fabricanteId: 1,
      revendedorId: 3,
      scheduledAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
      duration: 30,
      location: "Mesa 12",
      status: "pending",
      notes: "Negociação de preços",
    },
    {
      id: 3,
      eventId: 1,
      fabricanteId: 1,
      revendedorId: 4,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      duration: 30,
      location: "Mesa 8",
      status: "confirmed",
      notes: "Apresentação de linha de produtos",
    },
  ];
};
