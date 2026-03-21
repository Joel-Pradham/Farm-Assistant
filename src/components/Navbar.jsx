/**
 * Terra Intelligence — Shared Navbar Component
 */
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Shield, Leaf, CloudRain, Sprout, MessageSquare,
  FlaskConical, LayoutDashboard, Menu, X, ChevronRight, Languages
} from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language.startsWith('ml') ? 'en' : 'ml');
  };

  const navLinks = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/disease-scan', label: t('nav.disease_scanner'), icon: Leaf },
    { to: '/crop-advisor', label: t('nav.crop_advisor'), icon: Sprout },
    { to: '/weather', label: t('nav.weather'), icon: CloudRain },
    { to: '/fertilizer', label: t('nav.fertilizer'), icon: FlaskConical },
    { to: '/chat', label: t('nav.ai_assistant'), icon: MessageSquare },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-surface2">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between" style={{ height: '72px' }}>
          {/* Logo */}
          <NavLink to="/" className="text-xl font-display font-bold text-white tracking-widest flex items-center gap-2">
            <Sprout className="text-cyan-400" size={22} />
            FARM INTEL
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/30'
                      : 'text-foreground/60 hover:text-white hover:bg-surface'
                  }`
                }
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 border border-surface2 text-foreground/60 px-4 py-2 rounded-full text-sm font-medium hover:text-white hover:border-surface transition-all duration-200"
              title="Toggle Language"
            >
              <Languages size={14} />
              {i18n.language.startsWith('ml') ? 'English' : 'മലയാളം'}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-cyan-400 text-background px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white transition-all duration-200"
            >
              {t('nav.open_app')} <ChevronRight size={14} />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-surface2 px-6 py-6 lg:hidden"
          >
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { toggleLanguage(); setMobileOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-cyan-400 bg-cyan-400/5 border border-cyan-400/10 mb-2"
              >
                <Languages size={16} /> {i18n.language.startsWith('ml') ? 'Switch to English' : 'മലയാളത്തിലേക്ക് മാറ്റുക'}
              </button>
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                        : 'text-foreground/70 hover:text-white hover:bg-surface'
                    }`
                  }
                >
                  <Icon size={16} /> {label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
