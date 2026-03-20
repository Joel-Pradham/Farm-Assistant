/**
 * Terra Intelligence — Crop Advisor Page
 * Soil data form → crop recommendation cards
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout, Loader2, AlertTriangle, Star, Calendar,
  BarChart3, Lightbulb, ChevronRight
} from 'lucide-react';
import AppLayout from '../components/AppLayout.jsx';
import { cropAPI } from '../services/api.js';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const FADE = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

// We map the labels inside the component now so we can translate them

const InputField = ({ label, unit, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-foreground/40 uppercase tracking-widest font-semibold">{label}</label>
    <div className="relative">
      <input
        className="w-full bg-surface2/50 border border-surface2 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400/50 transition-colors placeholder:text-foreground/20"
        {...props}
      />
      {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground/30">{unit}</span>}
    </div>
  </div>
);

export default function CropRecommendPage() {
  const { t } = useTranslation();
  const SOIL_TYPES = [
    { value: 'laterite', label: t('advisor.soil_laterite') },
    { value: 'clay', label: t('advisor.soil_clay') },
    { value: 'loam', label: t('advisor.soil_loam') },
    { value: 'sandy', label: t('advisor.soil_sandy') },
    { value: 'red', label: t('advisor.soil_red') },
    { value: 'alluvial', label: t('advisor.soil_alluvial') },
  ];
  const [form, setForm] = useState({
    soil_ph: '',
    temperature: '',
    humidity: '',
    rainfall: '',
    soil_type: 'laterite',
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateField = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.soil_ph || !form.temperature || !form.humidity || !form.rainfall) {
      toast.error(t('advisor.fill_fields'));
      return;
    }
    setLoading(true);
    try {
      const data = await cropAPI.recommend({
        soil_ph: parseFloat(form.soil_ph),
        temperature: parseFloat(form.temperature),
        humidity: parseFloat(form.humidity),
        rainfall: parseFloat(form.rainfall),
        soil_type: form.soil_type,
      });
      setResults(data);
      toast.success(t('advisor.found_matches').replace('{{count}}', data.recommendations.length));
    } catch {
      toast.error(t('advisor.offline'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={FADE} className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-lime-400/70 uppercase mb-2">{t('advisor.module')}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{t('advisor.title')}</h1>
          <p className="text-foreground/50 text-lg font-light">{t('advisor.subtitle')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form */}
          <motion.form
            initial="hidden" animate="visible" variants={FADE}
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-surface border border-surface2 rounded-2xl p-6 space-y-5 h-fit"
          >
            <p className="text-xs font-semibold tracking-widest text-foreground/40 uppercase">{t('advisor.data_title')}</p>
            <InputField label={t('advisor.soil_ph')} placeholder="e.g. 6.5" type="number" step="0.1" min="0" max="14" value={form.soil_ph} onChange={updateField('soil_ph')} />
            <InputField label={t('advisor.temperature')} unit="°C" placeholder="e.g. 28" type="number" step="0.5" value={form.temperature} onChange={updateField('temperature')} />
            <InputField label={t('advisor.humidity')} unit="%" placeholder="e.g. 80" type="number" step="1" min="0" max="100" value={form.humidity} onChange={updateField('humidity')} />
            <InputField label={t('advisor.rainfall')} unit="mm/yr" placeholder="e.g. 2000" type="number" step="50" value={form.rainfall} onChange={updateField('rainfall')} />
            <div className="space-y-1.5">
              <label className="text-xs text-foreground/40 uppercase tracking-widest font-semibold">{t('advisor.soil_type')}</label>
              <div className="grid grid-cols-3 gap-2">
                {SOIL_TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, soil_type: value }))}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      form.soil_type === value
                        ? 'bg-cyan-400/10 border-cyan-400/40 text-cyan-400'
                        : 'bg-surface2/30 border-surface2 text-foreground/40 hover:text-white hover:border-foreground/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 text-background py-3 rounded-xl font-semibold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> {t('advisor.analyzing')}</> : <><Sprout size={16} /> {t('advisor.get_recs')}</>}
            </button>
          </motion.form>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {results?.warnings?.length > 0 && (
              <motion.div initial="hidden" animate="visible" variants={FADE}>
                {results.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3 text-sm text-amber-300 mb-2">
                    <AlertTriangle size={13} className="mt-0.5 shrink-0" />{w}
                  </div>
                ))}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {results?.recommendations?.length > 0 ? (
                <motion.div key="results" initial="hidden" animate="visible" variants={FADE} className="space-y-4">
                  {results.recommendations.map((crop, i) => (
                    <motion.div
                      key={crop.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-surface border border-surface2 rounded-2xl p-6 group hover:border-cyan-400/20 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {i === 0 && <Star size={14} className="text-amber-400 fill-amber-400" />}
                            <h3 className="text-xl font-bold text-white">{crop.name}</h3>
                          </div>
                          {crop.malayalam && <p className="text-foreground/30 text-sm">{crop.malayalam}</p>}
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-light text-cyan-400">{crop.match_percent}%</span>
                          <p className="text-xs text-foreground/30">{t('advisor.match')}</p>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/60 leading-relaxed mb-4">{crop.description}</p>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-surface2/30 rounded-xl p-3 text-center">
                          <Calendar size={12} className="text-cyan-400 mx-auto mb-1" />
                          <p className="text-xs text-foreground/30">{t('advisor.duration')}</p>
                          <p className="text-xs text-white font-medium">{crop.duration}</p>
                        </div>
                        <div className="bg-surface2/30 rounded-xl p-3 text-center">
                          <BarChart3 size={12} className="text-cyan-400 mx-auto mb-1" />
                          <p className="text-xs text-foreground/30">{t('advisor.yield')}</p>
                          <p className="text-xs text-white font-medium">{crop.yield}</p>
                        </div>
                        <div className="bg-surface2/30 rounded-xl p-3 text-center">
                          <Sprout size={12} className="text-cyan-400 mx-auto mb-1" />
                          <p className="text-xs text-foreground/30">{t('advisor.season')}</p>
                          <p className="text-xs text-white font-medium">{crop.season}</p>
                        </div>
                      </div>
                      {crop.tips?.length > 0 && (
                        <div className="border-t border-surface2 pt-3">
                          <p className="text-xs text-foreground/30 uppercase tracking-widest mb-2 flex items-center gap-1"><Lightbulb size={10} /> {t('advisor.tips')}</p>
                          {crop.tips.map((tip, j) => (
                            <p key={j} className="text-xs text-foreground/50 flex items-start gap-2 mb-1">
                              <ChevronRight size={10} className="text-cyan-400 mt-0.5 shrink-0" />{tip}
                            </p>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              ) : !loading ? (
                <motion.div key="empty" initial="hidden" animate="visible" variants={FADE}
                  className="flex flex-col items-center justify-center text-center bg-surface/30 border border-surface2 border-dashed rounded-2xl p-16"
                >
                  <Sprout size={44} className="text-surface2 mb-4" />
                  <p className="text-foreground/30 font-light whitespace-pre-line">{t('advisor.enter_data_to_begin')}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
