import {
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

const stats = [
  { label: '방문자 수', value: '12,430', icon: <VisibilityIcon fontSize="large" color="primary" /> },
  { label: '사용자 수', value: '3,821', icon: <PeopleIcon fontSize="large" color="success" /> },
  { label: '좋아요', value: '9,204', icon: <ThumbUpIcon fontSize="large" color="warning" /> },
  { label: '성장률', value: '+24%', icon: <TrendingUpIcon fontSize="large" color="error" /> },
]

const recentItems = [
  { title: '신규 사용자 가입', time: '2분 전', desc: '홍길동 님이 가입했습니다.' },
  { title: '댓글 등록', time: '15분 전', desc: '새 댓글이 게시물에 달렸습니다.' },
  { title: '파일 업로드', time: '1시간 전', desc: 'report_2026.pdf 가 업로드됐습니다.' },
  { title: '설정 변경', time: '3시간 전', desc: '알림 설정이 변경되었습니다.' },
]

export default function Home() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        대시보드
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        오늘의 주요 지표를 확인하세요.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <Paper elevation={2} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 3 }}>
              {s.icon}
              <Box>
                <Typography variant="h5" fontWeight={700}>{s.value}</Typography>
                <Typography variant="body2" color="text.secondary">{s.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          최근 활동
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {recentItems.map((item, i) => (
          <Box key={i}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
              <Box>
                <Typography variant="body1" fontWeight={500}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
              </Box>
              <Typography variant="caption" color="text.disabled" sx={{ whiteSpace: 'nowrap', ml: 2 }}>
                {item.time}
              </Typography>
            </Box>
            {i < recentItems.length - 1 && <Divider />}
          </Box>
        ))}
      </Paper>
    </Box>
  )
}
