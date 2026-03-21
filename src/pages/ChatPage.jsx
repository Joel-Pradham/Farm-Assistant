import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Loader2, Bot, User, Sparkles } from 'lucide-react';
import AppLayout from '../components/AppLayout.jsx';
import { chatAPI } from '../services/api.js';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const FADE = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } } };
// Suggestions moved inside the component to be translatable

export default function ChatPage() {
  const { t } = useTranslation();
  const SUGGESTIONS = [
    t('chat.sug1'),
    t('chat.sug2'),
    t('chat.sug3'),
    t('chat.sug4'),
  ];
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const hist = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const data = await chatAPI.send(msg, hist);
      setMessages(prev => [...prev, { role: 'assistant', content: data.response, source: data.source }]);
    } catch {
      toast.error(t('chat.offline'));
      setMessages(prev => [...prev, { role: 'assistant', content: t('chat.offline_msg'), source: 'error' }]);
    } finally { setLoading(false); }
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-72px)]">
        {/* Header */}
        <div className="px-6 md:px-10 py-5 border-b border-surface2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-400/10 border border-violet-400/20 flex items-center justify-center">
              <Sparkles size={18} className="text-violet-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{t('chat.title')}</h1>
              <p className="text-xs text-foreground/40">{t('chat.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6 space-y-4">
          {messages.length === 0 && (
            <motion.div initial="hidden" animate="visible" variants={FADE} className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface border border-surface2 flex items-center justify-center mb-6">
                <MessageSquare size={28} className="text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{t('chat.ask_anything')}</h2>
              <p className="text-foreground/40 text-sm mb-8 max-w-md">{t('chat.intro')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)} className="text-left bg-surface border border-surface2 rounded-xl px-4 py-3 text-sm text-foreground/50 hover:text-white hover:border-cyan-400/30 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot size={14} className="text-cyan-400" />
                </div>
              )}
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-400 text-background font-medium'
                  : 'bg-surface border border-surface2 text-foreground/80'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.source && msg.role === 'assistant' && (
                  <p className="text-xs mt-2 opacity-40">{msg.source === 'openai' ? '🤖 OpenAI' : msg.source === 'rule_engine' ? '📋 Rule Engine' : ''}</p>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center shrink-0 mt-1">
                  <User size={14} className="text-foreground/60" />
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-cyan-400" />
              </div>
              <div className="bg-surface border border-surface2 rounded-2xl px-5 py-3">
                <div className="flex items-center gap-2 text-sm text-foreground/40">
                  <Loader2 size={14} className="animate-spin" /> {t('chat.analyzing')}
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="px-6 md:px-10 py-4 border-t border-surface2 bg-surface/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 max-w-3xl mx-auto">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder={t('chat.placeholder')} rows={1}
              className="flex-1 bg-surface border border-surface2 text-white rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-cyan-400/50 transition-colors placeholder:text-foreground/25" />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              className="bg-cyan-400 text-background p-3 rounded-xl hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
