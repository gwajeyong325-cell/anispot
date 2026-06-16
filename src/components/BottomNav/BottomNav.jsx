import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import MapIcon from '@mui/icons-material/Map';

const NAV_ITEMS = [
  { label: '홈', icon: <HomeIcon />, path: '/' },
  { label: '탐색', icon: <ExploreIcon />, path: '/events' },
  { label: '지도', icon: <MapIcon />, path: '/map' },
  { label: '캘린더', icon: <CalendarMonthIcon />, path: '/calendar' },
  { label: '마이', icon: <PersonIcon />, path: '/mypage' },
];

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentValue = NAV_ITEMS.findIndex(item => {
    if (item.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.path);
  });

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        zIndex: 1000,
        pb: 'env(safe-area-inset-bottom)',
      }}
      elevation={0}
    >
      <BottomNavigation
        value={currentValue === -1 ? false : currentValue}
        onChange={(_, newValue) => navigate(NAV_ITEMS[newValue].path)}
      >
        {NAV_ITEMS.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
