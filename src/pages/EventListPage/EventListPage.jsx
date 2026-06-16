import { useState, useEffect } from 'react';
import {
  Box, Typography, InputBase, Chip, Grid, CircularProgress,
  MenuItem, Select, FormControl, IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import EventCard from '../../components/EventCard/EventCard';

const CATEGORIES = ['전체', '애니메이션', '게임', '버튜버', '전시회', '콜라보 카페', '굿즈샵'];
const REGIONS = ['전체', '서울', '경기', '인천', '부산', '대구', '기타'];

function EventListPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('전체');
  const [region, setRegion] = useState('전체');
  const [sort, setSort] = useState('latest');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [category, region, sort]);

  const fetchEvents = async () => {
    setLoading(true);
    let query = supabase.from('anispot_events').select('*');
    if (category !== '전체') query = query.eq('category', category);
    if (region !== '전체') query = query.ilike('address', `%${region}%`);
    if (sort === 'latest') query = query.order('created_at', { ascending: false });
    else if (sort === 'popular') query = query.order('view_count', { ascending: false });
    else if (sort === 'start_date') query = query.order('start_date', { ascending: true });

    const { data } = await query.limit(50);
    setEvents(data || []);
    setLoading(false);
  };

  const filtered = search
    ? events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.venue?.toLowerCase().includes(search.toLowerCase()))
    : events;

  const selectSx = {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.78rem',
    bgcolor: 'rgba(255,255,255,0.06)',
    height: 36,
    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
    '.MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', pb: '80px' }}>
      {/* 헤더 */}
      <Box sx={{
        position: 'sticky', top: 0, zIndex: 100,
        bgcolor: 'rgba(13,13,13,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* 타이틀 행 */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, pt: 'max(env(safe-area-inset-top), 8px)', height: 52, gap: 0.5 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 44, minHeight: 44 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>행사 탐색</Typography>
        </Box>

        {/* 검색창 */}
        <Box sx={{ px: 2, pb: 1 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center',
            bgcolor: '#1E1E1E', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', px: 1.5, height: 44,
          }}>
            <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)', mr: 1, fontSize: '1.1rem', flexShrink: 0 }} />
            <InputBase
              placeholder="행사명, 장소 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1, color: '#fff', fontSize: '0.9rem' }}
            />
          </Box>
        </Box>

        {/* 카테고리 칩 */}
        <Box sx={{ display: 'flex', gap: 0.75, overflowX: 'auto', px: 2, pb: 1 }}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setCategory(cat)}
              sx={{
                height: 32, flexShrink: 0, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700,
                bgcolor: category === cat ? 'primary.main' : 'rgba(255,255,255,0.06)',
                color: category === cat ? '#fff' : 'rgba(255,255,255,0.6)',
                border: category === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </Box>

        {/* 지역 + 정렬 + 결과수 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, pb: 1.5 }}>
          <FormControl size="small">
            <Select value={region} onChange={(e) => setRegion(e.target.value)} sx={selectSx}>
              {REGIONS.map(r => <MenuItem key={r} value={r} sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.87)' }}>{r}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small">
            <Select value={sort} onChange={(e) => setSort(e.target.value)} sx={selectSx}>
              <MenuItem value="latest" sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.87)' }}>최신순</MenuItem>
              <MenuItem value="popular" sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.87)' }}>인기순</MenuItem>
              <MenuItem value="start_date" sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.87)' }}>날짜순</MenuItem>
            </Select>
          </FormControl>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', ml: 'auto' }}>
            {filtered.length}개
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
          <CircularProgress color="primary" size={36} />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', pt: 10 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>검색 결과가 없어요</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)', mt: 1 }}>다른 키워드로 검색해보세요</Typography>
        </Box>
      ) : (
        <Box sx={{ px: 2, pt: 2 }}>
          <Grid container spacing={1.5}>
            {filtered.map((event) => (
              <Grid size={6} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

    </Box>
  );
}

export default EventListPage;
