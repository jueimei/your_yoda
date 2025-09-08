// API services
import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL
});

// Add JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// For demo, we'll use some mock data services
export const schedulesService = {
  // Get all schedules for the current user
  getSchedules: async () => {
    // In a real app: return api.get('/schedules');
    return Promise.resolve({
      data: [
        {
          id: 'schedule-1',
          date: '2025-09-07', // Tomorrow
          content: 'Important presentation at work',
          emotions: ['nervous', 'hopeful', 'excited'],
          senderType: 'famous',
          senderName: 'Donald Trump',
        },
        {
          id: 'schedule-2',
          date: '2025-09-07',
          content: 'Dinner with friends',
          emotions: ['happy', 'relaxed'],
          senderType: 'future-self',
        }
      ]
    });
  },
  
  // Create a new schedule
  createSchedule: async (scheduleData: any) => {
    // In a real app: return api.post('/schedules', scheduleData);
    return Promise.resolve({
      data: {
        id: `schedule-${Date.now()}`,
        ...scheduleData,
        date: new Date(scheduleData.date).toISOString().split('T')[0],
      }
    });
  }
};

export const lettersService = {
  // Get all letters for the current user
  getLetters: async () => {
    // In a real app: return api.get('/letters');
    return Promise.resolve({
      data: [
        {
          id: 'letter-1',
          scheduleId: 'schedule-1',
          senderType: 'famous',
          senderName: 'Donald Trump',
          content: "To Mina,\n\nI hear you have an important presentation tomorrow. Remember that preparation is key, but also don't forget that nervousness is simply your body getting ready for something important. I always say, \"I'm not nervous, I'm ready.\" Focus on the process, not the outcome. The result will follow if you concentrate on each step. Your colleagues will appreciate your dedication, and you'll be proud of yourself regardless of the outcome. Give it your best effort - that's all anyone can ask for.",
          createdAt: '2025-09-06T06:00:00Z',
          readAt: null
        },
        {
          id: 'letter-2',
          scheduleId: 'schedule-2',
          senderType: 'future-self',
          content: "To Mina,\n\nHey there! I know you're looking forward to dinner with friends tonight. These moments of connection are so valuable, and Future You appreciates that you're making time for them even when life gets busy. Remember to be present and enjoy these moments - they become cherished memories that help sustain us during challenging times. You deserve this break and the joy it brings. Have a wonderful evening!",
          createdAt: '2025-09-06T06:00:00Z',
          readAt: '2025-09-06T07:30:00Z'
        }
      ]
    });
  },
  
  // Mark a letter as read
  markAsRead: async (letterId: string) => {
    // In a real app: return api.patch(`/letters/${letterId}/read`);
    return Promise.resolve({
      data: {
        success: true,
        readAt: new Date().toISOString()
      }
    });
  }
};

export default api;
