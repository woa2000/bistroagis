import express from "express";
import { storage } from "../server/storage";
import { loginSchema, registerSchema } from "../shared/schema";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple session middleware
const sessions = new Map<string, any>();

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

// Auth routes
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await storage.getUserByEmail(email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    const sessionId = generateSessionId();
    sessions.set(sessionId, { user });
    
    res.json({ 
      user: { ...user, password: undefined }, 
      token: sessionId 
    });
  } catch (error) {
    res.status(400).json({ message: "Dados inválidos" });
  }
});

app.post("/auth/register", async (req, res) => {
  try {
    const userData = registerSchema.parse(req.body);
    const existingUser = await storage.getUserByEmail(userData.email);
    
    if (existingUser) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    const user = await storage.createUser(userData);
    const sessionId = generateSessionId();
    sessions.set(sessionId, { user });
    
    res.json({ 
      user: { ...user, password: undefined }, 
      token: sessionId 
    });
  } catch (error) {
    res.status(400).json({ message: "Dados inválidos" });
  }
});

app.get("/auth/user", requireAuth, async (req: any, res) => {
  res.json({ ...req.user, password: undefined });
});

app.post("/auth/logout", requireAuth, async (req: any, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  if (sessionId) {
    sessions.delete(sessionId);
  }
  res.json({ message: "Logout realizado com sucesso" });
});

// User routes
app.get("/users", requireAuth, async (req: any, res) => {
  const users = await storage.getAllUsers();
  res.json(users.map(user => ({ ...user, password: undefined })));
});

app.get("/users/type/:type", requireAuth, async (req: any, res) => {
  const users = await storage.getUsersByType(req.params.type);
  res.json(users.map(user => ({ ...user, password: undefined })));
});

app.put("/users/:id", requireAuth, async (req: any, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updateData = req.body;
    
    if (req.user.id !== userId && req.user.userType !== 'admin') {
      return res.status(403).json({ message: "Acesso negado" });
    }

    const user = await storage.updateUser(userId, updateData);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json({ ...user, password: undefined });
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar usuário" });
  }
});

// Event routes
app.get("/events", requireAuth, async (req: any, res) => {
  const events = await storage.getActiveEvents();
  res.json(events);
});

app.post("/events", requireAuth, async (req: any, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: "Acesso negado" });
    }

    const event = await storage.createEvent(req.body);
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar evento" });
  }
});

// Meeting routes
app.get("/meetings", requireAuth, async (req: any, res) => {
  const meetings = await storage.getUserMeetings(req.user.id);
  res.json(meetings);
});

app.get("/meetings/all", requireAuth, async (req: any, res) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ message: "Acesso negado" });
  }
  const meetings = await storage.getAllMeetings();
  res.json(meetings);
});

app.post("/meetings", requireAuth, async (req: any, res) => {
  try {
    const meeting = await storage.createMeeting(req.body);
    res.json(meeting);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar reunião" });
  }
});

app.put("/meetings/:id", requireAuth, async (req: any, res) => {
  try {
    const meetingId = parseInt(req.params.id);
    const meeting = await storage.updateMeeting(meetingId, req.body);
    
    if (!meeting) {
      return res.status(404).json({ message: "Reunião não encontrada" });
    }

    res.json(meeting);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar reunião" });
  }
});

// Meeting Request routes
app.get("/meeting-requests", requireAuth, async (req: any, res) => {
  const requests = await storage.getUserMeetingRequests(req.user.id);
  res.json(requests);
});

app.get("/meeting-requests/pending", requireAuth, async (req: any, res) => {
  const requests = await storage.getPendingRequests(req.user.id);
  res.json(requests);
});

app.post("/meeting-requests", requireAuth, async (req: any, res) => {
  try {
    const request = await storage.createMeetingRequest({
      ...req.body,
      requesterId: req.user.id
    });
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar solicitação" });
  }
});

app.put("/meeting-requests/:id", requireAuth, async (req: any, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const request = await storage.updateMeetingRequest(requestId, req.body);
    
    if (!request) {
      return res.status(404).json({ message: "Solicitação não encontrada" });
    }

    res.json(request);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar solicitação" });
  }
});

// Notification routes
app.get("/notifications", requireAuth, async (req: any, res) => {
  const notifications = await storage.getUserNotifications(req.user.id);
  res.json(notifications);
});

app.post("/notifications", requireAuth, async (req: any, res) => {
  try {
    const notification = await storage.createNotification(req.body);
    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar notificação" });
  }
});

app.put("/notifications/:id/read", requireAuth, async (req: any, res) => {
  try {
    const notificationId = parseInt(req.params.id);
    await storage.markNotificationAsRead(notificationId);
    res.json({ message: "Notificação marcada como lida" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao marcar notificação" });
  }
});

// Stats routes
app.get("/stats", requireAuth, async (req: any, res) => {
  try {
    const meetings = await storage.getUserMeetings(req.user.id);
    const totalMeetings = meetings.length;
    const confirmedMeetings = meetings.filter(m => m.status === 'confirmed').length;
    const completedMeetings = meetings.filter(m => m.status === 'completed').length;
    const pendingMeetings = meetings.filter(m => m.status === 'pending').length;
    
    const attendanceRate = totalMeetings > 0 ? Math.round((completedMeetings / totalMeetings) * 100) : 0;

    res.json({
      totalMeetings,
      confirmedMeetings,
      completedMeetings,
      pendingMeetings,
      attendanceRate
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter estatísticas" });
  }
});

export default app;
