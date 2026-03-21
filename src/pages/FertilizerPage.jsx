import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Loader2, Leaf, DollarSign, Lightbulb, BarChart3 } from 'lucide-react';
import AppLayout from '../components/AppLayout.jsx';
import { fertilizerAPI } from '../services/api.js';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const FADE = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } } };
const CROPS = ['Rice', 'Coconut', 'Banana', 'Pepper', 'Rubber', 'Cardamom', 'Tapioca', 'Sugarcane'];
const SOIL_TYPES = ['laterite', 'clay', 'loam', 'sandy', 'red', 'alluvial'];
const STAGES = ['vegetative', 'flowering', 'fruiting'];
const sColor = (c) => ({ red: 'text-red-400 bg-red-400/10 border-red-400/25', amber: 'text-amber-400 bg-amber-400/10 border-amber-400/25', green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25' }[c] || 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25');

export default function FertilizerPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ crop: 'Rice', nitrogen: '', phosphorus: '', potassium: '', soil_type: 'laterite', area_hectares: '1', growth_stage: 'vegetative' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const u = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nitrogen || !form.phosphorus || !form.potassium) { toast.error(t('fertilizer.enter_levels')); return; }
    setLoading(true);
    try {
      const data = await fertilizerAPI.recommend({ crop: form.crop, nitrogen: +form.nitrogen, phosphorus: +form.phosphorus, potassium: +form.potassium, soil_type: form.soil_type, area_hectares: +form.area_hectares || 1, growth_stage: form.growth_stage });
      setResults(data); toast.success(t('fertilizer.generated'));
    } catch { toast.error(t('fertilizer.offline')); }
    finally { setLoading(false); }
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={FADE} className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-amber-400/70 uppercase mb-2">{t('fertilizer.module')}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{t('fertilizer.title')}</h1>
          <p className="text-foreground/50 text-lg font-light">{t('fertilizer.subtitle')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          <motion.form initial="hidden" animate="visible" variants={FADE} onSubmit={submit} className="lg:col-span-2 bg-surface border border-surface2 rounded-2xl p-6 space-y-4 h-fit">
            <p className="text-xs font-semibold tracking-widest text-foreground/40 uppercase">{t('fertilizer.soil_test_data')}</p>
            <div className="space-y-1.5">
              <label className="text-xs text-foreground/40 uppercase tracking-widest font-semibold">{t('fertilizer.target_crop')}</label>
              <div className="grid grid-cols-4 gap-1.5">
                {CROPS.map(c => (<button key={c} type="button" onClick={() => setForm(p => ({ ...p, crop: c }))} className={`px-2 py-2 rounded-lg text-xs font-medium border transition-all ${form.crop === c ? 'bg-cyan-400/10 border-cyan-400/40 text-cyan-400' : 'bg-surface2/30 border-surface2 text-foreground/40 hover:text-white'}`}>{t('fertilizer.crop_' + c.toLowerCase())}</button>))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ l: 'N', f: 'nitrogen', c: 'text-emerald-400' }, { l: 'P', f: 'phosphorus', c: 'text-blue-400' }, { l: 'K', f: 'potassium', c: 'text-amber-400' }].map(({ l, f, c }) => (
                <div key={f}><label className={`text-xs uppercase tracking-widest font-bold ${c}`}>{l} <span className="text-foreground/20 font-normal">kg/ha</span></label>
                  <input type="number" step="1" min="0" value={form[f]} onChange={u(f)} placeholder="0" className="w-full bg-surface2/50 border border-surface2 text-white rounded-xl px-3 py-2.5 text-sm mt-1.5 focus:outline-none focus:border-cyan-400/50 placeholder:text-foreground/20" /></div>
              ))}
            </div>
            <div><label className="text-xs text-foreground/40 uppercase tracking-widest font-semibold">{t('fertilizer.soil_type')}</label>
              <select value={form.soil_type} onChange={u('soil_type')} className="w-full bg-surface2/50 border border-surface2 text-white rounded-xl px-3 py-2.5 text-sm mt-1.5 focus:outline-none focus:border-cyan-400/50">
                {SOIL_TYPES.map(s => <option key={s} value={s}>{t('advisor.soil_' + s.toLowerCase())}</option>)}
              </select></div>
            <div><label className="text-xs text-foreground/40 uppercase tracking-widest font-semibold">{t('fertilizer.growth_stage')}</label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">{STAGES.map(s => (<button key={s} type="button" onClick={() => setForm(p => ({ ...p, growth_stage: s }))} className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all capitalize ${form.growth_stage === s ? 'bg-cyan-400/10 border-cyan-400/40 text-cyan-400' : 'bg-surface2/30 border-surface2 text-foreground/40 hover:text-white'}`}>{t('fertilizer.stage_' + s.toLowerCase())}</button>))}</div></div>
            <div><label className="text-xs text-foreground/40 uppercase tracking-widest font-semibold">{t('fertilizer.area_ha')}</label>
              <input type="number" step="0.1" min="0.1" value={form.area_hectares} onChange={u('area_hectares')} className="w-full bg-surface2/50 border border-surface2 text-white rounded-xl px-3 py-2.5 text-sm mt-1.5 focus:outline-none focus:border-cyan-400/50" /></div>
            <button type="submit" disabled={loading} className="w-full bg-cyan-400 text-background py-3 rounded-xl font-semibold hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> {t('fertilizer.calculating')}</> : <><FlaskConical size={16} /> {t('fertilizer.generate')}</>}
            </button>
          </motion.form>

          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div key="r" initial="hidden" animate="visible" variants={FADE} className="space-y-4">
                  <div className="bg-surface border border-surface2 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div><p className="text-xs text-foreground/40 uppercase tracking-widest mb-1">{t('fertilizer.schedule_for')}</p><h2 className="text-xl font-bold text-white">{t('fertilizer.crop_' + results.crop.toLowerCase())}</h2><p className="text-xs text-foreground/30">{results.area_hectares} {t('fertilizer.ha')} · {t('fertilizer.stage_' + results.growth_stage.toLowerCase())}</p></div>
                      {results.total_cost_estimate && <div className="text-right"><p className="text-xs text-foreground/40 flex items-center gap-1 justify-end"><DollarSign size={10} /> {t('fertilizer.est_cost')}</p><p className="text-sm text-cyan-400 font-medium">{results.total_cost_estimate}</p></div>}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[{ l: 'N', r: results.required_npk?.N, c: results.current_npk?.N, bg: 'bg-emerald-400', tc: 'text-emerald-400' }, { l: 'P', r: results.required_npk?.P, c: results.current_npk?.P, bg: 'bg-blue-400', tc: 'text-blue-400' }, { l: 'K', r: results.required_npk?.K, c: results.current_npk?.K, bg: 'bg-amber-400', tc: 'text-amber-400' }].map(({ l, r, c, bg, tc }) => (
                        <div key={l} className="bg-surface2/30 rounded-xl p-3"><div className="flex justify-between text-xs mb-1"><span className={`font-bold ${tc}`}>{l}</span><span className="text-foreground/30">{c}/{r}</span></div><div className="w-full bg-surface rounded-full h-1.5"><div className={`${bg} rounded-full h-1.5 transition-all duration-700`} style={{ width: `${Math.min((c / r) * 100, 100)}%` }} /></div></div>
                      ))}
                    </div>
                  </div>
                  {results.npk_schedule?.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-surface border border-surface2 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-3"><h3 className="text-white font-semibold">{item.nutrient}</h3><span className={`px-3 py-1 rounded-full text-xs font-semibold border ${sColor(item.color)}`}>{item.status}</span></div>
                      {item.deficiency > 0 ? (<div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-foreground/40">{t('fertilizer.product')}</span><span className="text-white">{item.product}</span></div>
                        <div className="flex justify-between"><span className="text-foreground/40">{t('fertilizer.quantity')}</span><span className="text-cyan-400 font-semibold">{item.quantity_kg} kg</span></div>
                        <p className="text-foreground/50 text-xs bg-surface2/30 rounded-lg px-3 py-2"><BarChart3 size={10} className="inline mr-1" />{item.application}</p>
                        <p className="text-foreground/30 text-xs">⏰ {item.timing}</p>
                      </div>) : <p className="text-sm text-emerald-400/70">{item.application}</p>}
                    </motion.div>
                  ))}
                  {results.soil_advice && <div className="bg-surface border border-surface2 rounded-2xl p-5"><p className="text-xs uppercase tracking-widest text-foreground/30 mb-2 flex items-center gap-1"><Lightbulb size={10} /> {t('fertilizer.soil_advice')}</p><p className="text-sm text-foreground/60">{results.soil_advice}</p></div>}
                  {results.organic_recommendations?.length > 0 && <div className="bg-surface border border-surface2 rounded-2xl p-5"><p className="text-xs uppercase tracking-widest text-foreground/30 mb-3 flex items-center gap-1"><Leaf size={10} className="text-emerald-400" /> {t('fertilizer.organic')}</p>{results.organic_recommendations.map((r, i) => <p key={i} className="text-sm text-foreground/60 mb-1">🌿 <strong className="text-white">{r.product}</strong> — {r.note}</p>)}</div>}
                </motion.div>
              ) : !loading && (
                <motion.div key="e" initial="hidden" animate="visible" variants={FADE} className="flex flex-col items-center justify-center text-center bg-surface/30 border border-surface2 border-dashed rounded-2xl p-16">
                  <FlaskConical size={44} className="text-surface2 mb-4" /><p className="text-foreground/30 font-light whitespace-pre-line">{t('fertilizer.enter_data')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
