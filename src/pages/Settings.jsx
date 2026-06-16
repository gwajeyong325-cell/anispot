import { useState } from 'react'
import {
  Typography,
  Box,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { useThemeMode } from '../ThemeContext'

export default function Settings() {
  const { darkMode, setDarkMode } = useThemeMode()
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    language: 'ko',
  })

  const handleToggle = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  const handleSelect = (e) => setSettings((prev) => ({ ...prev, language: e.target.value }))

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        설정
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        앱 환경을 원하는 대로 조정하세요.
      </Typography>

      <Stack spacing={3}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>화면 설정</Typography>
          <Divider sx={{ mb: 2 }} />
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
            label="다크 모드"
          />
        </Paper>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>알림 설정</Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            <FormControlLabel
              control={<Switch checked={settings.notifications} onChange={() => handleToggle('notifications')} />}
              label="푸시 알림"
            />
            <FormControlLabel
              control={<Switch checked={settings.emailAlerts} onChange={() => handleToggle('emailAlerts')} />}
              label="이메일 알림"
            />
          </Stack>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>언어 설정</Typography>
          <Divider sx={{ mb: 2 }} />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>언어</InputLabel>
            <Select value={settings.language} label="언어" onChange={handleSelect}>
              <MenuItem value="ko">한국어</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ja">日本語</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        <Button variant="contained" startIcon={<SaveIcon />} sx={{ alignSelf: 'flex-start' }}>
          저장하기
        </Button>
      </Stack>
    </Box>
  )
}
