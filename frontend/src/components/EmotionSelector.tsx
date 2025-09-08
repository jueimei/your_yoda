import React from 'react';

// Emotion type definition
export interface Emotion {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

// Available emotions based on the PRD
export const emotions: Emotion[] = [
  { id: 'excited', label: 'ワクワク', emoji: '😃', color: '#FFD700' },
  { id: 'tense', label: '緊張', emoji: '😬', color: '#FFA500' },
  { id: 'anxious', label: '不安', emoji: '😟', color: '#9370DB' },
  { id: 'confident', label: '自信', emoji: '😎', color: '#32CD32' },
  { id: 'tired', label: '疲れ', emoji: '😴', color: '#A9A9A9' },
  { id: 'motivated', label: 'やる気', emoji: '💪', color: '#FF6347' },
  { id: 'calm', label: '穏やか', emoji: '😌', color: '#87CEEB' },
  { id: 'overwhelmed', label: '圧倒', emoji: '😵', color: '#8B0000' },
  { id: 'hopeful', label: '希望', emoji: '✨', color: '#1E90FF' },
  { id: 'worried', label: '心配', emoji: '😧', color: '#6A5ACD' }
];

interface EmotionSelectorProps {
  selectedEmotions: string[];
  onChange: (emotions: string[]) => void;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ selectedEmotions, onChange }) => {
  const toggleEmotion = (emotionId: string) => {
    if (selectedEmotions.includes(emotionId)) {
      onChange(selectedEmotions.filter(id => id !== emotionId));
    } else {
      onChange([...selectedEmotions, emotionId]);
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 500 }}>Emotions</h3>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '10px', 
        marginBottom: '20px' 
      }}>
        {emotions.map((emotion) => (
          <div
            key={emotion.id}
            onClick={() => toggleEmotion(emotion.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 12px',
              borderRadius: '16px',
              backgroundColor: selectedEmotions.includes(emotion.id) 
                ? `${emotion.color}30` // 30% opacity for selected
                : '#f0f0f0',
              border: selectedEmotions.includes(emotion.id) 
                ? `2px solid ${emotion.color}` 
                : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedEmotions.includes(emotion.id) 
                ? '0 2px 5px rgba(0,0,0,0.15)' 
                : 'none'
            }}
          >
            <span style={{ fontSize: '18px', marginRight: '5px' }}>{emotion.emoji}</span>
            <span>{emotion.label}</span>
          </div>
        ))}
      </div>
      
      {selectedEmotions.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '15px', marginBottom: '8px' }}>Selected:</h4>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '5px' 
          }}>
            {selectedEmotions.map(id => {
              const emotion = emotions.find(e => e.id === id);
              return emotion ? (
                <div key={`selected-${id}`} style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backgroundColor: `${emotion.color}20`, // 20% opacity
                  border: `1px solid ${emotion.color}`
                }}>
                  {emotion.emoji} {emotion.label}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionSelector;
