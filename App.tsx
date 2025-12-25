
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { CATEGORIES } from './constants';
import { Excuse, AppStatus, ExcuseCategory } from './types';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ExcuseCategory>(CATEGORIES[0]);
  const [currentExcuse, setCurrentExcuse] = useState<Excuse | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [history, setHistory] = useState<Excuse[]>([]);

  const geminiService = useMemo(() => new GeminiService(), []);

  const handleGenerate = async () => {
    setStatus(AppStatus.GENERATING);
    try {
      const excuse = await geminiService.generateExcuse(
        selectedCategory.label, 
        selectedCategory.promptHint
      );
      setCurrentExcuse(excuse);
      setHistory(prev => [excuse, ...prev].slice(0, 5));
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      console.error("Failed to generate excuse:", error);
      setStatus(AppStatus.ERROR);
    }
  };

  const handleShare = async () => {
    if (!currentExcuse) return;
    const text = `Check out this excuse for being ${selectedCategory.label.toLowerCase()}: "${currentExcuse.title}" - ${currentExcuse.detail}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Instant Excuse',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(text);
      alert('Excuse copied to clipboard!');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 flex flex-col items-center overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <header className="sticky top-0 z-30 w-full glass-card border-b border-slate-800/50 py-4 px-6 flex justify-between items-center backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-xl">🏃‍♂️</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">
            Excuse<span className="text-indigo-400">Gen</span>
          </h1>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </header>

      <main className="flex-1 w-full max-w-lg px-6 py-8 flex flex-col gap-8 z-10">
        
        {/* Category Selector */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 px-1">
            Pick Your Situation
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 border-2 ${
                  selectedCategory.id === cat.id 
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10 scale-105' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className={`text-[11px] font-bold uppercase tracking-tight text-center ${
                  selectedCategory.id === cat.id ? 'text-white' : 'text-slate-400'
                }`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Action Button */}
        <section className="flex justify-center">
          <button
            disabled={status === AppStatus.GENERATING}
            onClick={handleGenerate}
            className={`w-full relative group overflow-hidden py-5 rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
              status === AppStatus.GENERATING 
                ? 'bg-slate-800 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right'
            } text-white font-bold text-lg shadow-2xl shadow-indigo-500/40`}
          >
            {status === AppStatus.GENERATING ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                <span>Inventing Excuse...</span>
              </>
            ) : (
              <>
                <span className="text-2xl">✨</span>
                <span>Generate Instant Excuse</span>
              </>
            )}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </button>
        </section>

        {/* Excuse Display Area */}
        <section className="min-h-[320px] relative">
          {status === AppStatus.IDLE && (
            <div className="h-full border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-slate-900/30">
              <div className="text-6xl mb-4 opacity-50">☝️</div>
              <p className="text-slate-400 font-medium">Select a category and hit that button to save your day!</p>
            </div>
          )}

          {status === AppStatus.SUCCESS && currentExcuse && (
            <div className="animate-in fade-in zoom-in duration-500 p-8 rounded-3xl bg-slate-900/60 backdrop-blur-sm border border-slate-800 shadow-2xl flex flex-col items-center text-center">
              <div className="flex gap-1 mb-6">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-4 rounded-full ${
                      i < currentExcuse.absurdityLevel 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
              <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
                Absurdity: {currentExcuse.absurdityLevel}/10
              </span>
              <h3 className="text-3xl font-extrabold text-white mb-4 leading-tight">
                {currentExcuse.title}
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed italic">
                "{currentExcuse.detail}"
              </p>

              <div className="mt-8 flex gap-3 w-full">
                <button 
                  onClick={handleShare}
                  className="flex-1 py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center justify-center gap-2 transition-all border border-white/5"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          )}

          {status === AppStatus.ERROR && (
            <div className="h-full border border-red-900/30 bg-red-950/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center">
              <div className="text-4xl mb-2">🚫</div>
              <h3 className="text-red-400 font-bold mb-2">Oops! The creative juices failed.</h3>
              <p className="text-slate-500 text-sm">Please try again or check your connection.</p>
              <button 
                onClick={handleGenerate}
                className="mt-6 text-indigo-400 font-bold underline"
              >
                Retry
              </button>
            </div>
          )}
        </section>

        {/* History Section */}
        {history.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 px-1">
              Your Recent Excuses
            </h2>
            <div className="flex flex-col gap-3">
              {history.map((exc, idx) => (
                <div 
                  key={exc.id} 
                  className={`p-4 rounded-2xl border border-slate-800 bg-slate-900/40 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-800/50 transition-colors ${idx === 0 && status === AppStatus.SUCCESS ? 'border-indigo-500/30' : ''}`}
                  onClick={() => {
                    setCurrentExcuse(exc);
                    setStatus(AppStatus.SUCCESS);
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-[10px] font-bold text-indigo-500 uppercase">{exc.category}</span>
                    </div>
                    <h4 className="text-white font-bold text-sm truncate max-w-[200px]">{exc.title}</h4>
                  </div>
                  <div className="text-slate-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      <footer className="w-full max-w-lg px-6 py-8 text-center">
        <p className="text-slate-600 text-[11px] font-medium tracking-wide uppercase">
          Generated with AI for maximum plausible deniability. 
          <br/>
          Stay family-friendly, stay creative.
        </p>
      </footer>
    </div>
  );
};

export default App;
