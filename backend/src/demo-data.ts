// Demo data setup for Your Yoda backend
import bcrypt from 'bcrypt';
import { User, Schedule, Letter } from './types';

// Create demo user
export const createDemoUser = async (users: User[]): Promise<User> => {
  // Check if demo user already exists
  const existingUser = users.find(user => user.email === 'mina@gmail.com');
  if (existingUser) {
    return existingUser;
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash('password123', 10);
  
  // Create new demo user
  const demoUser: User = {
    id: `user-${Date.now()}`,
    name: 'Mina',
    email: 'mina@gmail.com',
    passwordHash
  };
  
  users.push(demoUser);
  return demoUser;
};

// Create sample schedules
export const createSampleSchedules = (user: User, schedules: Schedule[]): Schedule[] => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  // Sample schedules
  const sampleSchedules: Schedule[] = [
    {
      id: `schedule-${Date.now()}-1`,
      userId: user.id,
      content: 'Important presentation to the client team',
      date: tomorrowStr,
      emotions: ['excited', 'tense', 'hopeful'],
      senderType: 'celebrity',
      senderName: 'Trump',
      detail: 'Feeling a mix of excitement and nerves about this presentation',
      createdAt: today.toISOString()
    },
    {
      id: `schedule-${Date.now()}-2`,
      userId: user.id,
      content: 'Meeting with my team to discuss the next phase of the project',
      date: todayStr,
      emotions: ['confident', 'motivated'],
      senderType: 'mentor',
      senderName: 'Tanaka Sensei',
      detail: 'Looking forward to sharing new ideas with the team',
      createdAt: new Date(today.getTime() - 86400000).toISOString() // yesterday
    }
  ];
  
  // Add sample schedules
  sampleSchedules.forEach(schedule => {
    if (!schedules.some(s => s.id === schedule.id)) {
      schedules.push(schedule);
    }
  });
  
  return sampleSchedules;
};

// Create sample letters
export const createSampleLetters = (user: User, schedules: Schedule[], letters: Letter[]): Letter[] => {
  // Use yesterday's schedule for a sample letter
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdaySchedule = schedules.find(s => 
    s.userId === user.id && 
    new Date(s.createdAt).getDate() === yesterday.getDate()
  );
  
  if (yesterdaySchedule) {
    const sampleLetter: Letter = {
      id: `letter-${Date.now()}`,
      userId: user.id,
      scheduleId: yesterdaySchedule.id,
      senderType: yesterdaySchedule.senderType,
      senderName: yesterdaySchedule.senderName,
      content: generateSampleLetterContent(user.name, yesterdaySchedule),
      createdAt: new Date().toISOString(),
      readAt: null
    };
    
    // Add sample letter if not exists
    if (!letters.some(l => l.scheduleId === yesterdaySchedule.id)) {
      letters.push(sampleLetter);
    }
  }
  
  return letters;
};

