import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cron from 'node-cron';

// Custom interface for Request with user property
interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    name?: string;
    [key: string]: any;
  };
}

// Import types and demo data
import { User, Schedule, Letter } from './types';
import { initializeDemoData } from './demo-data';

// In-memory storage for users, schedules, and letters
const users: User[] = [];
const schedules: Schedule[] = [];
const letters: Letter[] = [];

// JWT secret key (in production this should be stored securely)
const JWT_SECRET = 'your-yoda-secret-key';

const app = express();
app.use(cors());
app.use(express.json());

// Basic JWT authentication middleware
const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      passwordHash: hashedPassword
    };
    
    users.push(newUser);
    
    // Generate JWT token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user data (without password) and token
    res.status(201).json({
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user data and token
    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Schedule routes
app.get('/api/schedules', authenticateToken, (req: AuthRequest, res: Response) => {
  const userSchedules = schedules.filter(schedule => schedule.userId === req.user?.id);
  res.json(userSchedules);
});

app.post('/api/schedules', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { content, date, emotions, senderType, senderName, detail } = req.body;
    
    const newSchedule = {
      id: `schedule-${Date.now()}`,
      userId: req.user?.id,
      content,
      date,
      emotions,
      senderType,
      senderName,
      detail,
      createdAt: new Date().toISOString()
    };
    
    schedules.push(newSchedule);
    res.status(201).json(newSchedule);
  } catch (error) {
    console.error('Schedule creation error:', error);
    res.status(500).json({ message: 'Server error creating schedule' });
  }
});

// Letter routes
app.get('/api/letters', authenticateToken, (req: AuthRequest, res: Response) => {
  const userLetters = letters.filter(letter => letter.userId === req.user?.id);
  res.json(userLetters);
});

app.patch('/api/letters/:id/read', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const letterId = req.params.id;
    const letterIndex = letters.findIndex(letter => letter.id === letterId && letter.userId === req.user?.id);
    
    if (letterIndex === -1) {
      return res.status(404).json({ message: 'Letter not found' });
    }
    
    // Mark letter as read
    letters[letterIndex].readAt = new Date().toISOString();
    
    res.json({ success: true, readAt: letters[letterIndex].readAt });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error marking letter as read' });
  }
});

// Generate sample letter content based on schedule, emotions, and sender type
function generateLetterContent(userName: string, schedule: any): string {
  const { content, emotions, senderType, senderName } = schedule;
  
  // Simple templates based on sender type
  const templates: { [key: string]: string[] } = {
    'future-self': [
      `To ${userName},\n\nHey ${userName}, I know you're facing ${content} today. Remember how we worried about similar situations before? Those worries never materialized the way we feared. Take a deep breath and trust yourself.`,
      `To ${userName},\n\nDear ${userName}, it's your future self here. I want you to know that the ${content} you're dealing with today is just one step in our journey. I've seen how it unfolds, and your strength today builds our resilience for tomorrow.`,
      `To ${userName},\n\n${userName}, looking back at this day, I realize how much this experience with ${content} shaped who we became. The emotions you feel now - ${emotions.join(", ")} - are valid, but they won't define your whole experience.`
    ],
    'famous': [
      `To ${userName},\n\n${userName}, as I often said during my career, success is not about avoiding failures but about consistently taking the right approach. With your ${content} today, focus on your process rather than the outcome.`,
      `To ${userName},\n\n${userName}, I see you're facing ${content} with ${emotions.join(" and ")}. Remember that in my career, I never focused on home runs - I focused on perfecting my approach, day after day. Your consistent effort matters more than any single result.`,
      `To ${userName},\n\nWhen I was preparing for important events, I felt many of the emotions you're feeling about ${content}. What separated me was not talent, but preparation and persistence. You have what it takes to succeed today.`
    ],
    'mentor': [
      `To ${userName},\n\n${userName}, I've watched your progress for some time now, and I know you have what it takes to handle ${content}. The ${emotions.join(" and ")} you're feeling are natural, but they don't define your capabilities.`,
      `To ${userName},\n\nI remember facing similar challenges to your ${content}. The key is to break it down into smaller steps and focus on one at a time. I believe in your ability to navigate this successfully.`,
      `To ${userName},\n\n${userName}, a good mentor doesn't give all the answers but helps you find your own path. As you approach ${content} today, trust the skills you've been developing and know that challenges are where true growth happens.`
    ],
    'loved-one': [
      `To ${userName},\n\n${userName}, no matter how ${content} turns out today, I want you to know how proud I am of you for trying. Your ${emotions.join(" and ")} show how much you care, and that's something to be valued.`,
      `To ${userName},\n\nI know you're feeling ${emotions.join(" and ")} about ${content} today. Remember that you're never alone in this - I'm with you in spirit every step of the way, celebrating your victories and supporting you through challenges.`,
      `To ${userName},\n\nDear ${userName}, families support each other through thick and thin. As you face ${content} today, know that my love doesn't depend on outcomes or achievements - it's unconditional and always there for you.`
    ]
  };
  
  // Get the appropriate template array
  const templateArray = templates[senderType] || templates['future-self'];
  
  // Choose a random template from the array
  const randomIndex = Math.floor(Math.random() * templateArray.length);
  return templateArray[randomIndex];
}

