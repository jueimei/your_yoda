// Dashboard page with morning theme - main interface for schedule/emotion input
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { schedulesService } from '../services/api';

// Emotion data structure
interface Emotion {
  id: string;
  label: string; // Japanese label
  englishLabel: string;
  emoji: string;
  color: string;
}

// Available emotions as per spec
const emotions: Emotion[] = [
  { id: 'excited', label: 'ワクワク', englishLabel: 'Excited', emoji: '😃', color: '#FFD700' },
  { id: 'tense', label: '緊張', englishLabel: 'Tense', emoji: '😬', color: '#FFA500' },
  { id: 'anxious', label: '不安', englishLabel: 'Anxious', emoji: '😟', color: '#9370DB' },
  { id: 'confident', label: '自信', englishLabel: 'Confident', emoji: '😎', color: '#4682B4' },
  { id: 'tired', label: '疲れ', englishLabel: 'Tired', emoji: '😴', color: '#708090' },
  { id: 'motivated', label: 'やる気', englishLabel: 'Motivated', emoji: '💪', color: '#FF6347' },
  { id: 'calm', label: '穏やか', englishLabel: 'Calm', emoji: '😌', color: '#20B2AA' },
  { id: 'overwhelmed', label: '圧倒', englishLabel: 'Overwhelmed', emoji: '🤯', color: '#FF4500' },
  { id: 'hopeful', label: '希望', englishLabel: 'Hopeful', emoji: '🌈', color: '#6A5ACD' },
  { id: 'worried', label: '心配', englishLabel: 'Worried', emoji: '😰', color: '#B22222' }
];

// Sender types
interface SenderType {
  id: string;
  label: string;
  englishLabel: string;
  description: string;
  requiresName: boolean;
}

