import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PaperPlaneTilt, WhatsappLogo, CheckCircle, UploadSimple, ShieldCheck } from '@phosphor-icons/react';
import { getWhatsAppUrl, getProjectFormWhatsAppMessage } from '../utils/whatsapp';
import { adminStore } from '../services/adminStore';

export const ProjectRequestPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    projectType: 'مطبخ عصري (PVC / MDF)',
    location: '',
    spaceSize: '',
    preferredStyle: 'مودرن Modern',
    budgetRange: '',
    details: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Save inquiry to admin dashboard
    adminStore.addInquiry({
      name: formData.name || 'عميل بدون اسم',
      phone: formData.phone || '',
      type: 'project_request',
      projectType: formData.projectType || 'مطبخ عصري',
      location: formData.location,
      spaceSize: formData.spaceSize,
      preferredStyle: formData.preferredStyle,
      budgetRange: formData.budgetRange,
      details: formData.details,
    });
    
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#BB9A6B', '#DFCAA7', '#043337', '#F6F1E8'],
      });
    } catch {
      // Safe fallback
    }
  };

  const whatsAppUrl = getWhatsAppUrl(getProjectFormWhatsAppMessage(formData));

  return (
    <div className="pt-28 pb-20 bg-brand-dark min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-ivory tracking-tight font-arabic">
            ابدأ <span className="text-gold-gradient">مشروعك</span> معنا
          </h1>
          <p className="text-xs sm:text-sm text-brand-ivory/70 mt-2.5 leading-relaxed font-light">
            املأ بيانات مساحتك وسيقوم فريق شركة المجد في البيضاء بالتواصل معك لمناقشة التصميم وأخذ المقاسات بدقة
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-brand-surface/60 border border-brand-gold/30 rounded-3xl p-6 sm:p-8 shadow-luxury backdrop-blur-xl">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-brand-gold mb-1.5">
                    الاسم الكامل <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="مثال: أحمد بوعويان"
                    className="w-full bg-brand-dark/90 border border-brand-gold/20 focus:border-brand-gold rounded-xl px-4 py-2.5 text-xs sm:text-sm text-brand-ivory placeholder-brand-ivory/30 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-gold mb-1.5">
                    رقم الهاتف / واتساب (ليبي) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="09X XXXXXXX"
                    className="w-full bg-brand-dark/90 border border-brand-gold/20 focus:border-brand-gold rounded-xl px-4 py-2.5 text-xs sm:text-sm text-brand-ivory placeholder-brand-ivory/30 outline-none text-right transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Project Type & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-brand-gold mb-1.5">
                    نوع العمل المطلوب <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full bg-brand-dark/90 border border-brand-gold/20 focus:border-brand-gold rounded-xl px-4 py-2.5 text-xs sm:text-sm text-brand-ivory outline-none cursor-pointer"
                  >
                    <option value="مطبخ عصري (PVC / MDF)">مطبخ عصري حديث (PVC / MDF)</option>
                    <option value="أبواب ونوافذ PVC فاخرة">أبواب ونوافذ PVC فاخرة</option>
                    <option value="غرفة نوم / جناح رئيسي">غرفة نوم / جناح رئيسي تفصيل</option>
                    <option value="خزائن ودولاب ملابس (Closet)">خزائن ودولاب ملابس (Closet)</option>
                    <option value="غرفة معيشة أو مجلس">غرفة معيشة أو مجلس</option>
                    <option value="ديكور محل أو صالة عرض">ديكور محل أو صالة عرض</option>
                    <option value="فيلا كاملة / تصميم داخلي متكامل">فيلا كاملة / تصميم داخلي متكامل</option>
                    <option value="تصميم 3D ورندر معماري">تصميم 3D ورندر معماري</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-gold mb-1.5">
                    المدينة أو المنطقة <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="مثال: البيضاء، شحات، درنة، المرج، بنغازي..."
                    className="w-full bg-brand-dark/90 border border-brand-gold/20 focus:border-brand-gold rounded-xl px-4 py-2.5 text-xs sm:text-sm text-brand-ivory placeholder-brand-ivory/30 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Space Size & Preferred Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-brand-gold mb-1.5">
                    المساحة التقريبية (م²)
                  </label>
                  <input
                    type="text"
                    name="spaceSize"
                    value={formData.spaceSize}
                    onChange={handleChange}
                    placeholder="مثال: 4x5 متر أو 20 م²"
                    className="w-full bg-brand-dark/90 border border-brand-gold/20 focus:border-brand-gold rounded-xl px-4 py-2.5 text-xs sm:text-sm text-brand-ivory placeholder-brand-ivory/30 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-gold mb-1.5">
                    الأسلوب المعماري المفضل
                  </label>
                  <select
                    name="preferredStyle"
                    value={formData.preferredStyle}
                    onChange={handleChange}
                    className="w-full bg-brand-dark/90 border border-brand-gold/20 focus:border-brand-gold rounded-xl px-4 py-2.5 text-xs sm:text-sm text-brand-ivory outline-none cursor-pointer"
                  >
                    <option value="مودرن Modern">مودرن حديث (Modern)</option>
                    <option value="فاخر Luxury">فاخر ومترف (Luxury)</option>
                    <option value="مينيمال Minimal">مينيمال بسيط (Minimal)</option>
                    <option value="معاصر Contemporary">معاصر جريء (Contemporary)</option>
                    <option value="كلاسيك راقٍ Classic">كلاسيك راقٍ (Classic)</option>
                  </select>
                </div>
              </div>

              {/* Budget in Libyan Dinars */}
              <div>
                <label className="block text-xs font-bold text-brand-gold mb-1.5">
                  الميزانية المتوقعة (اختياري - بالدينار الليبي)
                </label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  className="w-full bg-brand-dark/90 border border-brand-gold/20 focus:border-brand-gold rounded-xl px-4 py-2.5 text-xs sm:text-sm text-brand-ivory outline-none cursor-pointer"
                >
                  <option value="">حدد النطاق التقديري للمشروع (د.ل)</option>
                  <option value="10,000 - 25,000 د.ل">10,000 - 25,000 دينار ليبي</option>
                  <option value="25,000 - 50,000 د.ل">25,000 - 50,000 دينار ليبي</option>
                  <option value="50,000 - 100,000 د.ل">50,000 - 100,000 دينار ليبي</option>
                  <option value="أكثر من 100,000 د.ل">أكثر من 100,000 دينار ليبي</option>
                </select>
              </div>

              {/* File Upload Mockup */}
              <div>
                <label className="block text-xs font-bold text-brand-gold mb-1.5">
                  إرفاق مخطط أو صورة للمساحة (اختياري)
                </label>
                <div className="relative border-2 border-dashed border-brand-gold/30 hover:border-brand-gold rounded-2xl p-5 text-center bg-brand-dark/50 cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <UploadSimple size={24} weight="duotone" className="text-brand-gold mx-auto mb-1.5" />
                  <p className="text-xs text-brand-ivory/80">
                    {uploadedFileName ? (
                      <span className="text-brand-champagne font-bold">{uploadedFileName}</span>
                    ) : (
                      'اضغط هنا لرفع صور أو مخطط المساحة (JPG, PNG, PDF)'
                    )}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-brand-gold mb-1.5">
                  ملاحظات إضافية (أجهزة بلت إن، إضاءة مخفية، طريقة الدفع...)
                </label>
                <textarea
                  rows={3}
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="حدد أي تفاصيل خاصة مثل: أجهزة بلت إن، إضاءات LED، نوع المقابض، أو الدفع بالأقساط / الصكوك المصرفية..."
                  className="w-full bg-brand-dark/90 border border-brand-gold/20 focus:border-brand-gold rounded-xl p-3 text-xs sm:text-sm text-brand-ivory placeholder-brand-ivory/30 outline-none transition-all"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-champagne to-brand-gold text-brand-dark font-extrabold text-xs sm:text-sm shadow-luxury-gold hover:opacity-95 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <PaperPlaneTilt size={16} weight="fill" className="text-brand-dark" />
                <span>إرسال الطلب</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-ivory/50 pt-1">
                <ShieldCheck size={14} weight="duotone" className="text-brand-gold" />
                <span>بياناتك تُعامل بسرية واهتمام هندسي كامل</span>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="py-10 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle size={32} weight="fill" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-brand-ivory">تم استلام طلبك بنجاح</h3>
                <p className="text-xs text-brand-ivory/70 max-w-sm mx-auto leading-relaxed">
                  شكراً لثقتكم بشركة المجد. سيقوم فريقنا بالبيضاء بمراجعة تفاصيل طلبك والتواصل معكم مباشرة.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-brand-dark/80 border border-brand-gold/30 max-w-sm mx-auto space-y-3">
                <p className="text-xs text-brand-champagne font-semibold">
                  لتسريع الرد ومناقشة تفاصيل مشروعك فوراً عبر واتساب:
                </p>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#25D366] text-white font-bold text-xs shadow-lg hover:bg-[#20bd5a] transition-all whitespace-nowrap"
                >
                  <WhatsappLogo size={18} weight="fill" />
                  <span>تواصل معنا عبر WhatsApp الآن</span>
                </a>
              </div>

              <button
                onClick={() => setIsSubmitted(false)}
                className="text-xs text-brand-gold hover:text-brand-champagne transition-colors underline"
              >
                إرسال طلب مشروع آخر
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
