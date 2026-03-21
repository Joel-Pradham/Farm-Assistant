/**
 * Terra Intelligence — Weather Intelligence Page 
 * 5-day forecast, alerts, irrigation advice
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cloud, Sun, CloudRain, CloudDrizzle, CloudSun,
  Thermometer, Droplets, Wind, RefreshCw, AlertTriangle,
  Activity, Loader2, MapPin, Search
} from 'lucide-react';
import AppLayout from '../components/AppLayout.jsx';
import { weatherAPI } from '../services/api.js';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const FADE = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

const ICON_MAP = {
  sun: Sun, cloud: Cloud, 'cloud-rain': CloudRain,
  'cloud-drizzle': CloudDrizzle, 'cloud-sun': CloudSun,
};

export default function WeatherPage() {
  const { t } = useTranslation();
  const [city, setCity] = useState('Ernakulam');
  const [searchCity, setSearchCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (c) => {
    setLoading(true);
    try {
      const data = await weatherAPI.get(c || city);
      setWeather(data);
      setCity(data.city || c || city);
    } catch {
      toast.error(t('weather.offline'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
      setSearchCity('');
    }
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={FADE} className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-cyan-400/70 uppercase mb-2">{t('weather.module')}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{t('weather.title')}</h1>
          <p className="text-foreground/50 text-lg font-light">{t('weather.subtitle')}</p>
        </motion.div>

        {/* Search */}
        <motion.form initial="hidden" animate="visible" variants={FADE} onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1 max-w-xs">
            <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
            <input
              type="text" value={searchCity} onChange={(e) => setSearchCity(e.target.value)}
              placeholder={`${t('weather.currently')}: ${city}`}
              className="w-full bg-surface border border-surface2 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-400/50 transition-colors placeholder:text-foreground/25"
            />
          </div>
          <button type="submit" className="bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 rounded-xl px-5 py-3 text-sm font-medium hover:bg-cyan-400/20 transition-colors flex items-center gap-2">
            <Search size={14} /> {t('weather.search')}
          </button>
          <button type="button" onClick={() => fetchWeather()} className="bg-surface border border-surface2 text-foreground/40 hover:text-white rounded-xl px-4 py-3 transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </motion.form>

        {loading ? (
          <div className="flex items-center gap-3 text-foreground/30 justify-center py-20">
            <Loader2 size={24} className="animate-spin" /> <span className="text-sm">{t('weather.fetching')}</span>
          </div>
        ) : weather ? (
          <div className="space-y-6">
            {/* Current Weather Hero */}
            <motion.div initial="hidden" animate="visible" variants={FADE}
              className="bg-surface border border-surface2 rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 text-foreground/40 text-sm mb-2">
                    <MapPin size={13} /> {weather.city}, {weather.country}
                    {weather.source === 'openweathermap' && <span className="text-cyan-400 text-xs bg-cyan-400/10 px-2 py-0.5 rounded-full">{t('weather.live')}</span>}
                  </div>
                  <p className="text-7xl md:text-8xl font-light text-white mb-1">{weather.current.temp}°</p>
                  <p className="text-lg text-foreground/50">{weather.current.condition}</p>
                </div>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface2/50 flex items-center justify-center"><Thermometer size={16} className="text-cyan-400" /></div>
                    <div><p className="text-foreground/30 text-xs">{t('weather.feels_like')}</p><p className="text-white font-medium">{weather.current.feels_like}°C</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface2/50 flex items-center justify-center"><Droplets size={16} className="text-cyan-400" /></div>
                    <div><p className="text-foreground/30 text-xs">{t('weather.humidity')}</p><p className="text-white font-medium">{weather.current.humidity}%</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface2/50 flex items-center justify-center"><Wind size={16} className="text-cyan-400" /></div>
                    <div><p className="text-foreground/30 text-xs">{t('weather.wind')}</p><p className="text-white font-medium">{weather.current.wind_speed} km/h</p></div>
                  </div>
                  {weather.current.uv_index && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface2/50 flex items-center justify-center"><Sun size={16} className="text-amber-400" /></div>
                      <div><p className="text-foreground/30 text-xs">{t('weather.uv_index')}</p><p className="text-white font-medium">{weather.current.uv_index}</p></div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Alerts */}
            {weather.alerts?.length > 0 && (
              <motion.div initial="hidden" animate="visible" variants={FADE}>
                {weather.alerts.map((alert, i) => (
                  <div key={i} className={`flex items-start gap-3 rounded-xl px-5 py-4 border mb-2 text-sm ${
                    alert.type === 'danger' ? 'bg-red-400/10 border-red-400/20 text-red-300' :
                    alert.type === 'warning' ? 'bg-amber-400/10 border-amber-400/20 text-amber-300' :
                    'bg-cyan-400/10 border-cyan-400/20 text-cyan-300'
                  }`}>
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    <div><strong>{alert.title}</strong> — {alert.message}</div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Irrigation Advice */}
            {weather.irrigation_advice && (
              <motion.div initial="hidden" animate="visible" variants={FADE}
                className={`bg-surface border rounded-2xl p-6 flex items-start gap-4 ${
                  weather.irrigation_advice.color === 'blue' ? 'border-blue-400/20' :
                  weather.irrigation_advice.color === 'amber' ? 'border-amber-400/20' : 'border-cyan-400/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  weather.irrigation_advice.color === 'blue' ? 'bg-blue-400/10' :
                  weather.irrigation_advice.color === 'amber' ? 'bg-amber-400/10' : 'bg-cyan-400/10'
                }`}>
                  <Activity size={16} className={
                    weather.irrigation_advice.color === 'blue' ? 'text-blue-400' :
                    weather.irrigation_advice.color === 'amber' ? 'text-amber-400' : 'text-cyan-400'
                  } />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-foreground/30 mb-1">{t('weather.irrigation_intel')}</p>
                  <p className="text-white font-semibold">{weather.irrigation_advice.advice}</p>
                  <p className="text-sm text-foreground/50 mt-1">{weather.irrigation_advice.detail}</p>
                </div>
              </motion.div>
            )}

            {/* 5-Day Forecast */}
            <motion.div initial="hidden" animate="visible" variants={FADE}>
              <p className="text-xs font-semibold tracking-widest text-foreground/30 uppercase mb-4">{t('weather.forecast_5_day')}</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {weather.forecast?.map((day, i) => {
                  const WeatherIcon = ICON_MAP[day.icon] || Cloud;
                  return (
                    <div key={i} className="bg-surface border border-surface2 rounded-xl p-4 text-center hover:border-cyan-400/20 transition-all group">
                      <p className="text-xs text-foreground/30 mb-2">{day.date}</p>
                      <WeatherIcon size={28} className="text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-white font-medium text-sm">{day.temp_max}°</p>
                      <p className="text-foreground/30 text-xs">{day.temp_min}°</p>
                      <div className="mt-2 text-xs text-foreground/40">
                        <p>💧 {day.rain_chance}%</p>
                        <p>💨 {day.wind_speed}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-20 text-foreground/30">
            <Cloud size={48} className="mx-auto mb-4 text-surface2" />
            <p>{t('weather.start_backend_notice')}</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
