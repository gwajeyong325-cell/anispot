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
import BottomNav from '../../components/BottomNav/BottomNav';
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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      {/* 헤더 */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          bgcolor: '#0D0D0D',
          px: 2,
          pt: 2,
          pb: 1,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography
            variant="h2"
            sx={{
              color: 'primary.main',
              fontWeight: 900,
              fontSize: '1.6rem',
              letterSpacing: '0.04em',
            }}
          >
            ANISPOT
          </Typography>
          <IconButton sx={{ color: 'text.secondary' }}>
            <NotificationsNoneIcon />
          </IconButton>
        </Box>

        {/* 검색창 */}
        <Box
          onClick={() => navigate('/events')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#1A1A1A',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
            px: 1.5,
            py: 0.75,
            cursor: 'pointer',
            mb: 1.5,
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1.1rem' }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            행사, 팝업, 카페 검색...
          </Typography>
        </Box>

        {/* 카테고리 필터 */}
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5, '&::-webkit-scrollbar': { display: 'none' } }}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setCategory(cat)}
              size="small"
              sx={{
                bgcolor: category === cat ? 'primary.main' : 'rgba(255,255,255,0.07)',
                color: category === cat ? '#fff' : 'text.secondary',
                fontWeight: 600,
                flexShrink: 0,
                border: category === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: category === cat ? 'primary.dark' : 'rgba(255,255,255,0.12)' },
              }}
            />
          ))}
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Box sx={{ px: 2 }}>
          {/* 종료 임박 배너 */}
          {todayEndingEvents.length > 0 && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'rgba(232,64,64,0.12)',
                border: '1px solid rgba(232,64,64,0.3)',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon sx={{ color: 'primary.main', fontSize: '1rem', mr: 0.5 }} />
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700 }}>
                  곧 종료되는 행사
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
                {todayEndingEvents.map((event) => (
                  <Box
                    key={event.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    sx={{
                      flexShrink: 0,
                      width: 140,
                      p: 1,
                      bgcolor: '#1A1A1A',
                      borderRadius: 1.5,
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }} noWrap>
                      {event.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                      {new Date(event.end_date).toLocaleDateString('ko-KR')} 종료
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* 이번 주 HOT 행사 */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <WhatshotIcon sx={{ color: 'primary.main', mr: 0.5 }} />
              <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800 }}>
                이번 주 HOT 행사
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
              {hotEvents.map((event) => (
                <Box key={event.id} sx={{ flexShrink: 0, width: 140 }}>
                  <EventCard event={event} />
                </Box>
              ))}
            </Box>
          </Box>

          {/* 최신 행사 */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800 }}>
                최신 행사
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => navigate('/events')}
              >
                전체보기
              </Typography>
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

      <BottomNav />

      {/* FAB: 행사 등록 */}
      <Box
        onClick={() => navigate('/events/create')}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #E84040 0%, #C0392B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(232,64,64,0.5)',
          zIndex: 999,
          '&:active': { transform: 'scale(0.95)' },
        }}
      >
        <Typography sx={{ color: '#fff', fontSize: '1.5rem', lineHeight: 1, fontWeight: 300 }}>+</Typography>
      </Box>
    </Box>
  );
}

export default HomePage;
