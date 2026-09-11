import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, Eye, EyeSlash, Key } from '@phosphor-icons/react';
import { adminStore } from '../../services/adminStore';

interface Props {
  onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<Props> = ({ onLoginSuccess }) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('الرجاء إدخال رمز المرور');
      return;
    }

    if (adminStore.login(pin, rememberMe)) {
      setError('');
      onLoginSuccess();
    } else {
      setError('رمز المرور غير صحيح، يرجى المحاولة مرة أخرى');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-950/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="relative w-full max-w-md bg-brand-surface/90 border border-brand-gold/30 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Brand Icon Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-gold to-amber-600 text-brand-dark shadow-lg shadow-brand-gold/20 mb-2">
            <ShieldCheck size={36} weight="duotone" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-ivory font-arabic tracking-tight">
            لوحة تحكم <span className="text-gold-gradient">المجد</span>
          </h1>
          <p className="text-xs sm:text-sm text-brand-ivory/60 font-light">
            بوابة الإدارة المركزية لإدارة المحتوى والطلبات
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-brand-ivory/80">
              رمز الدخول السري (PIN)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-brand-gold">
                <Key size={20} weight="duotone" />
              </div>
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={e => {
                  setPin(e.target.value);
                  if (error) setError('');
                }}
                placeholder="أدخل رمز المرور (الافتراضي 2026)"
                dir="ltr"
                className="w-full pl-11 pr-11 py-3.5 bg-black/40 border border-brand-gold/30 rounded-xl text-center text-lg font-mono text-brand-ivory placeholder:text-brand-ivory/30 placeholder:text-xs placeholder:font-arabic focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-ivory/50 hover:text-brand-gold transition-colors"
                title={showPin ? 'إخفاء الرمز' : 'إظهار الرمز'}
              >
                {showPin ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1.5 animate-shake">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-brand-ivory/70">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-brand-gold/40 text-brand-gold focus:ring-brand-gold bg-black/50"
              />
              <span>تذكر تسجيل الدخول</span>
            </label>
            <span className="text-[11px] text-brand-ivory/40">الرمز الافتراضي: 2026</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-gold via-amber-500 to-brand-gold text-brand-dark hover:brightness-110 shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2"
          >
            <Lock size={18} weight="bold" />
            <span>تسجيل الدخول إلى اللوحة</span>
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-brand-gold/15 text-center">
          <a
            href="#/"
            className="inline-flex items-center gap-2 text-xs text-brand-ivory/60 hover:text-brand-gold transition-colors"
          >
            <ArrowRight size={14} />
            <span>العودة إلى الموقع الرئيسي</span>
          </a>
        </div>
      </div>
    </div>
  );
};
