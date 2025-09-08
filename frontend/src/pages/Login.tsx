// Login Page with night theme
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // Night theme styling
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #4A5568, #2D3748, #1A202C, #000000)',
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: 'white'
    },
    form: {
      width: '100%',
      maxWidth: '400px',
      padding: '30px',
      borderRadius: '24px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: '20px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 600,
      marginBottom: '10px',
      textAlign: 'center' as 'center'
    },
    message: {
      fontSize: '16px',
      fontWeight: 400,
      marginBottom: '20px',
      textAlign: 'center' as 'center'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      marginBottom: '15px'
    },
    label: {
      marginBottom: '8px',
      fontSize: '16px'
    },
    input: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    button: {
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(90deg, #667EEA, #764BA2)',
      color: 'white',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px'
    },
    error: {
      color: '#FFA07A',
      textAlign: 'center' as 'center',
      marginTop: '10px'
    },
    link: {
      color: '#667EEA',
      textAlign: 'center' as 'center',
      textDecoration: 'none',
      marginTop: '20px',
      fontSize: '14px'
    },
    icon: {
      fontSize: '32px',
      marginBottom: '10px',
      textAlign: 'center' as 'center'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <div style={styles.icon}>🌙✨</div>
        <h1 style={styles.title}>Your Yoda</h1>
        <p style={styles.message}>
          お疲れ様でした - 一日の終わりに、明日への準備をしませんか？
          <br />
          <small>Ready to prepare for tomorrow at the end of your day?</small>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input 
              style={styles.input}
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input 
              style={styles.input}
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          {error && <div style={styles.error}>{error}</div>}
          
          <button 
            style={styles.button} 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <Link to="/register" style={styles.link}>
          New user? Create an account
        </Link>
      </div>
    </div>
  );
};

export default Login;
