import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Leaf, Activity, Droplets, Sprout, MessageSquare, CloudRain, FlaskConical } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';

const FADE_UP = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } } };

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen selection:bg-cyan-400 selection:text-background overflow-hidden relative">
      <Navbar />
      <main className="pt-36">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 mb-32 grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" animate="visible" variants={FADE_UP} className="space-y-8">
            <div className="inline-flex items-center gap-2 border border-surface2 bg-surface text-cyan-400 px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              {t('landing.badge')}
            </div>
            <h1 className="text-6xl md:text-8xl leading-[1.05] font-semibold text-white">{t('landing.title1')} <br/>{t('landing.title2')}</h1>
            <p className="text-xl text-foreground/80 max-w-lg leading-relaxed font-light">
              {t('landing.subtitle')}
            </p>
            <div className="pt-6 flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="group flex items-center gap-3 bg-cyan-400 text-background px-8 py-4 rounded-full text-base font-semibold hover:bg-white hover:shadow-[0_0_30px_rgba(31,200,219,0.3)] transition-all duration-300">
                {t('landing.launch')} <span className="group-hover:translate-x-1 transition-transform"><ArrowRight size={20} /></span>
              </button>
              <button onClick={() => navigate('/chat')} className="flex items-center gap-2 border border-surface2 text-foreground/60 px-6 py-4 rounded-full text-base hover:text-white hover:border-surface transition-all">
                <MessageSquare size={16} /> {t('landing.ask_ai')}
              </button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 1.2, delay: 0.2 }} className="relative">
            <div className="aspect-[4/5] bg-surface rounded-[2rem] border border-surface2 relative flex flex-col p-8 overflow-hidden shadow-2xl shadow-background">
              <div className="absolute inset-0 bg-gradient-to-br from-surface2/50 to-transparent" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="self-end px-4 py-2 bg-surface2 rounded-full text-xs text-cyan-400 font-medium tracking-wide">{t('landing.live_feed')}</div>
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-surface2 border border-cyan-400/20 flex items-center justify-center shadow-[0_0_40px_rgba(31,200,219,0.1)] relative">
                    <Droplets className="text-cyan-400" size={40} />
                    <svg className="absolute inset-0 w-full h-full -rotate-90 text-cyan-400" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="300" strokeDashoffset="100" className="animate-[spin_10s_linear_infinite]" /></svg>
                  </div>
                  <div>
                    <h3 className="text-2xl text-white font-medium mb-2">{t('landing.modules_active')}</h3>
                    <p className="text-foreground/60 text-sm font-light">{t('landing.modules_list')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* How it works */}
        <section className="bg-surface py-32 border-y border-surface2 relative">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP} className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-semibold mb-6">{t('landing.orchestrated')}</h2>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto font-light">{t('landing.orchestrated_sub')}</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
              {[
                { step: "01", title: t('landing.step1'), desc: t('landing.step1_desc') },
                { step: "02", title: t('landing.step2'), desc: t('landing.step2_desc') },
                { step: "03", title: t('landing.step3'), desc: t('landing.step3_desc') }
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                  className="relative flex flex-col items-center text-center p-6 bg-surface2/30 rounded-3xl border border-transparent hover:border-cyan-400/30 transition-all duration-500 group">
                  <div className="w-20 h-20 rounded-2xl bg-surface2 border border-surface text-cyan-400 flex items-center justify-center mb-8 text-2xl font-display font-medium shadow-inner group-hover:scale-110 transition-transform duration-500">{item.step}</div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{item.title}</h3>
                  <p className="text-foreground/70 leading-relaxed font-light">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-32 max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP} className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl text-white font-semibold mb-6">{t('landing.tactical_title')}</h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto font-light">{t('landing.tactical_desc')}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Leaf, title: t('nav.disease_scanner'), desc: t('dashboard.modules.disease_scan_desc'), to: '/disease-scan' },
              { icon: Sprout, title: t('nav.crop_advisor'), desc: t('dashboard.modules.crop_advisor_desc'), to: '/crop-advisor' },
              { icon: CloudRain, title: t('nav.weather'), desc: t('dashboard.modules.weather_desc'), to: '/weather' },
              { icon: FlaskConical, title: t('nav.fertilizer'), desc: t('dashboard.modules.fertilizer_desc'), to: '/fertilizer' },
              { icon: MessageSquare, title: t('nav.ai_assistant'), desc: t('dashboard.modules.chat_desc'), to: '/chat' },
              { icon: Activity, title: t('nav.dashboard'), desc: t('landing.smart_dashboard_desc'), to: '/dashboard' }
            ].map((feat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                onClick={() => navigate(feat.to)} className="bg-surface/40 p-10 rounded-3xl border border-surface2 hover:bg-surface2/50 hover:border-cyan-400/20 transition-all duration-500 group cursor-pointer">
                <div className="w-16 h-16 rounded-2xl bg-surface border border-surface2 flex items-center justify-center mb-8 shadow-inner">
                  <feat.icon className="text-cyan-400 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(31,200,219,0.5)] transition-all duration-500" size={28} />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">{feat.title}</h3>
                <p className="text-foreground/70 font-light leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="my-32 max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, filter: "blur(10px)" }} whileInView={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 1 }} viewport={{ once: true }}
            className="bg-surface rounded-[3rem] border border-surface2 p-12 md:p-20 grid md:grid-cols-3 gap-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/5 to-transparent" />
            {[{ num: "6", label: t('landing.stat1') }, { num: "8+", label: t('landing.stat2') }, { num: "∞", label: t('landing.stat3') }].map((stat, i) => (
              <div key={i} className="space-y-4 relative z-10">
                <div className="text-6xl md:text-7xl font-display font-light text-white">{stat.num}</div>
                <div className="text-cyan-400 font-medium tracking-widest uppercase text-xs">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* CTA */}
        <section className="py-32 text-center">
          <button onClick={() => navigate('/dashboard')} className="group inline-flex items-center gap-4 bg-white text-background px-10 py-5 rounded-full text-lg font-semibold hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(31,200,219,0.3)] transition-all duration-300">
            {t('landing.launch_command_center')} <span className="group-hover:translate-x-2 transition-transform"><ArrowRight size={20} /></span>
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-surface2 pt-24 pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-16 mb-20 relative z-10">
          <div className="max-w-sm">
            <div className="text-3xl font-display font-bold text-white mb-6 flex items-center gap-3"><Sprout className="text-cyan-400" size={28} /> {t('landing.footer_title')}</div>
            <p className="text-foreground/60 font-light leading-relaxed">{t('landing.footer_desc')}</p>
          </div>
          <div className="grid grid-cols-2 gap-20">
            <div>
              <h4 className="text-cyan-400 font-medium tracking-wide uppercase text-sm mb-8">{t('landing.intelligence')}</h4>
              <ul className="space-y-4 font-light text-foreground/80">
                <li><a onClick={() => navigate('/disease-scan')} className="hover:text-cyan-400 transition-colors cursor-pointer">{t('nav.disease_scanner')}</a></li>
                <li><a onClick={() => navigate('/crop-advisor')} className="hover:text-cyan-400 transition-colors cursor-pointer">{t('nav.crop_advisor')}</a></li>
                <li><a onClick={() => navigate('/weather')} className="hover:text-cyan-400 transition-colors cursor-pointer">{t('nav.weather')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-400 font-medium tracking-wide uppercase text-sm mb-8">{t('landing.tools')}</h4>
              <ul className="space-y-4 font-light text-foreground/80">
                <li><a onClick={() => navigate('/fertilizer')} className="hover:text-cyan-400 transition-colors cursor-pointer">{t('nav.fertilizer')}</a></li>
                <li><a onClick={() => navigate('/chat')} className="hover:text-cyan-400 transition-colors cursor-pointer">{t('nav.ai_assistant')}</a></li>
                <li><a onClick={() => navigate('/dashboard')} className="hover:text-cyan-400 transition-colors cursor-pointer">{t('nav.dashboard')}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-surface2 flex flex-col md:flex-row justify-between items-center gap-6 font-light text-sm text-foreground/50 relative z-10">
          <p>© {new Date().getFullYear()} Farm Intel. {t('landing.copyright')}</p>
          <div className="flex gap-8"><a href="#" className="hover:text-cyan-400 transition-colors">{t('landing.privacy')}</a><a href="#" className="hover:text-cyan-400 transition-colors">{t('landing.terms')}</a></div>
        </div>
      </footer>
    </div>
  );
}
