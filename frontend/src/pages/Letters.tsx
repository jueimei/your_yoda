// Letters page to view received support letters
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { lettersService } from '../services/api';

// Letter interface
interface Letter {
  id: string;
  scheduleId: string;
  senderType: string;
  senderName?: string;
  content: string;
  createdAt: string;
  readAt: string | null;
}

// Sender type mapping for display
const senderTypeMap: Record<string, { name: string, icon: string }> = {
  'future-self': { name: 'Future Self', icon: '🔮' },
  'famous': { name: 'Famous Person', icon: '🌟' },
  'mentor': { name: 'Respected Person', icon: '👨‍🏫' },
  'loved-one': { name: 'Loved One', icon: '❤️' }
};

const Letters: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check auth and fetch letters
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchLetters = async () => {
      try {
        setLoading(true);
        const response = await lettersService.getLetters();
        setLetters(response.data);
      } catch (err) {
        console.error('Error fetching letters:', err);
        setError('Failed to load your letters. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, [user, navigate]);

  // Mark letter as read when selected
  const handleLetterClick = async (letter: Letter) => {
    setSelectedLetter(letter);
    
    // Only mark as read if it hasn't been read yet
    if (!letter.readAt) {
      try {
        const response = await lettersService.markAsRead(letter.id);
        
        // Update the letter in the list with the new readAt timestamp
        setLetters(letters.map(l => 
          l.id === letter.id 
            ? { ...l, readAt: response.data.readAt } 
            : l
        ));
        
        // Also update the selected letter
        setSelectedLetter(prev => 
          prev && prev.id === letter.id 
            ? { ...prev, readAt: response.data.readAt } 
            : prev
        );
      } catch (err) {
        console.error('Error marking letter as read:', err);
      }
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
    backButton: {
      padding: '8px 16px',
      background: 'transparent',
      border: '1px solid #2196f3',
      borderRadius: '8px',
      color: '#2196f3',
      cursor: 'pointer',
      fontSize: '14px'
    },
    layout: {
      display: 'grid',
      gridTemplateColumns: 'minmax(250px, 1fr) 3fr',
      gap: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    lettersList: {
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto' as 'auto'
    },
    letterDetail: {
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto' as 'auto',
      display: 'flex',
      flexDirection: 'column' as 'column'
    },
    letterCard: (isSelected: boolean, isUnread: boolean) => ({
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '10px',
      cursor: 'pointer',
      background: isSelected ? 'rgba(33, 150, 243, 0.1)' : 'white',
      borderLeft: isUnread ? '4px solid #4caf50' : isSelected ? '4px solid #2196f3' : '4px solid transparent',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease'
    }),
    letterCardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px'
    },
    senderIcon: {
      fontSize: '20px',
      marginRight: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: '16px',
      background: '#f0f0f0'
    },
    senderName: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#2D3748'
    },
    letterPreview: {
      fontSize: '14px',
      color: '#718096',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical' as 'vertical'
    },
    letterDate: {
      fontSize: '12px',
      color: '#A0AEC0',
      marginTop: '5px'
    },
    letterDetailHeader: {
      marginBottom: '20px',
      paddingBottom: '20px',
      borderBottom: '1px solid #E2E8F0'
    },
    letterDetailSender: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px'
    },
    letterDetailSenderIcon: {
      fontSize: '24px',
      marginRight: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '20px',
      background: '#f0f0f0'
    },
    letterDetailSenderName: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#2D3748'
    },
    letterDetailDateRow: {
      display: 'flex',
      fontSize: '14px',
      color: '#718096',
      marginBottom: '5px'
    },
    letterDetailDateLabel: {
      width: '100px',
      color: '#4A5568'
    },
    letterDetailContent: {
      fontSize: '16px',
      lineHeight: 1.6,
      color: '#2D3748',
      whiteSpace: 'pre-wrap' as 'pre-wrap'
    },
    noLettersMessage: {
      textAlign: 'center' as 'center',
      padding: '30px',
      color: '#718096',
      fontSize: '16px'
    },
    noSelectedMessage: {
      textAlign: 'center' as 'center',
      padding: '30px',
      color: '#718096',
      fontSize: '16px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    noSelectedIcon: {
      fontSize: '40px',
      marginBottom: '20px',
      color: '#A0AEC0'
    },
    loading: {
      textAlign: 'center' as 'center',
      padding: '30px',
      color: '#2196f3'
    },
    error: {
      color: '#e53e3e',
      padding: '15px',
      borderRadius: '8px',
      background: '#fed7d7',
      margin: '20px 0'
    },
    unreadBadge: {
      display: 'inline-block',
      background: '#4caf50',
      color: 'white',
      fontSize: '12px',
      fontWeight: 600,
      padding: '3px 8px',
      borderRadius: '10px',
      marginLeft: '10px'
    },
    mobileView: {
      display: 'block' as 'block'
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get sender display name
  const getSenderName = (letter: Letter) => {
    const senderTypeInfo = senderTypeMap[letter.senderType] || { name: 'Unknown', icon: '❓' };
    return letter.senderName || senderTypeInfo.name;
  };

  // Get sender icon
  const getSenderIcon = (letter: Letter) => {
    return senderTypeMap[letter.senderType]?.icon || '❓';
  };

  // Get letter preview (first 100 characters)
  const getLetterPreview = (content: string) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Letters</h1>
        <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading your letters...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <div style={styles.layout}>
          <div style={styles.lettersList}>
            <h2 style={{fontSize: '18px', marginBottom: '15px', color: '#2D3748'}}>
              Your Support Letters
            </h2>

            {letters.length === 0 ? (
              <div style={styles.noLettersMessage}>
                You don't have any letters yet. They'll appear here once your first letter is generated.
              </div>
            ) : (
              letters.map(letter => (
                <div 
                  key={letter.id}
                  style={styles.letterCard(
                    selectedLetter?.id === letter.id,
                    letter.readAt === null
                  )}
                  onClick={() => handleLetterClick(letter)}
                >
                  <div style={styles.letterCardHeader}>
                    <div style={styles.senderIcon}>{getSenderIcon(letter)}</div>
                    <div style={styles.senderName}>
                      {getSenderName(letter)}
                      {letter.readAt === null && <span style={styles.unreadBadge}>New</span>}
                    </div>
                  </div>
                  <div style={styles.letterPreview}>
                    {getLetterPreview(letter.content)}
                  </div>
                  <div style={styles.letterDate}>
                    {formatDate(letter.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={styles.letterDetail}>
            {selectedLetter ? (
              <>
                <div style={styles.letterDetailHeader}>
                  <div style={styles.letterDetailSender}>
                    <div style={styles.letterDetailSenderIcon}>
                      {getSenderIcon(selectedLetter)}
                    </div>
                    <div style={styles.letterDetailSenderName}>
                      {getSenderName(selectedLetter)}
                    </div>
                  </div>
                  
                  <div style={styles.letterDetailDateRow}>
                    <span style={styles.letterDetailDateLabel}>Received:</span>
                    <span>{formatDate(selectedLetter.createdAt)}</span>
                  </div>
                  
                  {selectedLetter.readAt && (
                    <div style={styles.letterDetailDateRow}>
                      <span style={styles.letterDetailDateLabel}>Read:</span>
                      <span>{formatDate(selectedLetter.readAt)}</span>
                    </div>
                  )}
                </div>
                
                <div style={styles.letterDetailContent}>
                  {selectedLetter.content}
                </div>
              </>
            ) : (
              <div style={styles.noSelectedMessage}>
                <div style={styles.noSelectedIcon}>📬</div>
                <p>Select a letter to read its contents</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Letters;
