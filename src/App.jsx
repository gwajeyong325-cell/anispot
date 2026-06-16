import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import EventListPage from './pages/EventListPage/EventListPage';
import EventDetailPage from './pages/EventDetailPage/EventDetailPage';
import EventCreatePage from './pages/EventCreatePage/EventCreatePage';
import MyPage from './pages/MyPage/MyPage';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import MapPage from './pages/MapPage/MapPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/anispot">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/events" element={<EventListPage />} />
          <Route path="/events/create" element={<EventCreatePage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
