import { 
  users, events, meetings, meetingRequests, notifications,
  type User, type InsertUser, type Event, type InsertEvent, 
  type Meeting, type InsertMeeting, type MeetingRequest, 
  type InsertMeetingRequest, type Notification, type InsertNotification 
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUsersByType(userType: string): Promise<User[]>;

  // Events
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  getAllEvents(): Promise<Event[]>;
  getActiveEvents(): Promise<Event[]>;

  // Meetings
  getMeeting(id: number): Promise<Meeting | undefined>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  updateMeeting(id: number, meeting: Partial<InsertMeeting>): Promise<Meeting | undefined>;
  getUserMeetings(userId: number): Promise<Meeting[]>;
  getEventMeetings(eventId: number): Promise<Meeting[]>;
  getAllMeetings(): Promise<Meeting[]>;

  // Meeting Requests
  getMeetingRequest(id: number): Promise<MeetingRequest | undefined>;
  createMeetingRequest(request: InsertMeetingRequest): Promise<MeetingRequest>;
  updateMeetingRequest(id: number, request: Partial<InsertMeetingRequest>): Promise<MeetingRequest | undefined>;
  getUserMeetingRequests(userId: number): Promise<MeetingRequest[]>;
  getPendingRequests(userId: number): Promise<MeetingRequest[]>;

  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private events: Map<number, Event> = new Map();
  private meetings: Map<number, Meeting> = new Map();
  private meetingRequests: Map<number, MeetingRequest> = new Map();
  private notifications: Map<number, Notification> = new Map();
  
  private currentUserId = 1;
  private currentEventId = 1;
  private currentMeetingId = 1;
  private currentRequestId = 1;
  private currentNotificationId = 1;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create mock users
    const mockUsers: InsertUser[] = [
      {
        email: "joao@industriaabc.com",
        password: "123456",
        name: "João Silva",
        company: "Indústria ABC",
        phone: "(11) 9999-9999",
        userType: "fabricante",
        description: "Fabricação de componentes eletrônicos para indústria automotiva",
        isActive: true,
      },
      {
        email: "ana@distribuidoranorte.com",
        password: "123456",
        name: "Ana Beatriz Santos",
        company: "Distribuidora Norte Ltda.",
        phone: "(11) 8888-8888",
        userType: "revendedor",
        description: "Distribuição de produtos eletrônicos para o nordeste",
        isActive: true,
      },
      {
        email: "carlos@varejoSul.com",
        password: "123456",
        name: "Carlos Santos",
        company: "Rede Varejo Sul",
        phone: "(11) 7777-7777",
        userType: "revendedor",
        description: "Rede de lojas de varejo no sul do país",
        isActive: true,
      },
      {
        email: "marina@atacadocentro.com",
        password: "123456",
        name: "Marina Rodrigues",
        company: "Atacado Centro",
        phone: "(11) 6666-6666",
        userType: "revendedor",
        description: "Atacado de produtos diversos para o centro-oeste",
        isActive: true,
      },
      {
        email: "admin@agis.com",
        password: "123456",
        name: "Administrador",
        company: "Agis Eventos",
        phone: "(11) 5555-5555",
        userType: "admin",
        description: "Administração da plataforma",
        isActive: true,
      },
    ];

    mockUsers.forEach(user => {
      const id = this.currentUserId++;
      this.users.set(id, { ...user, id, createdAt: new Date() });
    });

    // Create mock event
    const mockEvent: InsertEvent = {
      name: "Feira de Negócios 2024",
      description: "Evento de networking B2B para fabricantes e revendedores",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      location: "Centro de Convenções São Paulo",
      slotDuration: 30,
      isActive: true,
    };

    const eventId = this.currentEventId++;
    this.events.set(eventId, { ...mockEvent, id: eventId, createdAt: new Date() });

    // Create mock meetings
    const mockMeetings: InsertMeeting[] = [
      {
        eventId: 1,
        fabricanteId: 1,
        revendedorId: 2,
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: 30,
        location: "Mesa 15",
        status: "confirmed",
        notes: "Discussão sobre novos produtos",
      },
      {
        eventId: 1,
        fabricanteId: 1,
        revendedorId: 3,
        scheduledAt: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
        duration: 30,
        location: "Mesa 12",
        status: "pending",
        notes: "Negociação de preços",
      },
      {
        eventId: 1,
        fabricanteId: 1,
        revendedorId: 4,
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
        duration: 30,
        location: "Mesa 8",
        status: "confirmed",
        notes: "Apresentação de linha de produtos",
      },
    ];

    mockMeetings.forEach(meeting => {
      const id = this.currentMeetingId++;
      this.meetings.set(id, { ...meeting, id, createdAt: new Date(), updatedAt: new Date() });
    });

    // Create mock meeting requests
    const mockRequests: InsertMeetingRequest[] = [
      {
        eventId: 1,
        requesterId: 4,
        targetId: 1,
        requestedAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        message: "Gostaria de agendar uma reunião para discutir oportunidades de parceria",
        status: "pending",
      },
    ];

    mockRequests.forEach(request => {
      const id = this.currentRequestId++;
      this.meetingRequests.set(id, { ...request, id, createdAt: new Date(), updatedAt: new Date() });
    });

    // Create mock notifications
    const mockNotifications: InsertNotification[] = [
      {
        userId: 1,
        title: "Conflito de horário detectado",
        message: "Existe um conflito entre suas reuniões agendadas",
        type: "warning",
        isRead: false,
      },
      {
        userId: 1,
        title: "Reunião confirmada",
        message: "Sua reunião com Ana Beatriz foi confirmada",
        type: "success",
        isRead: false,
      },
      {
        userId: 1,
        title: "Lembrete: Reunião em 30 min",
        message: "Você tem uma reunião em 30 minutos",
        type: "info",
        isRead: false,
      },
    ];

    mockNotifications.forEach(notification => {
      const id = this.currentNotificationId++;
      this.notifications.set(id, { ...notification, id, createdAt: new Date() });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser: User = { ...existingUser, ...user };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersByType(userType: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.userType === userType);
  }

  // Event methods
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const newEvent: Event = { ...event, id, createdAt: new Date() };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getActiveEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.isActive);
  }

  // Meeting methods
  async getMeeting(id: number): Promise<Meeting | undefined> {
    return this.meetings.get(id);
  }

  async createMeeting(meeting: InsertMeeting): Promise<Meeting> {
    const id = this.currentMeetingId++;
    const newMeeting: Meeting = { 
      ...meeting, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.meetings.set(id, newMeeting);
    return newMeeting;
  }

  async updateMeeting(id: number, meeting: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    const existingMeeting = this.meetings.get(id);
    if (!existingMeeting) return undefined;
    
    const updatedMeeting: Meeting = { 
      ...existingMeeting, 
      ...meeting, 
      updatedAt: new Date() 
    };
    this.meetings.set(id, updatedMeeting);
    return updatedMeeting;
  }

  async getUserMeetings(userId: number): Promise<Meeting[]> {
    return Array.from(this.meetings.values()).filter(
      meeting => meeting.fabricanteId === userId || meeting.revendedorId === userId
    );
  }

  async getEventMeetings(eventId: number): Promise<Meeting[]> {
    return Array.from(this.meetings.values()).filter(meeting => meeting.eventId === eventId);
  }

  async getAllMeetings(): Promise<Meeting[]> {
    return Array.from(this.meetings.values());
  }

  // Meeting Request methods
  async getMeetingRequest(id: number): Promise<MeetingRequest | undefined> {
    return this.meetingRequests.get(id);
  }

  async createMeetingRequest(request: InsertMeetingRequest): Promise<MeetingRequest> {
    const id = this.currentRequestId++;
    const newRequest: MeetingRequest = { 
      ...request, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.meetingRequests.set(id, newRequest);
    return newRequest;
  }

  async updateMeetingRequest(id: number, request: Partial<InsertMeetingRequest>): Promise<MeetingRequest | undefined> {
    const existingRequest = this.meetingRequests.get(id);
    if (!existingRequest) return undefined;
    
    const updatedRequest: MeetingRequest = { 
      ...existingRequest, 
      ...request, 
      updatedAt: new Date() 
    };
    this.meetingRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async getUserMeetingRequests(userId: number): Promise<MeetingRequest[]> {
    return Array.from(this.meetingRequests.values()).filter(
      request => request.requesterId === userId || request.targetId === userId
    );
  }

  async getPendingRequests(userId: number): Promise<MeetingRequest[]> {
    return Array.from(this.meetingRequests.values()).filter(
      request => request.targetId === userId && request.status === "pending"
    );
  }

  // Notification methods
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.currentNotificationId++;
    const newNotification: Notification = { 
      ...notification, 
      id, 
      createdAt: new Date() 
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      notification => notification.userId === userId
    );
  }

  async markNotificationAsRead(id: number): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      this.notifications.set(id, { ...notification, isRead: true });
    }
  }
}

export const storage = new MemStorage();
