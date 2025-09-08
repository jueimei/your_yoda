# Your Yoda - Emotional Support App

A demo project for "Your Yoda", an app that provides emotional support through personalized letters based on your schedule and emotions.

## 🌟 Features

- **Night-themed Authentication**: Beautiful gradient login/register UI
- **Emotion Selection**: Choose from 10 different emotions with visual indicators
- **Letter Sender Selection**: Receive letters from your future self, celebrities, mentors, or loved ones
- **Automated Letter Generation**: Letters are generated every minute in the test environment
- **Letter Management**: View and read personalized supportive letters

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript, React Router, Context API
- **Backend**: Node.js, Express.js + TypeScript
- **Authentication**: JWT + bcrypt
- **Scheduling**: node-cron
- **Storage**: In-memory (for demo purposes)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Running the Demo

1. **Start the Backend Server**:

```bash
cd your-yoda-demo/backend
npm install
npm run dev
```

2. **Start the Frontend Development Server**:

```bash
cd your-yoda-demo/frontend
npm install
npm run dev
```

3. **Access the Application**:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5002

## 📝 Usage

1. Register or login with the following demo account:
   - Email: mina@gmail.com
   - Password: password123

2. Create a schedule by entering your plans for tomorrow and selecting your emotions.

3. Choose a letter sender type (future self, celebrity, mentor, or loved one).

4. Wait for the letter generation (occurs every minute in the demo).

5. View your personalized letters on the dashboard or letters page.

## 📁 Project Structure

- `/backend`: Express.js API server
- `/frontend`: React application
  - `/src/components`: Reusable UI components
  - `/src/contexts`: React Context providers
  - `/src/pages`: Application pages/screens
  - `/src/services`: API service layer

---

This demo implements approximately 80% of the functionality described in the PRD.
