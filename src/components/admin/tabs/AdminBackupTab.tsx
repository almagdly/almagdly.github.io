import React, { useState } from 'react';
import {
  DownloadSimple,
  UploadSimple,
  Code,
  ArrowCounterClockwise,
  CheckCircle,
  Copy,
  Warning,
} from '@phosphor-icons/react';
import { adminStore } from '../../../services/adminStore';

export const AdminBackupTab: React.FC = () => {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExportJson = () => {
    try {
      const dataStr = adminStore.exportAllDataAsJson();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `almagd_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setFeedback({ type: 'success', text: 'تم تنزيل النسخة الاحتياطية بنجاح!' });
    } catch (e: any) {
      setFeedback({ type: 'error', text: 'فشل التصدير: ' + e.message });
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const res = adminStore.importAllDataFromJson(content);
      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
      } else {
        setFeedback({ type: 'error', text: res.message });
      }
    };
    reader.onerror = () => {
      setFeedback({ type: 'error', text: 'تعذر قراءة الملف المرفوع' });
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (
      window.confirm(
        'تحذير: هل أنت متأكد من استعادة النسخة الافتراضية؟ سيتم مسح أي تعديلات محلية على التصاميم والعودة للتصاميم الأصلية.'
      )
    ) {
      adminStore.resetDesignsToDefault();
      setFeedback({ type: 'success', text: 'تمت استعادة التصاميم الافتراضية بنجاح!' });
    }
  };

  const handleCopyCode = () => {
    const designs = adminStore.getDesigns();
    const code = `import { DesignItem } from '../types';\nimport { getProjectImage } from '../utils/images';\n\nexport const designsData: DesignItem[] = ${JSON.stringify(
      designs,
      null,
      2
    )};\n`;

    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-brand-ivory font-arabic">
          النسخ الاحتياطي وتصدير البيانات
        </h2>
        <p className="text-xs text-brand-ivory/60">
          تصدير واستيراد بيانات الموقع بالكامل أو استخراج الكود البرمجي للمطورين
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle size={18} weight="fill" /> : <Warning size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export JSON Card */}
        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-gold/20 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center">
              <DownloadSimple size={22} weight="bold" />
            </div>
            <h3 className="text-sm font-bold text-brand-ivory">تصدير نسخة احتياطية (JSON)</h3>
            <p className="text-xs text-brand-ivory/60 leading-relaxed">
              تحميل ملف بصيغة JSON يحتوي على جميع التصاميم المحدثة، وطلبات العملاء، وإعدادات الموقع كاملة لحفظها بأمان.
            </p>
          </div>

          <button
            onClick={handleExportJson}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-gold to-amber-500 text-brand-dark hover:brightness-110 shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2"
          >
            <DownloadSimple size={16} weight="bold" />
            <span>تنزيل النسخة الاحتياطية الآن</span>
          </button>
        </div>

        {/* Import JSON Card */}
        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-gold/20 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <UploadSimple size={22} weight="bold" />
            </div>
            <h3 className="text-sm font-bold text-brand-ivory">استيراد نسخة احتياطية</h3>
            <p className="text-xs text-brand-ivory/60 leading-relaxed">
              استعادة البيانات السابقة من ملف JSON تم تصديره مسبقاً، وسيتم تحديث المعرض والطلبات فوراً.
            </p>
          </div>

          <label className="cursor-pointer w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-black/40 border border-brand-gold/30 text-brand-champagne hover:bg-brand-gold/15 transition-all flex items-center justify-center gap-2">
            <UploadSimple size={16} weight="bold" />
            <span>اختر ملف JSON للاستيراد</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
        </div>

        {/* Export TypeScript Code */}
        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-gold/20 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Code size={22} weight="bold" />
            </div>
            <h3 className="text-sm font-bold text-brand-ivory">نسخ كود TypeScript المحدث</h3>
            <p className="text-xs text-brand-ivory/60 leading-relaxed">
              توليد كود ملف <code className="text-brand-gold font-mono">designsData.ts</code> متضمناً كافة التصاميم المضافة ليتمكن المطور من وضعه مباشرة في المستودع.
            </p>
          </div>

          <button
            onClick={handleCopyCode}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-black/40 border border-brand-gold/30 text-brand-champagne hover:bg-brand-gold/15 transition-all flex items-center justify-center gap-2"
          >
            {copied ? <CheckCircle size={16} className="text-emerald-400" weight="fill" /> : <Copy size={16} weight="bold" />}
            <span>{copied ? 'تم نسخ الكود إلى الحافظة!' : 'نسخ كود designsData.ts'}</span>
          </button>
        </div>

        {/* Reset to Default */}
        <div className="p-6 rounded-2xl bg-brand-surface border border-rose-500/20 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <ArrowCounterClockwise size={22} weight="bold" />
            </div>
            <h3 className="text-sm font-bold text-rose-300">استعادة التصاميم الافتراضية</h3>
            <p className="text-xs text-brand-ivory/60 leading-relaxed">
              مسح أي تعديلات محلية وتصاميم أضيفت مؤخراً في المتصفح والعودة للتصاميم المعتمدة الأصلية (172 تصميم).
            </p>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-all flex items-center justify-center gap-2"
          >
            <ArrowCounterClockwise size={16} weight="bold" />
            <span>استعادة التصاميم الأصلية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
