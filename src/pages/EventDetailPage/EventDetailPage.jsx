import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, IconButton, Button, Divider,
  TextField, Rating, CircularProgress, Avatar, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { supabase } from '../../supabase';
import { useAuth } from '../../AuthContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRatingValue] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: ev }, { data: rv, error: rvErr }] = await Promise.all([
      supabase.from('anispot_events').select('*').eq('id', id).single(),
      supabase.from('anispot_reviews').select('*, anispot_profiles(display_name, avatar_url)').eq('event_id', id).order('created_at', { ascending: false }),
    ]);
    if (rvErr) console.error('후기 로딩 에러:', rvErr);

    if (ev) {
      setEvent(ev);
      supabase.from('anispot_events').update({ view_count: (ev.view_count || 0) + 1 }).eq('id', id);
      const { data: rel } = await supabase
        .from('anispot_events')
        .select('*')
        .eq('category', ev.category)
        .neq('id', id)
        .limit(4);
      setRelated(rel || []);
    }
    setReviews(rv || []);

    if (user) {
      const { data: fav } = await supabase
        .from('anispot_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', id)
        .maybeSingle();
      setFavorited(!!fav);
    }
    setLoading(false);
  };

  const handleFavorite = async () => {
    if (!user) { navigate('/login'); return; }
    if (favorited) {
      await supabase.from('anispot_favorites').delete().eq('user_id', user.id).eq('event_id', id);
    } else {
      await supabase.from('anispot_favorites').insert({ user_id: user.id, event_id: id });
    }
    setFavorited(!favorited);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await supabase.from('anispot_events').delete().eq('id', id);
    setDeleting(false);
    setDeleteOpen(false);
    navigate(-1);
  };

  const handleShare = () => {
    navigator.share?.({ title: event?.title, url: window.location.href }) || navigator.clipboard.writeText(window.location.href);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!reviewText.trim()) return;
    setSubmitting(true);

    const { error: insertError } = await supabase.from('anispot_reviews').insert({
      content: reviewText.trim(),
      rating,
      author_id: user.id,
      event_id: parseInt(id),
    });

    if (insertError) {
      console.error('후기 저장 실패:', insertError);
      setSubmitting(false);
      return;
    }

    setReviewText('');
    setRatingValue(5);

    // 저장 후 목록 재조회
    const { data, error: fetchError } = await supabase
      .from('anispot_reviews')
      .select('*, anispot_profiles(display_name, avatar_url)')
      .eq('event_id', id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('후기 조회 실패:', fetchError);
    } else {
      setReviews(data || []);
    }

    setSubmitting(false);
  };

  if (loading) return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress color="primary" />
    </Box>
  );
  if (!event) return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography color="text.secondary">행사를 찾을 수 없습니다.</Typography>
    </Box>
  );

  const categoryColors = { '애니메이션': '#E84040', '게임': '#7B2FBE', '버튜버': '#FF7EB3', '전시회': '#0288d1', '콜라보 카페': '#F57C00', '굿즈샵': '#2e7d32' };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', pb: 5 }}>
      {/* 포스터 - 화면 비율 기반 높이 */}
      <Box sx={{ position: 'relative', height: 'min(65vw, 320px)' }}>
        <Box
          component="img"
          src={event.poster_url || `https://picsum.photos/seed/${event.id}/400/600`}
          alt={event.title}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 25%, rgba(13,13,13,0.9) 80%, #0D0D0D 100%)' }} />

        {/* 상단 버튼 — safe area 적용 */}
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between',
          pt: 'max(env(safe-area-inset-top), 8px)', px: 1,
        }}>
          <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(6px)', minWidth: 44, minHeight: 44 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton onClick={handleShare} sx={{ bgcolor: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(6px)', minWidth: 44, minHeight: 44 }}>
              <ShareIcon />
            </IconButton>
            <IconButton onClick={handleFavorite} sx={{ bgcolor: 'rgba(0,0,0,0.55)', color: favorited ? '#FFD93D' : '#fff', backdropFilter: 'blur(6px)', minWidth: 44, minHeight: 44 }}>
              {favorited ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 2, pt: 2 }}>
        {/* 카테고리 + 상태 */}
        <Box sx={{ display: 'flex', gap: 0.75, mb: 1, flexWrap: 'wrap' }}>
          <Chip label={event.category} size="small" sx={{ bgcolor: categoryColors[event.category] || '#E84040', color: '#fff', fontWeight: 700, borderRadius: 1, fontSize: '0.72rem', height: 24 }} />
          <StatusBadge startDate={event.start_date} endDate={event.end_date} />
        </Box>

        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem', lineHeight: 1.3, mb: 1.5 }}>{event.title}</Typography>

        {/* 기본 정보 카드 */}
        <Box sx={{ bgcolor: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 2, p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <CalendarTodayIcon sx={{ color: 'primary.main', fontSize: '1rem', flexShrink: 0 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>
                {new Date(event.start_date).toLocaleDateString('ko-KR')} ~ {new Date(event.end_date).toLocaleDateString('ko-KR')}
              </Typography>
            </Box>
            {event.operating_hours && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <AccessTimeIcon sx={{ color: 'primary.main', fontSize: '1rem', flexShrink: 0 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>{event.operating_hours}</Typography>
              </Box>
            )}
            {event.venue && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <LocationOnIcon sx={{ color: 'primary.main', fontSize: '1rem', flexShrink: 0, mt: 0.15 }} />
                <Box>
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{event.venue}</Typography>
                  {event.address && <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', mt: 0.25 }}>{event.address}</Typography>}
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* 지도/길찾기 버튼 */}
        {event.address && (
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LocationOnIcon />}
            onClick={() => window.open(`https://map.kakao.com/?q=${encodeURIComponent(event.address)}`, '_blank')}
            sx={{ mb: 2, height: 48, borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}
          >
            카카오맵으로 길찾기
          </Button>
        )}

        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

        {/* 행사 설명 */}
        {event.description && (
          <>
            <Typography variant="h4" sx={{ color: '#fff', mb: 1 }}>행사 소개</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2, whiteSpace: 'pre-line' }}>{event.description}</Typography>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
          </>
        )}

        {/* 공식 링크 */}
        {event.official_link && (
          <Button
            variant="contained"
            fullWidth
            endIcon={<OpenInNewIcon />}
            onClick={() => window.open(event.official_link, '_blank')}
            sx={{ mb: 2 }}
          >
            공식 사이트 방문
          </Button>
        )}

        {/* 삭제 버튼 — 작성자에게만 표시 */}
        {user && event.author_id === user.id && (
          <>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
            <Button
              variant="outlined"
              fullWidth
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setDeleteOpen(true)}
              sx={{
                height: 48,
                color: '#ff5555',
                borderColor: 'rgba(255,85,85,0.35)',
                '&:hover': { borderColor: '#ff5555', bgcolor: 'rgba(255,85,85,0.06)' },
              }}
            >
              행사 삭제
            </Button>
          </>
        )}

        {/* 관련 행사 */}
        {related.length > 0 && (
          <>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
            <Typography variant="h4" sx={{ color: '#fff', mb: 1.5 }}>관련 행사</Typography>
            <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' }, mb: 2 }}>
              {related.map((ev) => (
                <Box
                  key={ev.id}
                  onClick={() => navigate(`/events/${ev.id}`)}
                  sx={{ flexShrink: 0, width: 120, cursor: 'pointer' }}
                >
                  <Box
                    component="img"
                    src={ev.poster_url || `https://picsum.photos/seed/${ev.id}/240/360`}
                    alt={ev.title}
                    sx={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: 1 }}
                  />
                  <Typography sx={{ fontSize: '0.72rem', color: '#fff', fontWeight: 600, mt: 0.5 }} noWrap>{ev.title}</Typography>
                </Box>
              ))}
            </Box>
          </>
        )}

        {/* 후기 섹션 */}
        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
        <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>후기 {reviews.length > 0 ? `(${reviews.length})` : ''}</Typography>

        {user && (
          <Box component="form" onSubmit={handleReview} sx={{ mb: 3, p: 2, bgcolor: '#1A1A1A', borderRadius: 2, border: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>만족도</Typography>
            <Rating value={rating} onChange={(_, v) => setRatingValue(v || 1)} sx={{ mb: 1.5, '& .MuiRating-iconFilled': { color: '#FFD93D' } }} />
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="방문 후기를 작성해주세요..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              sx={{ mb: 1.5 }}
            />
            <Button type="submit" variant="contained" size="small" disabled={submitting}>
              {submitting ? <CircularProgress size={16} /> : '후기 등록'}
            </Button>
          </Box>
        )}

        {reviews.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}>
            아직 후기가 없습니다. 첫 번째 후기를 남겨보세요!
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reviews.map((review) => (
              <Box key={review.id} sx={{ p: 2, bgcolor: '#1A1A1A', borderRadius: 2, border: '1px solid rgba(255,255,255,0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                    {(review.anispot_profiles?.display_name || '?')[0]}
                  </Avatar>
                  <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                    {review.anispot_profiles?.display_name || '익명'}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" sx={{ ml: 'auto', '& .MuiRating-iconFilled': { color: '#FFD93D' } }} />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>{review.content}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', mt: 0.5, display: 'block' }}>
                  {new Date(review.created_at).toLocaleDateString('ko-KR')}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteOpen}
        onClose={() => !deleting && setDeleteOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1E1E1E',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            mx: 2,
            width: '100%',
          },
        }}
      >
        <DialogTitle sx={{ color: '#fff', fontWeight: 800, pb: 1 }}>
          행사를 삭제하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            <Box component="span" sx={{ color: '#fff', fontWeight: 700 }}>
              {event.title}
            </Box>
            을(를) 삭제하면 복구할 수 없습니다.{'\n'}
            즐겨찾기, 후기도 모두 함께 삭제됩니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2.5, gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setDeleteOpen(false)}
            disabled={deleting}
            sx={{
              height: 48,
              color: 'rgba(255,255,255,0.7)',
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            취소
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleDelete}
            disabled={deleting}
            sx={{
              height: 48,
              bgcolor: '#E84040',
              '&:hover': { bgcolor: '#C0392B' },
            }}
          >
            {deleting ? <CircularProgress size={20} color="inherit" /> : '삭제'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EventDetailPage;