// Cron job to generate letters from schedules
cron.schedule('* * * * *', () => {
  console.log('Running letter generation job...');
  
  const today = new Date().toISOString().split('T')[0];
  
  // Find schedules for today that don't have letters yet
  schedules.forEach(schedule => {
    // Check if schedule is for today
    if (schedule.date === today) {
      // Check if letter already exists for this schedule
      const letterExists = letters.some(letter => letter.scheduleId === schedule.id);
      
      if (!letterExists) {
        // Find user
        const user = users.find(user => user.id === schedule.userId);
        if (!user) return;
        
        // Generate letter content
        const content = generateLetterContent(user.name, schedule);
        
        // Create new letter
        const newLetter = {
          id: `letter-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          userId: schedule.userId,
          scheduleId: schedule.id,
          senderType: schedule.senderType,
          senderName: schedule.senderName,
          content,
          createdAt: new Date().toISOString(),
          readAt: null as string | null
        };
        
        letters.push(newLetter);
        console.log(`Generated letter for user ${user.name}, schedule ${schedule.id}`);
      }
    }
  });
});

// Add demo data on server start
const addDemoData = async () => {
  // Add demo user
  const hashedPassword = await bcrypt.hash('password123', 10);
  users.push({
    id: 'user-demo',
    name: 'Mina',
    email: 'mina@gmail.com',
    passwordHash: hashedPassword
  });
  
  // Current and next date
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  // Add demo schedules
  const demoSchedules = [
    {
      id: 'schedule-1',
      userId: 'user-demo',
      content: 'Important presentation at work',
      date: todayStr,
      emotions: ['tense', 'anxious', 'hopeful'],
      senderType: 'famous',
      senderName: 'Donald Trump',
      createdAt: new Date(today.getTime() - 86400000).toISOString() // yesterday
    },
    {
      id: 'schedule-2',
      userId: 'user-demo',
      content: 'Dinner with friends',
      date: todayStr,
      emotions: ['excited', 'calm'],
      senderType: 'future-self',
      createdAt: new Date(today.getTime() - 86400000).toISOString() // yesterday
    },
    {
      id: 'schedule-3',
      userId: 'user-demo',
      content: 'Job interview',
      date: tomorrowStr,
      emotions: ['tense', 'anxious', 'hopeful', 'excited'],
      senderType: 'mentor',
      senderName: 'Professor Johnson',
      createdAt: today.toISOString()
    }
  ];
  
  schedules.push(...demoSchedules);
  
  // Add demo letters for today's schedules
  letters.push({
    id: 'letter-1',
    userId: 'user-demo',
    scheduleId: 'schedule-1',
    senderType: 'famous',
    senderName: 'Donald Trump',
    content: "To Mina,\n\nMina, I understand you have an important presentation today. I've been in high-pressure situations throughout my career, and I've found that nervousness is simply your body getting ready for something important. When I stepped up to make deals in crucial moments, I wasn't thinking about the outcome - I was focused on my process. That's what I want you to remember today: focus on your preparation and delivery, one step at a time. Your anxiety shows you care about doing well, and your hope reflects your belief in yourself. Trust your preparation, stay present in each moment of your presentation, and let the results take care of themselves. Remember, even the greatest achievements come from simple, consistent actions done well. I believe in you.",
    createdAt: new Date(today.getTime() - 3600000).toISOString(), // 1 hour ago
    readAt: null
  });
  
  letters.push({
    id: 'letter-2',
    userId: 'user-demo',
    scheduleId: 'schedule-2',
    senderType: 'future-self',
    content: "To Mina,\n\nHey Mina, it's your future self here. I'm reaching out about the dinner with friends you have planned for today. I remember how much you were looking forward to this break from your routine. These connections are so valuable - they've helped shape who I am now, one year ahead of you. I can tell you that the laughter and conversations you'll have tonight will stay with you. You're feeling excited and calm about this gathering, and that's perfect - these moments of relaxation and genuine connection are vital for our wellbeing. Cherish this time with your friends, be present, and enjoy the food and company. These are the moments that sustain us through challenges. Future You is grateful that you prioritized this connection tonight!",
    createdAt: new Date(today.getTime() - 3600000).toISOString(), // 1 hour ago
    readAt: new Date().toISOString() // already read
  });
  
  console.log('Added demo data');
};

// Add demo data and start server
const PORT = 5002;

// Initialize demo data
initializeDemoData(users, schedules, letters).then(() => {
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
});
