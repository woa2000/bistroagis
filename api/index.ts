import express from "express";
import { loginSchema, registerSchema } from "../shared/schema";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple session middleware for testing
const sessions = new Map<string, any>();

// Mock users for testing (no database required)
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

function getSession(req: any): any {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  return sessionId ? sessions.get(sessionId) : null;
}

function requireAuth(req: any, res: any, next: any) {
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = session.user;
  next();
}

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Auth routes
app.post("/api/auth/login", async (req, res) => {
  try {
    console.log("Login attempt:", req.body);
    
    const { email, password } = loginSchema.parse(req.body);
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    const sessionId = generateSessionId();
    sessions.set(sessionId, { user });
    
    console.log("Login successful for:", email);
    
    res.json({ 
      user: { ...user, password: undefined }, 
      token: sessionId 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ message: "Dados inválidos" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
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
    
    res.json({ 
      user: { ...newUser, password: undefined }, 
      token: sessionId 
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(400).json({ message: "Dados inválidos" });
  }
});

app.get("/api/auth/user", requireAuth, async (req: any, res) => {
  res.json({ ...req.user, password: undefined });
});

app.post("/api/auth/logout", requireAuth, async (req: any, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  if (sessionId) {
    sessions.delete(sessionId);
  }
  res.json({ message: "Logout realizado com sucesso" });
});

// Mock data routes
app.get("/api/users", requireAuth, async (req: any, res) => {
  const users = mockUsers.map(user => ({ ...user, password: undefined }));
  res.json(users);
});

app.get("/api/stats", requireAuth, async (req: any, res) => {
  res.json({
    totalMeetings: 5,
    confirmedMeetings: 3,
    completedMeetings: 2,
    pendingMeetings: 2,
    attendanceRate: 80
  });
});

app.get("/api/meetings", requireAuth, async (req: any, res) => {
  res.json([
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
});

app.get("/api/events", requireAuth, async (req: any, res) => {
  res.json([
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
});

export default app;
