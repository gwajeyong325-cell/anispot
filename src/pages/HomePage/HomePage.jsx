import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, IconButton, InputBase, Chip,
  CircularProgress, Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { supabase } from '../../supabase';
import EventCard from '../../components/EventCard/EventCard';

const CATEGORIES = ['전체', '애니메이션', '게임', '버튜버', '전시회', '콜라보 카페', '굿즈샵'];

function HomePage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('전체');

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const fetchEvents = async () => {
    setLoading(true);
    let query = supabase
      .from('anispot_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (category !== '전체') query = query.eq('category', category);

    const { data } = await query.limit(20);
    setEvents(data || []);
    setLoading(false);
  };

  const todayEndingEvents = events.filter(e => {
    const end = new Date(e.end_date);
    const now = new Date();
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return daysLeft >= 0 && daysLeft <= 3;
  });

  const hotEvents = [...events].sort((a, b) => b.view_count - a.view_count).slice(0, 6);
  const latestEvents = events.slice(0, 6);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', pb: '80px' }}>
      {/* 헤더 */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          bgcolor: 'rgba(13,13,13,0.97)',
          backdropFilter: 'blur(12px)',
          px: 2,
          pt: 'max(env(safe-area-inset-top), 12px)',
          pb: 0,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* 로고 + 알림 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>
          <Typography sx={{ color: 'primary.main', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '0.06em' }}>
            ANISPOT
          </Typography>
          <IconButton sx={{ color: 'text.secondary', p: 1, minWidth: 44, minHeight: 44 }}>
            <NotificationsNoneIcon />
          </IconButton>
        </Box>

        {/* 검색창 */}
        <Box
          onClick={() => navigate('/events')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#1E1E1E',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            px: 1.5,
            height: 44,
            cursor: 'pointer',
            mb: 1.5,
            mt: 1,
          }}
        >
          <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)', mr: 1, fontSize: '1.1rem' }} />
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
            행사, 팝업, 카페 검색...
          </Typography>
        </Box>

        {/* 카테고리 필터 */}
        <Box sx={{ display: 'flex', gap: 0.75, overflowX: 'auto', pb: 1.5, mx: -2, px: 2 }}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setCategory(cat)}
              sx={{
                height: 32,
                bgcolor: category === cat ? 'primary.main' : 'rgba(255,255,255,0.06)',
                color: category === cat ? '#fff' : 'rgba(255,255,255,0.6)',
                fontWeight: 700,
                fontSize: '0.75rem',
                flexShrink: 0,
                border: category === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                '&:hover': { bgcolor: category === cat ? 'primary.dark' : 'rgba(255,255,255,0.1)' },
              }}
            />
          ))}
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
          <CircularProgress color="primary" size={36} />
        </Box>
      ) : (
        <Box>
          {/* 종료 임박 배너 */}
          {todayEndingEvents.length > 0 && (
            <Box sx={{ px: 2, pt: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'rgba(232,64,64,0.1)',
                  border: '1px solid rgba(232,64,64,0.25)',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTimeIcon sx={{ color: 'primary.main', fontSize: '0.9rem', mr: 0.5 }} />
                  <Typography sx={{ fontSize: '0.8rem', color: 'primary.main', fontWeight: 700 }}>
                    곧 종료되는 행사
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', mx: -1.5, px: 1.5 }}>
                  {todayEndingEvents.map((event) => (
                    <Box
                      key={event.id}
                      onClick={() => navigate(`/events/${event.id}`)}
                      sx={{
                        flexShrink: 0,
                        width: 'min(44vw, 160px)',
                        p: 1,
                        bgcolor: 'rgba(255,255,255,0.06)',
                        borderRadius: 1.5,
                        cursor: 'pointer',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }} noWrap>
                        {event.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', mt: 0.25 }}>
                        {new Date(event.end_date).toLocaleDateString('ko-KR')} 종료
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {/* 이번 주 HOT 행사 */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 1.5 }}>
              <WhatshotIcon sx={{ color: 'primary.main', mr: 0.75, fontSize: '1.2rem' }} />
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>
                이번 주 HOT 행사
              </Typography>
            </Box>
            {/* 첫 카드를 크게, 나머지는 가로 스크롤 */}
            <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', px: 2, pb: 0.5 }}>
              {hotEvents.map((event, idx) => (
                <Box
                  key={event.id}
                  sx={{ flexShrink: 0, width: idx === 0 ? 'min(52vw, 200px)' : 'min(38vw, 148px)' }}
                >
                  <EventCard event={event} />
                </Box>
              ))}
            </Box>
          </Box>

          {/* 최신 행사 */}
          <Box sx={{ mt: 3, px: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>
                최신 행사
              </Typography>
              <Box
                onClick={() => navigate('/events')}
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', minHeight: 44, px: 1 }}
              >
                <Typography sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.8rem' }}>
                  전체보기
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={1.5}>
              {latestEvents.map((event) => (
                <Grid size={6} key={event.id}>
                  <EventCard event={event} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}


      {/* FAB: 행사 등록 */}
      <Box
        onClick={() => navigate('/events/create')}
        sx={{
          position: 'fixed',
          bottom: 'calc(72px + env(safe-area-inset-bottom))',
          right: 'calc(50% - min(240px, 50vw) + 16px)',
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #E84040 0%, #C0392B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(232,64,64,0.45)',
          zIndex: 999,
          '&:active': { transform: 'scale(0.93)' },
          transition: 'transform 0.1s',
        }}
      >
        <Typography sx={{ color: '#fff', fontSize: '1.6rem', lineHeight: 1, fontWeight: 300 }}>+</Typography>
      </Box>
    </Box>
  );
}

export default HomePage;
