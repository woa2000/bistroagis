import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple JSON schemas for validation
const loginSchema = {
  parse: (data: any) => {
    if (!data.email || !data.password) {
      throw new Error('Email e senha são obrigatórios');
    }
    return { email: data.email, password: data.password };
  }
};

const registerSchema = {
  parse: (data: any) => {
    if (!data.email || !data.password || !data.name || !data.userType) {
      throw new Error('Email, senha, nome e tipo de usuário são obrigatórios');
    }
    return data;
  }
};

// Simple session storage (in-memory for testing)
const sessions = new Map<string, any>();

// Mock users for testing
const mockUsers = [
  {
    id: 1,
    email: "admin@agis.com",
    password: "123456",
    name: "Administrador",
    company: "Agis Eventos",
    phone: "(11) 5555-5555",
    userType: "admin",
    description: "Administração da plataforma",
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 2,
    email: "joao@industriaabc.com",
    password: "123456",
    name: "João Silva",
    company: "Indústria ABC",
    phone: "(11) 9999-9999",
    userType: "fabricante",
    description: "Fabricação de componentes eletrônicos",
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 3,
    email: "maria@techsolutions.com",
    password: "123456",
    name: "Maria Santos",
    company: "Tech Solutions",
    phone: "(11) 8888-8888",
    userType: "fabricante",
    description: "Soluções tecnológicas inovadoras",
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 4,
    email: "pedro@innovacorp.com",
    password: "123456",
    name: "Pedro Oliveira",
    company: "InovaCorp",
    phone: "(11) 7777-7777",
    userType: "fabricante",
    description: "Inovação em produtos industriais",
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 5,
    email: "ana@distribuicoes.com",
    password: "123456",
    name: "Ana Costa",
    company: "Distribuições Costa",
    phone: "(11) 6666-6666",
    userType: "revendedor",
    description: "Distribuição de produtos eletrônicos",
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 6,
    email: "carlos@megavendas.com",
    password: "123456",
    name: "Carlos Souza",
    company: "Mega Vendas",
    phone: "(11) 5555-4444",
    userType: "revendedor",
    description: "Revenda especializada em tecnologia",
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 7,
    email: "lucia@comercialsp.com",
    password: "123456",
    name: "Lúcia Ferreira",
    company: "Comercial SP",
    phone: "(11) 4444-3333",
    userType: "revendedor",
    description: "Comércio atacadista",
    isActive: true,
    createdAt: new Date()
  }
];

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getSession(req: VercelRequest): any {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const sessionId = authHeader.toString().replace('Bearer ', '');
  return sessions.get(sessionId);
}

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  setCorsHeaders(res);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log(`API Request: ${req.method} ${req.url}`);

  try {
    const path = req.url?.replace('/api', '') || '';
    
    // Health check
    if (path === '/health' && req.method === 'GET') {
      return res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
      });
    }

    // Login
    if (path === '/auth/login' && req.method === 'POST') {
      console.log("Login attempt:", req.body);
      
      const { email, password } = loginSchema.parse(req.body);
      const user = mockUsers.find(u => u.email === email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }

      const sessionId = generateSessionId();
      sessions.set(sessionId, { user });
      
      console.log("Login successful for:", email);
      
      return res.status(200).json({ 
        user: { ...user, password: undefined }, 
        token: sessionId 
      });
    }

    // Register
    if (path === '/auth/register' && req.method === 'POST') {
      const userData = registerSchema.parse(req.body);
      const existingUser = mockUsers.find(u => u.email === userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      const newUser = {
        id: mockUsers.length + 1,
        email: userData.email,
        password: userData.password,
        name: userData.name,
        company: userData.company || "Empresa não informada",
        phone: userData.phone || "(00) 0000-0000",
        userType: userData.userType,
        description: userData.description || "Descrição não informada",
        isActive: true,
        createdAt: new Date()
      };
      
      mockUsers.push(newUser);
      
      const sessionId = generateSessionId();
      sessions.set(sessionId, { user: newUser });
      
      return res.status(200).json({ 
        user: { ...newUser, password: undefined }, 
        token: sessionId 
      });
    }

    // Protected routes require authentication
    const session = getSession(req);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get user info
    if (path === '/auth/user' && req.method === 'GET') {
      return res.status(200).json({ ...session.user, password: undefined });
    }

    // Logout
    if (path === '/auth/logout' && req.method === 'POST') {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const sessionId = authHeader.toString().replace('Bearer ', '');
        sessions.delete(sessionId);
      }
      return res.status(200).json({ message: "Logout realizado com sucesso" });
    }

    // Get users
    if (path === '/users' && req.method === 'GET') {
      const users = mockUsers.map(user => ({ ...user, password: undefined }));
      return res.status(200).json(users);
    }

    // Get stats
    if (path === '/stats' && req.method === 'GET') {
      return res.status(200).json({
        totalMeetings: 5,
        confirmedMeetings: 3,
        completedMeetings: 2,
        pendingMeetings: 2,
        attendanceRate: 80
      });
    }

    // Get meetings
    if (path === '/meetings' && req.method === 'GET') {
      return res.status(200).json([
        {
          id: 1,
          eventId: 1,
          fabricanteId: 1,
          revendedorId: 2,
          scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
          duration: 30,
          location: "Mesa 15",
          status: "confirmed",
          notes: "Discussão sobre novos produtos"
        }
      ]);
    }

    // Get daily schedule
    if (path === '/schedule/daily' && req.method === 'GET') {
      const selectedDate = req.query.date || new Date().toISOString().split('T')[0];
      const currentUser = session.user;
      
      // Generate mock schedule data
      const startTime = 8; // 8 AM
      const endTime = 18; // 6 PM
      const slotDuration = 30; // 30 minutes
      const totalSlots = (endTime - startTime) * (60 / slotDuration);
      
      // Get fabricantes
      const fabricantes = mockUsers.filter(u => u.userType === 'fabricante');
      const revendedores = mockUsers.filter(u => u.userType === 'revendedor');
      
      // Generate mock meetings for the day
      const mockDailyMeetings: any[] = [];
      
      // Create a more realistic schedule with some patterns
      fabricantes.forEach((fabricante, fabricanteIndex) => {
        // Each fabricante gets 2-4 meetings per day
        const meetingsCount = 2 + Math.floor(Math.random() * 3);
        const usedSlots = new Set();
        
        for (let i = 0; i < meetingsCount; i++) {
          let slotIndex;
          let attempts = 0;
          // Try to find an available slot (avoid conflicts)
          do {
            slotIndex = Math.floor(Math.random() * totalSlots);
            attempts++;
          } while (usedSlots.has(slotIndex) && attempts < 10);
          
          if (attempts < 10) {
            usedSlots.add(slotIndex);
            
            const hour = Math.floor(startTime + (slotIndex * slotDuration) / 60);
            const minute = (slotIndex * slotDuration) % 60;
            const meetingTime = new Date(`${selectedDate}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);
            
            const revendedor = revendedores[Math.floor(Math.random() * revendedores.length)];
            const statuses = ['confirmed', 'pending', 'completed'];
            const statusWeights = [0.5, 0.3, 0.2]; // More confirmed meetings
            
            let status = 'confirmed';
            const random = Math.random();
            if (random < statusWeights[2]) status = 'completed';
            else if (random < statusWeights[1] + statusWeights[2]) status = 'pending';
            
            mockDailyMeetings.push({
              id: mockDailyMeetings.length + 1,
              eventId: 1,
              fabricanteId: fabricante.id,
              revendedorId: revendedor.id,
              scheduledAt: meetingTime,
              duration: slotDuration,
              location: `Mesa ${fabricanteIndex + 1}${String.fromCharCode(65 + i)}`,
              status: status,
              notes: `Reunião sobre ${['produtos', 'parcerias', 'novos negócios', 'expansão'][Math.floor(Math.random() * 4)]}`
            });
          }
        }
      });
      
      // Sort meetings by time
      mockDailyMeetings.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
      
      // Filter meetings based on user type
      let filteredMeetings = mockDailyMeetings;
      let visibleFabricantes = fabricantes;
      
      if (currentUser.userType === 'fabricante') {
        filteredMeetings = mockDailyMeetings.filter(m => m.fabricanteId === currentUser.id);
        visibleFabricantes = fabricantes.filter(f => f.id === currentUser.id);
      } else if (currentUser.userType === 'revendedor') {
        filteredMeetings = mockDailyMeetings.filter(m => m.revendedorId === currentUser.id);
        // For revendedores, show fabricantes they have meetings with
        const fabricanteIds = new Set(filteredMeetings.map(m => m.fabricanteId));
        visibleFabricantes = fabricantes.filter(f => fabricanteIds.has(f.id));
      }
      
      // Generate time slots
      const timeSlots: any[] = [];
      for (let i = 0; i < totalSlots; i++) {
        const hour = Math.floor(startTime + (i * slotDuration) / 60);
        const minute = (i * slotDuration) % 60;
        timeSlots.push({
          time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
          hour,
          minute
        });
      }
      
      return res.status(200).json({
        date: selectedDate,
        timeSlots,
        fabricantes: visibleFabricantes,
        meetings: filteredMeetings,
        settings: {
          startTime,
          endTime,
          slotDuration
        }
      });
    }

    // Get events
    if (path === '/events' && req.method === 'GET') {
      return res.status(200).json([
        {
          id: 1,
          name: "Feira de Negócios 2024",
          description: "Evento de networking B2B",
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          location: "Centro de Convenções São Paulo",
          isActive: true
        }
      ]);
    }

    // Route not found
    return res.status(404).json({ message: `Route not found: ${req.method} ${path}` });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    });
  }
}
