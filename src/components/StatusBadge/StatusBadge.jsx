import { Chip } from '@mui/material';

function getStatus(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

  if (now < start) return { label: '예정', color: '#0288d1' };
  if (now > end) return { label: '종료', color: '#666' };
  if (daysLeft <= 7) return { label: '종료 임박', color: '#FFD93D', textColor: '#111' };
  return { label: '진행중', color: '#2e7d32' };
}

function StatusBadge({ startDate, endDate, size = 'small' }) {
  const status = getStatus(startDate, endDate);
  return (
    <Chip
      label={status.label}
      size={size}
      sx={{
        bgcolor: status.color,
        color: status.textColor || '#fff',
        fontWeight: 700,
        fontSize: '0.65rem',
        height: 20,
        borderRadius: 1,
      }}
    />
  );
}

export default StatusBadge;