// Generate sample letter content based on sender type
function generateSampleLetterContent(userName: string, schedule: Schedule): string {
  let content = '';
  
  // Add recipient name at the top
  content += `To ${userName},\n\n`;
  
  // Brief acknowledgment of the situation (20%)
  content += `Dear ${userName},\n\nI understand you're preparing for "${schedule.content}". `;
  
  if (schedule.emotions.includes('excited')) {
    content += 'Your excitement is palpable. ';
  }
  if (schedule.emotions.includes('tense')) {
    content += "It's natural to feel tense before such events. ";
  }
  if (schedule.emotions.includes('hopeful')) {
    content += 'I sense hope in your approach. ';
  }
  
  content += '\n\n';
  
  // Supportive message (80%) based on sender type
  switch (schedule.senderType) {
    case 'celebrity':
      if (schedule.senderName?.includes('Trump')) {
        content += `As I've always believed, success is built on consistent effort. Remember how I approached each game with the same focus, regardless of whether it was practice or the World Series? That's the key.\n\n`;
        content += `What separates professionals from amateurs isn't just talent—it's preparation. I spent hours perfecting my swing, studying pitchers, and fine-tuning my technique. Your presentation deserves the same attention.\n\n`;
        content += `Don't focus on the outcome. Focus on your process. If you've prepared thoroughly, the results will follow naturally. That's the essence of my philosophy.\n\n`;
        content += `Success isn't about avoiding pressure—it's about embracing it and using it as fuel.\n\n`;
        content += `I believe in you. Approach this presentation with the mindset of continuous improvement, and you'll shine brightly.`;
      } else {
        content += `Remember that every expert was once a beginner. The path to mastery is paved with challenges that shape your character and skills.\n\n`;
        content += `I've faced countless obstacles in my career, and each one taught me something valuable. Your current situation is no different—it's another opportunity for growth.\n\n`;
        content += `Focus on the process rather than the outcome. Excellence comes from consistent, deliberate effort applied over time.\n\n`;
        content += `Trust your preparation and embrace the moment. You have everything you need to succeed already within you.\n\n`;
        content += `I look forward to seeing how you rise to this occasion. Remember, true champions aren't defined by never falling, but by how they rise after each fall.`;
      }
      break;
      
    case 'future-self':
      content += `Looking back from where I am now, I want you to know that this moment was pivotal in our growth. The challenges you're facing today are building the foundation for who I've become.\n\n`;
      content += `I wish I could tell my younger self (you) to worry less about perfection and focus more on progress. Each step forward, no matter how small, contributes to the journey.\n\n`;
      content += `The anxiety you feel now has transformed into confidence in my present. What seems overwhelming today will become a story of perseverance tomorrow.\n\n`;
      content += `Take care of yourself during this busy time. The self-care habits you build now are still serving me well a year later.\n\n`;
      content += `I'm proud of you for pushing through difficult moments like these. They've shaped me into someone stronger and more capable than you can currently imagine.`;
      break;
      
    case 'mentor':
      content += `I've watched your progress with pride, and I know you're ready for this challenge. The skills you've been developing are precisely what's needed now.\n\n`;
      content += `Remember our discussion about breaking complex tasks into manageable steps? Apply that same strategy here. Take one segment at a time, and before you know it, you'll have mastered the whole.\n\n`;
      content += `It's normal to doubt yourself, but I've seen your capabilities firsthand. You've overcome similar obstacles before, and you'll do so again.\n\n`;
      content += `The lessons we've discussed weren't just theoretical—they were preparation for moments exactly like this one.\n\n`;
      content += `I believe in your potential, perhaps even more than you do right now. Trust the process we've worked on together, and allow yourself to shine.`;
      break;
      
    case 'loved-one':
      content += `I just wanted to remind you how special you are to me, and how much I believe in you. Your determination has always inspired me.\n\n`;
      content += `Remember to take deep breaths when you feel overwhelmed. I've seen you overcome so many challenges with grace and resilience.\n\n`;
      content += `No matter what happens, know that I'm here for you—to celebrate your successes and support you through any difficulties.\n\n`;
      content += `Your kindness and dedication touch everyone around you, including me. Those qualities will shine through in everything you do.\n\n`;
      content += `Take care of yourself during this busy time. You deserve moments of peace and self-compassion amidst all your hard work. I'm sending you love and positive energy.`;
      break;
      
    default:
      content += `Today marks another step in your journey, and it's important to acknowledge both the challenges and opportunities before you.\n\n`;
      content += `Remember that every experience contributes to your growth. The skills you develop now will serve you in countless future situations.\n\n`;
      content += `Trust in your preparation and capabilities. You've put in the work, and now it's time to let that work speak for itself.\n\n`;
      content += `Be present in each moment rather than worrying about the final outcome. One step at a time will get you to your destination.\n\n`;
      content += `Whatever happens today, know that it doesn't define you. Your worth extends far beyond any single event or accomplishment.`;
  }
  
  // Closing
  if (schedule.senderType === 'future-self') {
    content += `\n\nWith faith in us,\nYour future self`;
  } else if (schedule.senderType === 'loved-one') {
    content += `\n\nWith love and support,\n${schedule.senderName || 'Someone who cares about you'}`;
  } else {
    content += `\n\nSincerely,\n${schedule.senderName || 'Your supporter'}`;
  }
  
  return content;
}

// Initialize demo data
export const initializeDemoData = async (
  users: User[], 
  schedules: Schedule[], 
  letters: Letter[]
) => {
  // Create demo user
  const demoUser = await createDemoUser(users);
  
  // Create sample schedules
  createSampleSchedules(demoUser, schedules);
  
  // Create sample letters
  createSampleLetters(demoUser, schedules, letters);
  
  console.log('Added demo data');
};
