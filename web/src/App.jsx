import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DiseaseScanPage from './pages/DiseaseScanPage.jsx';
import CropRecommendPage from './pages/CropRecommendPage.jsx';
import WeatherPage from './pages/WeatherPage.jsx';
import FertilizerPage from './pages/FertilizerPage.jsx';
import ChatPage from './pages/ChatPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/disease-scan" element={<DiseaseScanPage />} />
      <Route path="/crop-advisor" element={<CropRecommendPage />} />
      <Route path="/weather" element={<WeatherPage />} />
      <Route path="/fertilizer" element={<FertilizerPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}
