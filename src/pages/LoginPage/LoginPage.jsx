import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Divider,
  Tabs, Tab, Alert, CircularProgress,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { supabase } from '../../supabase';

function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else navigate('/');
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, display_name: username } },
    });
    if (error) setError(error.message);
    else setMessage('가입 확인 이메일을 발송했습니다. 이메일을 확인해주세요!');
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/anispot/' },
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 배경 포스터 */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://picsum.photos/seed/anispot-bg/400/800)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(4px) brightness(0.3)',
        }}
      />

      {/* 헤더 로고 */}
      <Box sx={{ position: 'relative', zIndex: 1, pt: 'max(env(safe-area-inset-top), 48px)', pb: 3, textAlign: 'center' }}>
        <Typography
          variant="h1"
          sx={{
            color: 'primary.main',
            fontWeight: 900,
            fontSize: '2.8rem',
            letterSpacing: '0.05em',
            textShadow: '0 0 30px rgba(232,64,64,0.5)',
          }}
        >
          ANISPOT
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
          서브컬처 행사 정보의 모든 것
        </Typography>
      </Box>

      {/* 폼 영역 */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          bgcolor: 'rgba(26,26,26,0.95)',
          borderRadius: '20px 20px 0 0',
          p: 3,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => { setTab(v); setError(''); setMessage(''); }}
          variant="fullWidth"
          sx={{
            mb: 3,
            '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', fontWeight: 700 },
            '& .Mui-selected': { color: 'primary.main' },
            '& .MuiTabs-indicator': { bgcolor: 'primary.main', height: 3 },
          }}
        >
          <Tab label="로그인" />
          <Tab label="회원가입" />
        </Tabs>

        {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(232,64,64,0.1)', color: '#FF6B6B' }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        <Box component="form" onSubmit={tab === 0 ? handleLogin : handleSignup}>
          {tab === 1 && (
            <TextField
              fullWidth
              label="닉네임"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
          )}
          <TextField
            fullWidth
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5, fontSize: '1rem' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : (tab === 0 ? '로그인' : '회원가입')}
          </Button>
        </Box>

        <Divider sx={{ my: 3, color: 'text.secondary', fontSize: '0.75rem' }}>또는</Divider>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleGoogle}
          sx={{
            py: 1.5,
            color: '#fff',
            borderColor: 'rgba(255,255,255,0.2)',
            '&:hover': { borderColor: 'rgba(255,255,255,0.4)', bgcolor: 'rgba(255,255,255,0.05)' },
          }}
        >
          Google로 계속하기
        </Button>
      </Box>
    </Box>
  );
}

export default LoginPage;
