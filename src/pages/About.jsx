import {
  Typography,
  Box,
  Avatar,
  Divider,
  Chip,
  Stack,
  IconButton,
  Paper,
} from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import EmailIcon from '@mui/icons-material/Email'

export default function About() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 5, maxWidth: 600, width: '100%', textAlign: 'center', borderRadius: 4 }}>
        <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: 40 }}>
          홍
        </Avatar>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          홍길동
        </Typography>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          프론트엔드 개발자
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          안녕하세요! React와 MUI를 활용한 웹 개발을 좋아하는 프론트엔드 개발자입니다.
          사용자 경험을 중심으로 깔끔하고 직관적인 UI를 만드는 것을 즐깁니다.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ mb: 3 }}>
          {['React', 'TypeScript', 'MUI', 'Node.js', 'Git'].map((skill) => (
            <Chip key={skill} label={skill} color="primary" variant="outlined" size="small" />
          ))}
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="center">
          <IconButton color="default"><GitHubIcon /></IconButton>
          <IconButton color="primary"><LinkedInIcon /></IconButton>
          <IconButton color="error"><EmailIcon /></IconButton>
        </Stack>
      </Paper>
    </Box>
  )
}
