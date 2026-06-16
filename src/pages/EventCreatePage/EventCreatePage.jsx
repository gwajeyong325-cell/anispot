import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, MenuItem,
  MobileStepper, CircularProgress, Chip, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from '../../supabase';
import { useAuth } from '../../AuthContext';

const CATEGORIES = ['애니메이션', '게임', '버튜버', '전시회', '콜라보 카페', '굿즈샵'];
const STEPS = ['기본 정보', '포스터 이미지', '장소 & 시간', '행사 일정', '공식 링크'];

function EventCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', category: '', description: '',
    poster_url: '',
    venue: '', address: '', operating_hours: '',
    start_date: '', end_date: '',
    official_link: '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const canNext = () => {
    if (step === 0) return form.title && form.category;
    if (step === 2) return form.venue;
    if (step === 3) return form.start_date && form.end_date;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { data, error } = await supabase.from('anispot_events').insert({
      ...form,
      author_id: user.id,
    }).select().single();

    setSubmitting(false);
    if (!error && data) navigate(`/events/${data.id}`);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh' }}>
      {/* 헤더 */}
      <Box sx={{ px: 1, pt: 'max(env(safe-area-inset-top), 8px)', pb: 1, display: 'flex', alignItems: 'center', gap: 0.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <IconButton onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)} sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 44, minHeight: 44 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>행사 등록</Typography>
          <Typography sx={{ color: 'primary.main', fontSize: '0.75rem' }}>STEP {step + 1}/{STEPS.length} — {STEPS[step]}</Typography>
        </Box>
      </Box>

      {/* 스텝바 */}
      <MobileStepper
        variant="dots"
        steps={STEPS.length}
        position="static"
        activeStep={step}
        sx={{ bgcolor: 'transparent', justifyContent: 'center', pt: 1, '& .MuiMobileStepper-dot': { bgcolor: 'rgba(255,255,255,0.2)' }, '& .MuiMobileStepper-dotActive': { bgcolor: 'primary.main' } }}
        backButton={null}
        nextButton={null}
      />

      <Box sx={{ px: 2, pt: 2, pb: 12 }}>
        {/* STEP 1: 기본 정보 */}
        {step === 0 && (
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>행사 기본 정보를 입력해주세요</Typography>
            <TextField fullWidth label="행사명 *" value={form.title} onChange={(e) => update('title', e.target.value)} sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>카테고리 선택 *</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {CATEGORIES.map(cat => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => update('category', cat)}
                  sx={{
                    bgcolor: form.category === cat ? 'primary.main' : 'rgba(255,255,255,0.07)',
                    color: form.category === cat ? '#fff' : 'text.secondary',
                    border: form.category === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    fontWeight: 600,
                  }}
                />
              ))}
            </Box>
            <TextField
              fullWidth
              label="행사 설명"
              multiline
              rows={4}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </Box>
        )}

        {/* STEP 2: 포스터 이미지 */}
        {step === 1 && (
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>포스터 이미지</Typography>
            <TextField
              fullWidth
              label="이미지 URL"
              placeholder="https://..."
              value={form.poster_url}
              onChange={(e) => update('poster_url', e.target.value)}
              sx={{ mb: 2 }}
              helperText="포스터 이미지의 URL을 입력해주세요"
            />
            {form.poster_url ? (
              <Box
                component="img"
                src={form.poster_url}
                alt="미리보기"
                sx={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <Box sx={{ width: '100%', height: 200, bgcolor: '#1A1A1A', borderRadius: 2, border: '2px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>이미지 URL 입력 후 미리보기</Typography>
              </Box>
            )}
          </Box>
        )}

        {/* STEP 3: 장소 & 시간 */}
        {step === 2 && (
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>장소 & 운영 시간</Typography>
            <TextField fullWidth label="행사 장소명 *" value={form.venue} onChange={(e) => update('venue', e.target.value)} sx={{ mb: 2 }} placeholder="예: 롯데월드몰 1층" />
            <TextField fullWidth label="상세 주소" value={form.address} onChange={(e) => update('address', e.target.value)} sx={{ mb: 2 }} placeholder="예: 서울특별시 송파구 올림픽로 300" />
            <TextField fullWidth label="운영 시간" value={form.operating_hours} onChange={(e) => update('operating_hours', e.target.value)} sx={{ mb: 2 }} placeholder="예: 10:00 - 21:00" />
          </Box>
        )}

        {/* STEP 4: 행사 일정 */}
        {step === 3 && (
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>행사 일정</Typography>
            <TextField fullWidth label="시작일 *" type="date" value={form.start_date} onChange={(e) => update('start_date', e.target.value)} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth label="종료일 *" type="date" value={form.end_date} onChange={(e) => update('end_date', e.target.value)} InputLabelProps={{ shrink: true }} />
          </Box>
        )}

        {/* STEP 5: 공식 링크 + 미리보기 */}
        {step === 4 && (
          <Box>
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>공식 링크 & 최종 확인</Typography>
            <TextField fullWidth label="공식 사이트 URL" value={form.official_link} onChange={(e) => update('official_link', e.target.value)} sx={{ mb: 3 }} placeholder="https://..." />

            <Box sx={{ p: 2, bgcolor: '#1A1A1A', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>입력 내용 확인</Typography>
              {[
                ['행사명', form.title],
                ['카테고리', form.category],
                ['장소', form.venue],
                ['주소', form.address],
                ['운영 시간', form.operating_hours],
                ['시작일', form.start_date],
                ['종료일', form.end_date],
              ].map(([label, value]) => value ? (
                <Box key={label} sx={{ display: 'flex', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', width: 80, flexShrink: 0 }}>{label}</Typography>
                  <Typography variant="caption" sx={{ color: '#fff' }}>{value}</Typography>
                </Box>
              ) : null)}
            </Box>
          </Box>
        )}
      </Box>

      {/* 하단 버튼 */}
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, bgcolor: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {step < STEPS.length - 1 ? (
          <Button
            variant="contained"
            fullWidth
            disabled={!canNext()}
            onClick={() => setStep(s => s + 1)}
            sx={{ py: 1.5 }}
          >
            다음
          </Button>
        ) : (
          <Button
            variant="contained"
            fullWidth
            disabled={submitting || !canNext()}
            onClick={handleSubmit}
            sx={{ py: 1.5 }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : '행사 등록 완료'}
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default EventCreatePage;
