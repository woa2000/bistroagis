// Frontend types for API responses
export interface ApiUser {
  id: number;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  userType: string;
  profileImage?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ApiMeeting {
  id: number;
  eventId: number;
  fabricanteId: number;
  revendedorId: number;
  scheduledAt: string;
  duration: number;
  location?: string;
  status: string;
  notes?: string;
  result?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiMeetingRequest {
  id: number;
  eventId: number;
  requesterId: number;
  targetId: number;
  requestedAt: string;
  message?: string;
  status: string;
  responseMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiNotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiStats {
  totalMeetings: number;
  confirmedMeetings: number;
  completedMeetings: number;
  pendingMeetings: number;
  attendanceRate: number;
}
