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
