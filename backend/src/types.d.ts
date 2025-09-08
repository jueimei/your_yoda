export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export interface Schedule {
  id: string;
  userId: string;
  date: string;
  content: string;
  emotions: string[];
  senderType: string;
  senderName?: string;
  detail?: string;
  createdAt: string;
}

export interface Letter {
  id: string;
  userId: string;
  scheduleId: string;
  senderType: string;
  senderName?: string;
  content: string;
  createdAt: string;
  readAt?: string;
}
