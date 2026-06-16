import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Avatar, Button, Tab, Tabs,
  Grid, CircularProgress, Divider,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '../../supabase';
import { useAuth } from '../../AuthContext';
import BottomNav from '../../components/BottomNav/BottomNav';
import EventCard from '../../components/EventCard/EventCard';

function MyPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: prof }, { data: favs }, { data: evs }, { data: revs }] = await Promise.all([
      supabase.from('anispot_profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('anispot_favorites').select('*, anispot_events(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('anispot_events').select('*').eq('author_id', user.id).order('created_at', { ascending: false }),
      supabase.from('anispot_reviews').select('*, anispot_events(title, poster_url)').eq('author_id', user.id).order('created_at', { ascending: false }),
    ]);
    setProfile(prof);
    setFavorites((favs || []).map(f => f.anispot_events).filter(Boolean));
    setMyEvents(evs || []);
    setMyReviews(revs || []);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) return null;

  const displayName = profile?.display_name || user.email?.split('@')[0] || '사용자';
  const username = profile?.username || user.email?.split('@')[0];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      {/* 프로필 헤더 */}
      <Box sx={{ p: 3, background: 'linear-gradient(180deg, rgba(232,64,64,0.15) 0%, transparent 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800 }}>마이페이지</Typography>
          <Button
            variant="text"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleSignOut}
            sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
          >
            로그아웃
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={profile?.avatar_url}
            sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem', border: '3px solid rgba(232,64,64,0.5)' }}
          >
            {displayName[0]}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800 }}>{displayName}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>@{username}</Typography>
            {profile?.bio && (
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>{profile.bio}</Typography>
            )}
          </Box>
        </Box>

        {/* 통계 */}
        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
          {[['즐겨찾기', favorites.length], ['등록 행사', myEvents.length], ['후기', myReviews.length]].map(([label, count]) => (
            <Box key={label} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 800 }}>{count}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* 탭 */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="fullWidth"
        sx={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          '& .MuiTab-root': { color: 'text.secondary', fontWeight: 600, fontSize: '0.8rem' },
          '& .Mui-selected': { color: 'primary.main' },
          '& .MuiTabs-indicator': { bgcolor: 'primary.main' },
        }}
      >
        <Tab label="즐겨찾기" />
        <Tab label="내 행사" />
        <Tab label="후기" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Box sx={{ px: 2, pt: 2 }}>
          {/* 즐겨찾기 */}
          {tab === 0 && (
            favorites.length === 0 ? (
              <Box sx={{ textAlign: 'center', pt: 6 }}>
                <Typography variant="h3" sx={{ color: 'text.secondary', mb: 1 }}>저장된 행사가 없어요</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>마음에 드는 행사를 저장해보세요!</Typography>
                <Button variant="contained" onClick={() => navigate('/events')}>행사 탐색하기</Button>
              </Box>
            ) : (
              <Grid container spacing={1.5}>
                {favorites.map((event) => (
                  <Grid item xs={6} key={event.id}>
                    <EventCard event={event} isFavorited={true} />
                  </Grid>
                ))}
              </Grid>
            )
          )}

          {/* 내 행사 */}
          {tab === 1 && (
            <>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AddIcon />}
                onClick={() => navigate('/events/create')}
                sx={{ mb: 2, color: 'primary.main', borderColor: 'primary.main' }}
              >
                새 행사 등록
              </Button>
              {myEvents.length === 0 ? (
                <Box sx={{ textAlign: 'center', pt: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>등록한 행사가 없어요</Typography>
                </Box>
              ) : (
                <Grid container spacing={1.5}>
                  {myEvents.map((event) => (
                    <Grid item xs={6} key={event.id}>
                      <EventCard event={event} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}

          {/* 내 후기 */}
          {tab === 2 && (
            myReviews.length === 0 ? (
              <Box sx={{ textAlign: 'center', pt: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>작성한 후기가 없어요</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {myReviews.map((review) => (
                  <Box
                    key={review.id}
                    onClick={() => navigate(`/events/${review.event_id}`)}
                    sx={{ p: 2, bgcolor: '#1A1A1A', borderRadius: 2, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
                  >
                    <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, mb: 0.5 }} noWrap>
                      {review.anispot_events?.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>{review.content}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                      {new Date(review.created_at).toLocaleDateString('ko-KR')} · 별점 {review.rating}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )
          )}
        </Box>
      )}

      <BottomNav />
    </Box>
  );
}

export default MyPage;
