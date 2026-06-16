import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Divider,
  Tabs, Tab, Alert, CircularProgress,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { supabase } from '../../supabase';

const DEMO_EMAIL = 'demo@anispot.kr';
const DEMO_PASSWORD = 'demo1234!';

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

  const handleDemo = async () => {
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    if (error) setError('데모 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
    else navigate('/');
    setLoading(false);
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
          pb: 'calc(80px + env(safe-area-inset-bottom) + 16px)',
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

        <Divider sx={{ my: 2.5, color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>또는</Divider>

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

        {/* 데모 체험 */}
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: '1px dashed rgba(255,215,61,0.35)',
            borderRadius: 2,
            bgcolor: 'rgba(255,215,61,0.04)',
          }}
        >
          <Button
            variant="contained"
            fullWidth
            startIcon={loading ? null : <PlayArrowIcon />}
            onClick={handleDemo}
            disabled={loading}
            sx={{
              py: 1.4,
              mb: 1.25,
              background: 'linear-gradient(135deg, #FFD93D 0%, #F0B800 100%)',
              color: '#111',
              fontWeight: 800,
              fontSize: '0.95rem',
              '&:hover': { background: 'linear-gradient(135deg, #FFE566 0%, #FFD93D 100%)' },
              '&.Mui-disabled': { bgcolor: 'rgba(255,215,61,0.3)', color: 'rgba(0,0,0,0.4)' },
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#111' }} /> : '데모 계정으로 체험하기'}
          </Button>
          <Typography
            sx={{
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.4)',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            로그인 없이 모든 기능을 체험할 수 있어요.{'\n'}
            데모 계정의 데이터는 공유되며 초기화될 수 있습니다.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
