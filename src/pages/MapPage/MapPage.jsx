import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { supabase } from '../../supabase';
import StatusBadge from '../../components/StatusBadge/StatusBadge';

const REGIONS = ['전체', '서울', '경기', '인천', '부산', '대구', '기타'];

function MapPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState('전체');

  useEffect(() => {
    fetchEvents();
  }, [region]);

  const fetchEvents = async () => {
    setLoading(true);
    let query = supabase.from('anispot_events').select('*').order('start_date');
    if (region !== '전체') query = query.ilike('address', `%${region}%`);
    const { data } = await query.limit(30);
    setEvents(data || []);
    setLoading(false);
  };

  const groupByRegion = (events) => {
    const groups = {};
    events.forEach(e => {
      const addr = e.address || '';
      let key = '기타';
      if (addr.includes('서울')) key = '서울';
      else if (addr.includes('경기')) key = '경기';
      else if (addr.includes('인천')) key = '인천';
      else if (addr.includes('부산')) key = '부산';
      else if (addr.includes('대구')) key = '대구';
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return groups;
  };

  const grouped = region === '전체' ? groupByRegion(events) : { [region]: events };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', pb: '80px' }}>
      <Box sx={{ px: 2, pt: 'max(env(safe-area-inset-top), 16px)', pb: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', mb: 0.25 }}>지역별 행사</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>내 주변 행사를 찾아보세요</Typography>
      </Box>

      {/* 지역 필터 */}
      <Box sx={{ px: 2, py: 1.5, display: 'flex', gap: 1, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' }, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {REGIONS.map(r => (
          <Chip
            key={r}
            label={r}
            onClick={() => setRegion(r)}
            size="small"
            sx={{
              flexShrink: 0,
              bgcolor: region === r ? 'primary.main' : 'rgba(255,255,255,0.07)',
              color: region === r ? '#fff' : 'text.secondary',
              fontWeight: 600,
              border: region === r ? 'none' : '1px solid rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : events.length === 0 ? (
        <Box sx={{ textAlign: 'center', pt: 10 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>해당 지역의 행사가 없습니다</Typography>
        </Box>
      ) : (
        <Box sx={{ px: 2, pt: 2 }}>
          {Object.entries(grouped).map(([regionKey, regionEvents]) => (
            <Box key={regionKey} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                <LocationOnIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800 }}>
                  {regionKey} <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>({regionEvents.length}개)</Typography>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {regionEvents.map((event) => (
                  <Box
                    key={event.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    sx={{ display: 'flex', gap: 1.5, p: 1.5, bgcolor: '#1A1A1A', borderRadius: 2, border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', alignItems: 'center', '&:hover': { border: '1px solid rgba(232,64,64,0.3)' } }}
                  >
                    <Box component="img"
                      src={event.poster_url || `https://picsum.photos/seed/${event.id}/60/90`}
                      alt={event.title}
                      sx={{ width: 44, height: 66, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700, mb: 0.25 }} noWrap>{event.title}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.25 }} noWrap>{event.venue}</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 0.5 }} noWrap>{event.address}</Typography>
                      <StatusBadge startDate={event.start_date} endDate={event.end_date} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}

    </Box>
  );
}

export default MapPage;
