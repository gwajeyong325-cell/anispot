import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, IconButton, CircularProgress, Chip,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { supabase } from '../../supabase';
import BottomNav from '../../components/BottomNav/BottomNav';
import StatusBadge from '../../components/StatusBadge/StatusBadge';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function CalendarPage() {
  const navigate = useNavigate();
  const [today] = useState(new Date());
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [current]);

  const fetchEvents = async () => {
    setLoading(true);
    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDay = new Date(year, month, 1).toISOString().split('T')[0];
    const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data } = await supabase
      .from('anispot_events')
      .select('*')
      .lte('start_date', lastDay)
      .gte('end_date', firstDay)
      .order('start_date');

    setEvents(data || []);
    setLoading(false);
  };

  const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
  const firstWeekday = new Date(current.getFullYear(), current.getMonth(), 1).getDay();

  const getEventsForDay = (day) => {
    const date = new Date(current.getFullYear(), current.getMonth(), day);
    return events.filter(e => {
      const start = new Date(e.start_date);
      const end = new Date(e.end_date);
      return date >= start && date <= end;
    });
  };

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  const prevMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));

  const isToday = (day) => {
    const d = new Date(current.getFullYear(), current.getMonth(), day);
    return d.toDateString() === today.toDateString();
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', pb: '80px' }}>
      {/* 헤더 */}
      <Box sx={{ px: 2, pt: 'max(env(safe-area-inset-top), 16px)', pb: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', mb: 0.25 }}>행사 캘린더</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>발매 예정표 스타일로 행사 일정을 확인하세요</Typography>
      </Box>

      {/* 월 선택 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2, gap: 2 }}>
        <IconButton onClick={prevMonth} sx={{ color: 'text.secondary' }}>
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
        <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, minWidth: 140, textAlign: 'center' }}>
          {current.getFullYear()}년 {current.getMonth() + 1}월
        </Typography>
        <IconButton onClick={nextMonth} sx={{ color: 'text.secondary' }}>
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* 요일 헤더 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', px: 1, mb: 0.5 }}>
        {WEEKDAYS.map((day, i) => (
          <Box key={day} sx={{ textAlign: 'center', py: 0.5 }}>
            <Typography variant="caption" sx={{ color: i === 0 ? '#E84040' : i === 6 ? '#4488FF' : 'text.secondary', fontWeight: 700, fontSize: '0.7rem' }}>
              {day}
            </Typography>
          </Box>
        ))}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {/* 날짜 그리드 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', px: 1, gap: 0.25 }}>
            {Array.from({ length: firstWeekday }).map((_, i) => <Box key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isSelected = selectedDate === day;
              const isSun = (firstWeekday + i) % 7 === 0;
              const isSat = (firstWeekday + i) % 7 === 6;

              return (
                <Box
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : day)}
                  sx={{
                    textAlign: 'center',
                    py: 0.75,
                    cursor: 'pointer',
                    borderRadius: 1,
                    bgcolor: isSelected ? 'rgba(232,64,64,0.2)' : isToday(day) ? 'rgba(232,64,64,0.1)' : 'transparent',
                    border: isToday(day) ? '1px solid rgba(232,64,64,0.5)' : '1px solid transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      fontWeight: isToday(day) ? 800 : 400,
                      color: isToday(day) ? 'primary.main' : isSun ? '#E84040' : isSat ? '#4488FF' : '#fff',
                      fontSize: '0.8rem',
                    }}
                  >
                    {day}
                  </Typography>
                  {dayEvents.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.25, mt: 0.25 }}>
                      {dayEvents.slice(0, 3).map((_, idx) => (
                        <Box key={idx} sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.main' }} />
                      ))}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* 선택 날짜 행사 목록 */}
          {selectedDate && (
            <Box sx={{ mx: 2, mt: 2, p: 2, bgcolor: '#1A1A1A', borderRadius: 2, border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, mb: 1.5 }}>
                {current.getMonth() + 1}월 {selectedDate}일 행사 ({selectedEvents.length}개)
              </Typography>
              {selectedEvents.length === 0 ? (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>이 날 진행되는 행사가 없습니다</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {selectedEvents.map((event) => (
                    <Box
                      key={event.id}
                      onClick={() => navigate(`/events/${event.id}`)}
                      sx={{ display: 'flex', gap: 1.5, cursor: 'pointer', alignItems: 'center', p: 1, borderRadius: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' } }}
                    >
                      <Box
                        component="img"
                        src={event.poster_url || `https://picsum.photos/seed/${event.id}/60/90`}
                        alt={event.title}
                        sx={{ width: 40, height: 60, objectFit: 'cover', borderRadius: 0.5, flexShrink: 0 }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700 }} noWrap>{event.title}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>{event.venue}</Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <StatusBadge startDate={event.start_date} endDate={event.end_date} />
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* 이번 달 행사 전체 목록 */}
          <Box sx={{ px: 2, mt: 3 }}>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 1.5 }}>
              {current.getMonth() + 1}월 행사 목록 ({events.length}개)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {events.map((event) => (
                <Box
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  sx={{ display: 'flex', gap: 1.5, cursor: 'pointer', p: 1.5, bgcolor: '#1A1A1A', borderRadius: 2, border: '1px solid rgba(255,255,255,0.06)', alignItems: 'center', '&:hover': { border: '1px solid rgba(232,64,64,0.3)' } }}
                >
                  <Box
                    component="img"
                    src={event.poster_url || `https://picsum.photos/seed/${event.id}/60/90`}
                    alt={event.title}
                    sx={{ width: 44, height: 66, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700 }} noWrap>{event.title}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {new Date(event.start_date).toLocaleDateString('ko-KR')} ~ {new Date(event.end_date).toLocaleDateString('ko-KR')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>{event.venue}</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <StatusBadge startDate={event.start_date} endDate={event.end_date} />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      )}

      <BottomNav />
    </Box>
  );
}

export default CalendarPage;
