import React, { useState } from 'react';
import {
  Gear,
  FloppyDisk,
  Key,
  WhatsappLogo,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  ShieldCheck,
} from '@phosphor-icons/react';
import { SiteSettings } from '../../../types/admin';
import { adminStore } from '../../../services/adminStore';

interface Props {
  settings: SiteSettings;
}

export const AdminSettingsTab: React.FC<Props> = ({ settings }) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminStore.updateSettings(formData);
    setSaveMessage('تم حفظ إعدادات الموقع ومعلومات التواصل بنجاح!');
    setTimeout(() => setSaveMessage(null), 4000);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage(null);

    if (!adminStore.verifyPin(currentPin)) {
      setPinMessage({ type: 'error', text: 'رمز المرور الحالي غير صحيح!' });
      return;
    }

    if (newPin.trim().length < 4) {
      setPinMessage({ type: 'error', text: 'يجب أن يتكون رمز المرور الجديد من 4 خانات على الأقل!' });
      return;
    }

    if (newPin !== confirmPin) {
      setPinMessage({ type: 'error', text: 'الرمز الجديد وتأكيده غير متطابقين!' });
      return;
    }

    if (adminStore.changePin(newPin)) {
      setPinMessage({ type: 'success', text: 'تم تغيير رمز مرور لوحة التحكم بنجاح!' });
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => setPinMessage(null), 4000);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-brand-ivory font-arabic">
          إعدادات الموقع ومعلومات التواصل
        </h2>
        <p className="text-xs text-brand-ivory/60">
          تعديل أرقام الهواتف وحسابات التواصل الاجتماعي وأمان لوحة التحكم
        </p>
      </div>

      {saveMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle size={18} weight="fill" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSettingsSubmit} className="p-6 rounded-2xl bg-brand-surface border border-brand-gold/20 space-y-6 shadow-md">
        <h3 className="text-sm font-bold text-brand-ivory flex items-center gap-2 border-b border-brand-gold/15 pb-3">
          <Phone size={18} className="text-brand-gold" weight="duotone" />
          <span>بيانات التواصل وساعات العمل</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-ivory/90">رقم الهاتف الرسمي</label>
            <input
              type="text"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              dir="ltr"
              className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs font-mono text-brand-ivory focus:outline-none focus:border-brand-gold transition-all"
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-ivory/90">رقم الواتساب (مع كود الدولة 218)</label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
              dir="ltr"
              placeholder="218945919679"
              className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs font-mono text-brand-ivory focus:outline-none focus:border-brand-gold transition-all"
            />
          </div>

          {/* Facebook */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-ivory/90">رابط صفحة فيسبوك</label>
            <input
              type="text"
              value={formData.facebookUrl}
              onChange={e => setFormData({ ...formData, facebookUrl: e.target.value })}
              dir="ltr"
              className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs font-mono text-brand-ivory focus:outline-none focus:border-brand-gold transition-all"
            />
          </div>

          {/* TikTok */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-ivory/90">رابط حساب تيك توك</label>
            <input
              type="text"
              value={formData.tiktokUrl}
              onChange={e => setFormData({ ...formData, tiktokUrl: e.target.value })}
              dir="ltr"
              className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs font-mono text-brand-ivory focus:outline-none focus:border-brand-gold transition-all"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-semibold text-brand-ivory/90">عنوان المعرض والإدارة</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs text-brand-ivory focus:outline-none focus:border-brand-gold transition-all"
            />
          </div>

          {/* Working Hours */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-semibold text-brand-ivory/90">مواعيد وساعات العمل</label>
            <input
              type="text"
              value={formData.workingHours}
              onChange={e => setFormData({ ...formData, workingHours: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs text-brand-ivory focus:outline-none focus:border-brand-gold transition-all"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-gold to-amber-500 text-brand-dark hover:brightness-110 shadow-lg shadow-brand-gold/20 transition-all"
          >
            <FloppyDisk size={16} weight="bold" />
            <span>حفظ الإعدادات</span>
          </button>
        </div>
      </form>

      {/* Security & PIN Settings */}
      <form onSubmit={handlePinSubmit} className="p-6 rounded-2xl bg-brand-surface border border-brand-gold/20 space-y-6 shadow-md">
        <h3 className="text-sm font-bold text-brand-ivory flex items-center gap-2 border-b border-brand-gold/15 pb-3">
          <Key size={18} className="text-brand-gold" weight="duotone" />
          <span>تغيير رمز المرور السري (Admin PIN)</span>
        </h3>

        {pinMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs font-bold ${
              pinMessage.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}
          >
            {pinMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-ivory/90">رمز المرور الحالي</label>
            <input
              type="password"
              value={currentPin}
              onChange={e => setCurrentPin(e.target.value)}
              placeholder="الرمز الحالي"
              dir="ltr"
              className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs font-mono text-brand-ivory focus:outline-none focus:border-brand-gold transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-ivory/90">رمز المرور الجديد</label>
            <input
              type="password"
              value={newPin}
              onChange={e => setNewPin(e.target.value)}
              placeholder="4 خانات على الأقل"
              dir="ltr"
              className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs font-mono text-brand-ivory focus:outline-none focus:border-brand-gold transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-brand-ivory/90">تأكيد الرمز الجديد</label>
            <input
              type="password"
              value={confirmPin}
              onChange={e => setConfirmPin(e.target.value)}
              placeholder="أعد إدخال الرمز"
              dir="ltr"
              className="w-full px-4 py-2.5 bg-black/40 border border-brand-gold/30 rounded-xl text-xs font-mono text-brand-ivory focus:outline-none focus:border-brand-gold transition-all"
              required
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-black/40 border border-brand-gold/30 text-brand-champagne hover:bg-brand-gold/15 transition-all"
          >
            <Key size={16} weight="bold" />
            <span>تحديث رمز المرور</span>
          </button>
        </div>
      </form>
    </div>
  );
};
