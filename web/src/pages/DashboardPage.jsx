/**
 * Terra Intelligence — Dashboard Page
 * Hub with quick weather widget, system status, and quick-action cards
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cloud, Leaf, Sprout, FlaskConical, MessageSquare,
  Thermometer, Droplets, Wind, ArrowRight, AlertTriangle,
  CheckCircle, Activity, RefreshCw
} from 'lucide-react';
import AppLayout from '../components/AppLayout.jsx';
import { weatherAPI } from '../services/api.js';
import toast from 'react-hot-toast';

const MODULES = [
  { to: '/disease-scan', labelId: 'nav.disease_scanner', descId: 'dashboard.modules.disease_scan_desc', icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  { to: '/crop-advisor', labelId: 'nav.crop_advisor', descId: 'dashboard.modules.crop_advisor_desc', icon: Sprout, color: 'text-lime-400', bg: 'bg-lime-400/10 border-lime-400/20' },
  { to: '/weather', labelId: 'nav.weather', descId: 'dashboard.modules.weather_desc', icon: Cloud, color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20' },
  { to: '/fertilizer', labelId: 'nav.fertilizer', descId: 'dashboard.modules.fertilizer_desc', icon: FlaskConical, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  { to: '/chat', labelId: 'nav.ai_assistant', descId: 'dashboard.modules.chat_desc', icon: MessageSquare, color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20' },
];
import { useTranslation } from 'react-i18next';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, type: 'spring', stiffness: 120, damping: 20 } }),
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const fetchWeather = async () => {
    setWeatherLoading(true);
    try {
      const data = await weatherAPI.get();
      setWeather(data);
    } catch {
      toast.error(t('dashboard.backend_offline'));
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => { fetchWeather(); }, []);

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={FADE_UP} className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-cyan-400/70 uppercase mb-2">{t('dashboard.hq')}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{t('dashboard.title')}</h1>
          <p className="text-foreground/50 text-lg font-light">{t('dashboard.subtitle')}</p>
        </motion.div>

        {/* Top Row — Weather + Alerts */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Weather Widget */}
          <motion.div
            initial="hidden" animate="visible" custom={0} variants={FADE_UP}
            className="md:col-span-2 bg-surface border border-surface2 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold tracking-widest text-foreground/40 uppercase">{t('dashboard.live_weather_title')} — {weather?.city || t('dashboard.ernakulam')}</p>
              <button onClick={fetchWeather} className="text-foreground/40 hover:text-cyan-400 transition-colors">
                <RefreshCw size={14} className={weatherLoading ? 'animate-spin' : ''} />
              </button>
            </div>
            {weatherLoading ? (
              <div className="flex items-center gap-3 text-foreground/30">
                <RefreshCw size={18} className="animate-spin" />
                <span className="text-sm">{t('dashboard.fetching_weather')}</span>
              </div>
            ) : weather ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-5xl font-light text-white mb-1">{weather.current.temp}°C</p>
                  <p className="text-foreground/50 text-sm">{weather.current.condition}</p>
                </div>
                <div className="flex flex-col gap-2 text-sm text-foreground/50">
                  <span className="flex items-center gap-2"><Droplets size={13} className="text-cyan-400" />{weather.current.humidity}% {t('dashboard.humidity')}</span>
                  <span className="flex items-center gap-2"><Wind size={13} className="text-cyan-400" />{weather.current.wind_speed} km/h {t('dashboard.wind')}</span>
                  <span className="flex items-center gap-2"><Thermometer size={13} className="text-cyan-400" />{t('dashboard.feels_like')} {weather.current.feels_like}°C</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-foreground/40 italic">{t('dashboard.weather_demo_notice')}</p>
            )}
            {weather?.irrigation_advice && (
              <div className={`mt-4 border rounded-xl px-4 py-2 text-sm flex items-center gap-2 ${
                weather.irrigation_advice.color === 'blue' ? 'bg-blue-400/10 border-blue-400/20 text-blue-400' :
                weather.irrigation_advice.color === 'amber' ? 'bg-amber-400/10 border-amber-400/20 text-amber-400' :
                'bg-cyan-400/10 border-cyan-400/20 text-cyan-400'
              }`}>
                <Activity size={13} />
                <strong>{weather.irrigation_advice.advice}</strong>
                <span className="text-foreground/50 text-xs ml-1">— {weather.irrigation_advice.detail}</span>
              </div>
            )}
          </motion.div>

          {/* System Status */}
          <motion.div
            initial="hidden" animate="visible" custom={1} variants={FADE_UP}
            className="bg-surface border border-surface2 rounded-2xl p-6"
          >
            <p className="text-xs font-semibold tracking-widest text-foreground/40 uppercase mb-4">{t('dashboard.system_status')}</p>
            <div className="flex flex-col gap-3">
              {[
                { label: t('nav.disease_scanner'), ok: true },
                { label: t('nav.crop_advisor'), ok: true },
                { label: t('nav.fertilizer'), ok: true },
                { label: t('nav.ai_assistant'), ok: true },
                { label: t('dashboard.live_weather_api'), ok: !!weather && weather.source !== 'mock' },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/60">{label}</span>
                  <span className={`flex items-center gap-1.5 ${ok ? 'text-cyan-400' : 'text-amber-400'}`}>
                    {ok ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                    {ok ? t('dashboard.online') : t('dashboard.demo')}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Alerts */}
        {weather?.alerts?.length > 0 && (
          <motion.div initial="hidden" animate="visible" custom={2} variants={FADE_UP} className="mb-8">
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

        {/* Module Cards */}
        <motion.p initial="hidden" animate="visible" custom={3} variants={FADE_UP}
          className="text-xs font-semibold tracking-widest text-foreground/30 uppercase mb-4">
          {t('dashboard.intelligence_modules')}
        </motion.p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map(({ to, labelId, icon: Icon, descId, color, bg }, i) => (
            <motion.div
              key={to}
              initial="hidden" animate="visible" custom={i + 3} variants={FADE_UP}
              onClick={() => navigate(to)}
              className="group bg-surface border border-surface2 hover:border-surface rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
            >
              <div className={`w-12 h-12 rounded-xl border ${bg} flex items-center justify-center mb-4`}>
                <Icon size={20} className={color} />
              </div>
              <h3 className="text-white font-semibold mb-1">{t(labelId)}</h3>
              <p className="text-foreground/50 text-sm font-light leading-relaxed mb-4">{t(descId)}</p>
              <span className={`flex items-center gap-1 text-xs font-medium ${color}`}>
                {t('dashboard.launch_module')} <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
