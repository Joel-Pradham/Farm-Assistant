/**
 * Terra Intelligence — Shared Layout for all app pages
 * Wraps content with Navbar + sidebar navigation
 */
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar.jsx';
import {
  LayoutDashboard, Leaf, Sprout, CloudRain,
  FlaskConical, MessageSquare, ChevronRight
} from 'lucide-react';

const SIDEBAR_LINKS = [
  { to: '/dashboard', labelId: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/disease-scan', labelId: 'nav.disease_scanner', icon: Leaf },
  { to: '/crop-advisor', labelId: 'nav.crop_advisor', icon: Sprout },
  { to: '/weather', labelId: 'nav.weather', icon: CloudRain },
  { to: '/fertilizer', labelId: 'nav.fertilizer', icon: FlaskConical },
  { to: '/chat', labelId: 'nav.ai_assistant', icon: MessageSquare },
];

export default function AppLayout({ children }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-[72px]">
        {/* Sidebar */}
        <aside className="hidden xl:flex flex-col w-60 fixed top-[72px] bottom-0 left-0 border-r border-surface2 bg-surface/30 backdrop-blur-sm px-3 py-6 z-30">
          <p className="text-[10px] font-semibold tracking-widest text-foreground/30 uppercase px-3 mb-3">{t('nav.modules')}</p>
          <nav className="flex flex-col gap-1">
            {SIDEBAR_LINKS.map(({ to, labelId, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                      : 'text-foreground/50 hover:text-white hover:bg-surface2'
                  }`
                }
              >
                <Icon size={15} />
                <span className="flex-1">{t(labelId)}</span>
                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto px-3">
            <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-xl p-4">
              <p className="text-xs text-cyan-400 font-semibold mb-1">{t('dashboard.system_status')}</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs text-foreground/50">{t('nav.all_modules_operational')}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 xl:ml-60 min-h-[calc(100vh-72px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
