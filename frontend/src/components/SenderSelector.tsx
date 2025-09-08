import React, { useState } from 'react';

// Sender type definitions
export interface SenderType {
  id: string;
  label: string;
  description: string;
  needsName: boolean;
}

// Available sender types based on the PRD
export const senderTypes: SenderType[] = [
  { 
    id: 'future-self', 
    label: '未来の自分', 
    description: '1年後の成長した自分からのメッセージ',
    needsName: false
  },
  { 
    id: 'celebrity', 
    label: '尊敬する著名人', 
    description: 'ドナルド・トランプ、スティーブ・ジョブズなど',
    needsName: true
  },
  { 
    id: 'mentor', 
    label: '尊敬する人', 
    description: '恩師、上司、メンターなど',
    needsName: true
  },
  { 
    id: 'loved-one', 
    label: '大切な人', 
    description: '家族、親友、恋人など',
    needsName: true
  }
];

interface SenderSelectorProps {
  selectedSenderType: string;
  senderName: string;
  onSenderTypeChange: (senderType: string) => void;
  onSenderNameChange: (name: string) => void;
}

const SenderSelector: React.FC<SenderSelectorProps> = ({
  selectedSenderType,
  senderName,
  onSenderTypeChange,
  onSenderNameChange
}) => {
  // Get the current selected sender type info
  const selectedType = senderTypes.find(type => type.id === selectedSenderType);

  return (
    <div>
      <h3 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 500 }}>Letter Sender</h3>
      <p style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}>
        Choose who you want to receive your supportive letter from:
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {senderTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => onSenderTypeChange(type.id)}
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: type.id === selectedSenderType ? '#e3f2fd' : '#f5f5f5',
              border: type.id === selectedSenderType ? '2px solid #2196f3' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: type.id === selectedSenderType 
                ? '0 4px 8px rgba(0,0,0,0.1)' 
                : '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{type.label}</h4>
            <p style={{ fontSize: '13px', color: '#666' }}>{type.description}</p>
          </div>
        ))}
      </div>
      
      {/* Display name input if needed for selected type */}
      {selectedType?.needsName && (
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="sender-name" style={{ display: 'block', marginBottom: '6px', fontSize: '15px' }}>
            {selectedType.label}の名前:
          </label>
          <input
            id="sender-name"
            type="text"
            value={senderName}
            onChange={(e) => onSenderNameChange(e.target.value)}
            placeholder="例: トランプ、田中先生..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SenderSelector;
