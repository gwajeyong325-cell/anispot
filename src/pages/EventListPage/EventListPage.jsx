import { useState, useEffect } from 'react';
import {
  Box, Typography, InputBase, Chip, Grid, CircularProgress,
  MenuItem, Select, FormControl, IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import BottomNav from '../../components/BottomNav/BottomNav';
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

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      {/* 헤더 */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: '#0D0D0D', px: 2, pt: 2, pb: 1, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'text.secondary', p: 0.5 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800 }}>행사 탐색</Typography>
        </Box>

        {/* 검색창 */}
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, px: 1.5, py: 0.75, mb: 1.5 }}>
          <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1.1rem' }} />
          <InputBase
            placeholder="행사명, 장소 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, color: '#fff', fontSize: '0.9rem' }}
          />
        </Box>

        {/* 카테고리 */}
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5, mb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
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
              }}
            />
          ))}
        </Box>

        {/* 지역 + 정렬 */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              sx={{ color: 'text.secondary', fontSize: '0.75rem', bgcolor: '#1A1A1A', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
            >
              {REGIONS.map(r => <MenuItem key={r} value={r} sx={{ fontSize: '0.8rem' }}>{r}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              sx={{ color: 'text.secondary', fontSize: '0.75rem', bgcolor: '#1A1A1A', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
            >
              <MenuItem value="latest" sx={{ fontSize: '0.8rem' }}>최신순</MenuItem>
              <MenuItem value="popular" sx={{ fontSize: '0.8rem' }}>인기순</MenuItem>
              <MenuItem value="start_date" sx={{ fontSize: '0.8rem' }}>날짜순</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'center', ml: 'auto' }}>
            {filtered.length}개
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', pt: 10 }}>
          <Typography variant="h3" sx={{ color: 'text.secondary' }}>검색 결과가 없어요</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>다른 키워드로 검색해보세요</Typography>
        </Box>
      ) : (
        <Box sx={{ px: 2, pt: 2 }}>
          <Grid container spacing={1.5}>
            {filtered.map((event) => (
              <Grid item xs={6} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <BottomNav />
    </Box>
  );
}

export default EventListPage;