const senderTypes: SenderType[] = [
  { id: 'future-self', label: '未来の自分', englishLabel: 'Future Self', description: '1年後の成長した自分からのメッセージ', requiresName: false },
  { id: 'famous', label: '尊敬する著名人', englishLabel: 'Famous Person', description: 'イチロー選手、スティーブ・ジョブズなど', requiresName: true },
  { id: 'mentor', label: '尊敬する人', englishLabel: 'Respected Person', description: '恩師、上司、メンターなど', requiresName: true },
  { id: 'loved-one', label: '大切な人', englishLabel: 'Loved One', description: '家族、親友、恋人など', requiresName: true }
];

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [scheduleContent, setScheduleContent] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedSenderType, setSelectedSenderType] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [additionalDetails, setAdditionalDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Check auth
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleEmotionToggle = (emotionId: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotionId)
        ? prev.filter(id => id !== emotionId)
        : [...prev, emotionId]
    );
  };

  const handleSenderSelect = (senderId: string) => {
    setSelectedSenderType(senderId);
    // Reset sender name if changed from requiring to not requiring
    if (!senderTypes.find(s => s.id === senderId)?.requiresName) {
      setSenderName('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedEmotions.length === 0) {
      setError('Please select at least one emotion');
      return;
    }

    if (!selectedSenderType) {
      setError('Please select a letter sender');
      return;
    }

    const currentSenderType = senderTypes.find(s => s.id === selectedSenderType);
    if (currentSenderType?.requiresName && !senderName.trim()) {
      setError(`Please enter the name for your ${currentSenderType.englishLabel}`);
      return;
    }

    try {
      setIsSubmitting(true);

      // In a real app, this would send data to your backend
      await schedulesService.createSchedule({
        userId: user?.id,
        date: tomorrowStr,
        content: scheduleContent,
        emotions: selectedEmotions,
        senderType: selectedSenderType,
        senderName: senderName || undefined,
        detail: additionalDetails || undefined
      });

      // Show success message and reset form
      setSuccess(true);
      setScheduleContent('');
      setSelectedEmotions([]);
      setSelectedSenderType('');
      setSenderName('');
      setAdditionalDetails('');

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting schedule:', err);
      setError('Failed to save your schedule. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Morning theme styling
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #87CEEB, #E0F6FF, #FFF8DC)',
      padding: '20px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 600,
      color: '#2D3748'
    },
    logoutButton: {
      padding: '8px 16px',
      background: 'transparent',
      border: '1px solid #2196f3',
      borderRadius: '8px',
      color: '#2196f3',
      cursor: 'pointer',
      fontSize: '14px'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '24px',
      padding: '30px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      maxWidth: '800px',
      margin: '0 auto',
      marginBottom: '20px'
    },
    welcomeMessage: {
      fontSize: '16px',
      color: '#4A5568',
      marginBottom: '30px',
      lineHeight: '1.5'
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: '20px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#2D3748',
      marginBottom: '10px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '16px',
      color: '#4A5568'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      fontSize: '16px'
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      fontSize: '16px',
      minHeight: '120px',
      resize: 'vertical' as 'vertical'
    },
    emotionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '10px',
      marginTop: '10px'
    },
    emotionButton: (isSelected: boolean, color: string) => ({
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      background: isSelected ? `${color}33` : 'white', // 33 adds 20% opacity
      boxShadow: isSelected ? `0 0 0 2px ${color}` : 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }),
    emotionEmoji: {
      fontSize: '24px',
      marginBottom: '4px'
    },
    emotionLabel: {
      fontSize: '12px',
      fontWeight: 500,
      textAlign: 'center' as 'center'
    },
    senderTypeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '15px',
      marginTop: '10px'
    },
    senderCard: (isSelected: boolean) => ({
      padding: '15px',
      borderRadius: '16px',
      border: isSelected ? '2px solid #2196f3' : '1px solid #E2E8F0',
      background: isSelected ? 'rgba(33, 150, 243, 0.05)' : 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }),
    senderTitle: {
      fontSize: '16px',
      fontWeight: 600,
      marginBottom: '4px',
      color: '#2D3748'
    },
    senderDescription: {
      fontSize: '14px',
      color: '#718096'
    },
    selectedEmotionsList: {
      display: 'flex',
      flexWrap: 'wrap' as 'wrap',
      gap: '8px',
      marginTop: '15px'
    },
    selectedEmotion: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 12px',
      borderRadius: '16px',
      background: '#E2E8F0',
      fontSize: '14px'
    },
    submitButton: {
      padding: '14px',
      borderRadius: '8px',
      border: 'none',
      background: '#4caf50',
      color: 'white',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '20px'
    },
    errorMessage: {
      color: '#e53e3e',
      marginTop: '10px',
      padding: '10px',
      borderRadius: '8px',
      background: '#fed7d7'
    },
    successMessage: {
      color: '#276749',
      marginTop: '10px',
      padding: '15px',
      borderRadius: '8px',
      background: '#c6f6d5',
      textAlign: 'center' as 'center'
    },
    lettersButton: {
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      background: '#2196f3',
      color: 'white',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      width: '100%',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Yoda</h1>
        <button style={styles.logoutButton} onClick={logout}>Log Out</button>
      </div>

      <div style={styles.card}>
        <p style={styles.welcomeMessage}>
          Good evening, {user?.name}! Let's prepare for tomorrow together.
          <br />
          Tell us about your schedule and how you're feeling about it.
        </p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div>
            <h2 style={styles.sectionTitle}>Tomorrow's Schedule ({new Date(tomorrowStr).toLocaleDateString()})</h2>
            <textarea 
              style={styles.textarea}
              placeholder="What's on your agenda for tomorrow? (e.g., Important meeting, Dinner with friends, etc.)"
              value={scheduleContent}
              onChange={(e) => setScheduleContent(e.target.value)}
              required
            />
          </div>

          <div>
            <h2 style={styles.sectionTitle}>How are you feeling about tomorrow?</h2>
            <p style={styles.label}>Select one or more emotions:</p>
            
            <div style={styles.emotionGrid}>
              {emotions.map((emotion) => (
                <div 
                  key={emotion.id}
                  style={styles.emotionButton(selectedEmotions.includes(emotion.id), emotion.color)}
                  onClick={() => handleEmotionToggle(emotion.id)}
                >
                  <span style={styles.emotionEmoji}>{emotion.emoji}</span>
                  <span style={styles.emotionLabel}>{emotion.label}</span>
                  <span style={{...styles.emotionLabel, fontSize: '10px'}}>{emotion.englishLabel}</span>
                </div>
              ))}
            </div>
            
            {selectedEmotions.length > 0 && (
              <div style={styles.selectedEmotionsList}>
                <span style={{color: '#4A5568', marginRight: '8px'}}>Selected:</span>
                {selectedEmotions.map(id => {
                  const emotion = emotions.find(e => e.id === id)!;
                  return (
                    <span key={id} style={styles.selectedEmotion}>
                      {emotion.emoji} {emotion.englishLabel}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h2 style={styles.sectionTitle}>Who would you like to hear from tomorrow?</h2>
            <div style={styles.senderTypeGrid}>
              {senderTypes.map((sender) => (
                <div 
                  key={sender.id}
                  style={styles.senderCard(selectedSenderType === sender.id)}
                  onClick={() => handleSenderSelect(sender.id)}
                >
                  <h3 style={styles.senderTitle}>{sender.englishLabel}</h3>
                  <p style={styles.senderDescription}>{sender.description}</p>
                </div>
              ))}
            </div>
            
            {selectedSenderType && senderTypes.find(s => s.id === selectedSenderType)?.requiresName && (
              <div style={{marginTop: '15px'}}>
                <label style={styles.label} htmlFor="senderName">
                  Enter the name of your {senderTypes.find(s => s.id === selectedSenderType)?.englishLabel}:
                </label>
                <input
                  style={styles.input}
                  type="text"
                  id="senderName"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Donald Trump, Steve Jobs, etc."
                />
              </div>
            )}
          </div>

          <div>
            <h2 style={styles.sectionTitle}>Additional Details (Optional)</h2>
            <textarea 
              style={styles.textarea}
              placeholder="Share more about your emotions or context that might help create a personalized letter..."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
            />
          </div>
          
          {error && <div style={styles.errorMessage}>{error}</div>}
          {success && (
            <div style={styles.successMessage}>
              Your schedule has been saved! Your personalized letter will be ready tomorrow morning.
            </div>
          )}
          
          <button 
            style={styles.submitButton}
            type="submit"
            disabled={isSubmitting || !scheduleContent || selectedEmotions.length === 0 || !selectedSenderType}
          >
            {isSubmitting ? 'Saving...' : 'Save Tomorrow\'s Schedule'}
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Your Letters</h2>
        <p style={styles.welcomeMessage}>
          Check your personalized support letters from your selected senders.
        </p>
        <button style={styles.lettersButton} onClick={() => navigate('/letters')}>
          View Your Letters
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
