import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StatusBadge from '../StatusBadge/StatusBadge';
import { supabase } from '../../supabase';
import { useAuth } from '../../AuthContext';

function EventCard({ event, isFavorited = false, onFavoriteChange }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(isFavorited);

  const handleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }

    if (favorited) {
      await supabase
        .from('anispot_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', event.id);
    } else {
      await supabase
        .from('anispot_favorites')
        .insert({ user_id: user.id, event_id: event.id });
    }
    setFavorited(!favorited);
    onFavoriteChange?.(!favorited);
  };

  const categoryColors = {
    '애니메이션': '#E84040',
    '게임': '#7B2FBE',
    '버튜버': '#FF7EB3',
    '전시회': '#0288d1',
    '콜라보 카페': '#F57C00',
    '굿즈샵': '#2e7d32',
  };

  return (
    <Box
      onClick={() => navigate(`/events/${event.id}`)}
      sx={{
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        aspectRatio: '2/3',
        bgcolor: '#1A1A1A',
        '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' },
        transition: 'transform 0.2s',
      }}
    >
      <Box
        component="img"
        src={event.poster_url || `https://picsum.photos/seed/${event.id}/400/600`}
        alt={event.title}
        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => { e.target.src = `https://picsum.photos/seed/${event.id}/400/600`; }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 40%, transparent 70%)',
        }}
      />
      <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
        <StatusBadge startDate={event.start_date} endDate={event.end_date} />
      </Box>
      <IconButton
        onClick={handleFavorite}
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          color: favorited ? '#FFD93D' : 'rgba(255,255,255,0.8)',
          p: 0.5,
        }}
      >
        {favorited ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
      </IconButton>
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 1.5 }}>
        <Box
          sx={{
            display: 'inline-block',
            bgcolor: categoryColors[event.category] || '#E84040',
            px: 0.75,
            py: 0.25,
            borderRadius: 0.5,
            mb: 0.5,
          }}
        >
          <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#fff' }}>
            {event.category}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, color: '#fff', fontSize: '0.8rem', lineHeight: 1.3 }}
          noWrap
        >
          {event.title}
        </Typography>
        <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', mt: 0.3 }} noWrap>
          {event.venue}
        </Typography>
      </Box>
    </Box>
  );
}

export default EventCard;
