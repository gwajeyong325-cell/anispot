import { useState } from 'react'
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Divider,
  Alert,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 5, maxWidth: 560, width: '100%', borderRadius: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          연락처
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          문의사항을 남겨주시면 빠르게 답변드리겠습니다.
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {submitted && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSubmitted(false)}>
            메시지가 성공적으로 전송되었습니다!
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="이름"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="이메일"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="메시지"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={5}
          />
          <Button type="submit" variant="contained" endIcon={<SendIcon />} size="large">
            전송하기
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
