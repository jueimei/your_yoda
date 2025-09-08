import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// Letter interface
export interface Letter {
  id: string;
  senderType: string;
  senderName: string;
  content: string;
  createdAt: string;
  readAt: string | null;
}

// Props for letter list item
interface LetterListItemProps {
  letter: Letter;
}

export const LetterListItem: React.FC<LetterListItemProps> = ({ letter }) => {
  // Format the date
  const formattedDate = format(new Date(letter.createdAt), 'MMM dd, yyyy');
  
  // Get preview text (first 80 characters)
  const previewText = letter.content.length > 80 
    ? letter.content.substring(0, 80) + '...'
    : letter.content;
  
  // Get sender name or default based on type
  const displayName = letter.senderName || 
    (letter.senderType === 'future-self' ? 'Future You' : 'Your Supporter');

  // Get emoji for sender type
  const getEmojiForSenderType = (type: string) => {
    switch(type) {
      case 'future-self': return '🔮';
      case 'celebrity': return '🌟';
      case 'mentor': return '🧠';
      case 'loved-one': return '❤️';
      default: return '✉️';
    }
  };

  return (
    <Link to={`/letters/${letter.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: letter.readAt ? '#fff' : '#e3f2fd',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '16px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        border: '1px solid #e0e0e0',
        position: 'relative',
      }}>
        {!letter.readAt && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#2196f3',
            color: 'white',
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '12px'
          }}>
            New
          </div>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            marginRight: '12px'
          }}>
            {getEmojiForSenderType(letter.senderType)}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{displayName}</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#757575' }}>{formattedDate}</p>
          </div>
        </div>
        
        <p style={{ 
          fontSize: '15px', 
          margin: 0, 
          color: '#424242',
          lineHeight: '1.5'
        }}>
          {previewText}
        </p>
      </div>
    </Link>
  );
};

// Props for letter detail view
interface LetterDetailProps {
  letter: Letter;
  onMarkAsRead?: () => void;
}

export const LetterDetail: React.FC<LetterDetailProps> = ({ letter, onMarkAsRead }) => {
  // Format dates
  const createdDate = format(new Date(letter.createdAt), 'MMMM dd, yyyy');
  const readDate = letter.readAt ? format(new Date(letter.readAt), 'MMMM dd, yyyy HH:mm') : null;
  
  // Get sender name
  const displayName = letter.senderName || 
    (letter.senderType === 'future-self' ? 'Future You' : 'Your Supporter');

  // Mark as read when viewed
  React.useEffect(() => {
    if (!letter.readAt && onMarkAsRead) {
      onMarkAsRead();
    }
  }, [letter, onMarkAsRead]);

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '50%',
          backgroundColor: '#f0f7ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          marginRight: '16px',
          border: '1px solid #e1e8ed'
        }}>
          {letter.senderType === 'future-self' ? '🔮' : 
           letter.senderType === 'celebrity' ? '🌟' : 
           letter.senderType === 'mentor' ? '🧠' : '❤️'}
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>{displayName}</h2>
          <p style={{ margin: 0, fontSize: '15px', color: '#666' }}>
            {createdDate}
          </p>
        </div>
      </div>
      
      <div style={{ 
        fontSize: '16px', 
        lineHeight: '1.8',
        color: '#333',
        marginBottom: '24px',
        padding: '16px 24px',
        backgroundColor: '#fafafa',
        borderRadius: '8px',
        border: '1px solid #f0f0f0',
        whiteSpace: 'pre-wrap'
      }}>
        {letter.content}
      </div>
      
      {readDate && (
        <div style={{ fontSize: '14px', color: '#888', textAlign: 'right' }}>
          Read on: {readDate}
        </div>
      )}
    </div>
  );
};
