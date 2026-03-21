/**
 * Terra Intelligence — Disease Scanner Page
 * Drag-and-drop image upload → AI disease diagnosis with result cards
 */
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Leaf, AlertTriangle, ShieldCheck, Loader2,
  Bug, Pill, Shield, Clock, ChevronDown, ChevronUp
} from 'lucide-react';
import AppLayout from '../components/AppLayout.jsx';
import { diseaseAPI } from '../services/api.js';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const FADE = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

export default function DiseaseScanPage() {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTreatment, setShowTreatment] = useState(true);

  const onDrop = useCallback((accepted) => {
    if (accepted.length === 0) return;
    const file = accepted[0];
    setPreview(URL.createObjectURL(file));
    setResult(null);
    scanImage(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const scanImage = async (file) => {
    setLoading(true);
    try {
      const data = await diseaseAPI.scan(file);
      setResult(data);
      toast.success(t('scanner.scan_complete'));
    } catch {
      toast.error(t('scanner.offline'));
    } finally {
      setLoading(false);
    }
  };

  const severityColor = (sev) => {
    const s = (sev || '').toLowerCase();
    if (s === 'critical') return 'text-red-400 bg-red-400/10 border-red-400/25';
    if (s === 'high') return 'text-amber-400 bg-amber-400/10 border-amber-400/25';
    if (s === 'medium') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25';
    return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25';
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={FADE} className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-emerald-400/70 uppercase mb-2">{t('scanner.module')}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{t('scanner.title')}</h1>
          <p className="text-foreground/50 text-lg font-light">{t('scanner.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Zone */}
          <motion.div initial="hidden" animate="visible" variants={FADE}>
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[360px] ${
                isDragActive
                  ? 'border-cyan-400 bg-cyan-400/5'
                  : 'border-surface2 bg-surface hover:border-foreground/20 hover:bg-surface2/30'
              }`}
            >
              <input {...getInputProps()} />
              {preview ? (
                <img src={preview} alt="Uploaded crop" className="w-full h-full object-cover rounded-2xl absolute inset-0" />
              ) : (
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-surface2 border border-surface flex items-center justify-center mx-auto mb-5">
                    <Upload size={28} className="text-cyan-400" />
                  </div>
                  <p className="text-white font-medium mb-1">{t('scanner.drop_image')}</p>
                  <p className="text-foreground/40 text-sm">{t('scanner.click_browse')}</p>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10">
                  <Loader2 size={36} className="text-cyan-400 animate-spin mb-3" />
                  <p className="text-sm text-foreground/60">{t('scanner.analyzing')}</p>
                </div>
              )}
            </div>
            {preview && !loading && (
              <button
                onClick={() => { setPreview(null); setResult(null); }}
                className="mt-3 text-sm text-foreground/40 hover:text-white transition-colors"
              >
                {t('scanner.clear_upload')}
              </button>
            )}
          </motion.div>

          {/* Results Panel */}
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Disease Name Card */}
                <div className="bg-surface border border-surface2 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-foreground/40 uppercase tracking-widest mb-1">{t('scanner.diagnosis')}</p>
                      <h2 className="text-2xl font-bold text-white">{result.name}</h2>
                      {result.crop && <p className="text-foreground/50 text-sm mt-1">{t('scanner.crop')}: {result.crop}</p>}
                    </div>
                    {result.severity && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${severityColor(result.severity)}`}>
                        {result.severity}
                      </span>
                    )}
                  </div>
                  {result.confidence && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground/40">{t('scanner.confidence')}</span>
                        <span className="text-cyan-400">{result.confidence}%</span>
                      </div>
                      <div className="w-full bg-surface2 rounded-full h-2">
                        <div className="bg-cyan-400 rounded-full h-2 transition-all duration-700" style={{ width: `${result.confidence}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Cause */}
                {result.cause && (
                  <div className="bg-surface border border-surface2 rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-xs tracking-widest text-foreground/40 uppercase mb-2">
                      <Bug size={12} /> {t('scanner.pathogen')}
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">{result.cause}</p>
                  </div>
                )}

                {/* Symptoms */}
                {result.symptoms?.length > 0 && (
                  <div className="bg-surface border border-surface2 rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-xs tracking-widest text-foreground/40 uppercase mb-3">
                      <AlertTriangle size={12} /> {t('scanner.symptoms')}
                    </div>
                    <ul className="space-y-2">
                      {result.symptoms.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Treatment */}
                <div className="bg-surface border border-surface2 rounded-2xl p-5">
                  <button onClick={() => setShowTreatment(!showTreatment)} className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs tracking-widest text-foreground/40 uppercase">
                      <Pill size={12} /> {t('scanner.treatment')}
                    </div>
                    {showTreatment ? <ChevronUp size={14} className="text-foreground/30" /> : <ChevronDown size={14} className="text-foreground/30" />}
                  </button>
                  <AnimatePresence>
                    {showTreatment && result.treatment && (
                      <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 space-y-2 overflow-hidden">
                        {result.treatment.map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                            <span className="text-cyan-400 font-mono text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>{t}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {/* Urgency + Prevention */}
                <div className="grid grid-cols-2 gap-3">
                  {result.urgency && (
                    <div className="bg-surface border border-surface2 rounded-2xl p-4">
                      <div className="flex items-center gap-1.5 text-xs tracking-widest text-foreground/40 uppercase mb-2"><Clock size={11} /> {t('scanner.urgency')}</div>
                      <p className="text-sm text-amber-300">{result.urgency}</p>
                    </div>
                  )}
                  {result.prevention && (
                    <div className="bg-surface border border-surface2 rounded-2xl p-4">
                      <div className="flex items-center gap-1.5 text-xs tracking-widest text-foreground/40 uppercase mb-2"><Shield size={11} /> {t('scanner.prevention')}</div>
                      <p className="text-sm text-foreground/60">{result.prevention}</p>
                    </div>
                  )}
                </div>

                {/* Source tag */}
                <p className="text-xs text-foreground/20 text-right">
                  {result.source === 'openai_vision' ? t('scanner.source_ai') : t('scanner.source_db')}
                </p>
              </motion.div>
            ) : !loading ? (
              <motion.div
                key="empty"
                initial="hidden" animate="visible" variants={FADE}
                className="flex flex-col items-center justify-center text-center bg-surface/30 border border-surface2 border-dashed rounded-2xl p-10"
              >
                <Leaf size={40} className="text-surface2 mb-4" />
                <p className="text-foreground/30 font-light">{t('scanner.upload_to_begin')}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
