import { BeforeAfterItem, ProcessStep } from '../types';
import { getProjectImage } from '../utils/assetHelper';

export const beforeAfterData: BeforeAfterItem[] = [
  {
    id: 'ba-01',
    titleArabic: 'تجديد وتطوير مطبخ مودرن بإضاءات مخفية',
    titleEn: 'Modern Kitchen Ambient Transformation',
    category: 'kitchens',
    categoryArabic: 'مطابخ حديثة',
    beforeImage: './uploads/ba-01-before.jpg',
    afterImage: './uploads/ba-01-after.jpg',
    description: 'انشاء مطبخ فاخر من الاساس وتسليمه بالكامل',
    location: 'البيضاء - شارع القهاوي',
    duration: '3 أسابيع',
  },
];

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    titleArabic: 'الاستشارة وتحديد الرؤية',
    titleEn: 'Consultation',
    description: 'الاستماع لاحتياجاتك لكافة المساحات (مطابخ، غرف نوم، خزائن، ديكورات) وتحديد الخامات والألوان.',
    highlight: 'استشارة هندسية مخصصة',
  },
  {
    step: 2,
    titleArabic: 'رفع المقاسات الميدانية',
    titleEn: 'Site Measurements',
    description: 'زيارة موقعك داخل مدينة البيضاء وضواحيها وأخذ المقاسات والأبعاد الهندسية بدقة تامة.',
    highlight: 'معاينة ورفع هندسي دقيق',
  },
  {
    step: 3,
    titleArabic: 'التصميم الهندسي 3D',
    titleEn: '3D Spatial Design',
    description: 'رسم مخططات ثلاثية الأبعاد ورندر واقعي لمشاهدة كافة تفاصيل مساحتك واختيار الأنسب قبل التصنيع.',
    highlight: 'رؤية واقعية مسبقة للمشروع',
  },
  {
    step: 4,
    titleArabic: 'التصنيع والتركيب المتقن',
    titleEn: 'Manufacturing & Installation',
    description: 'تصنيع دقيق في ورشنا بأجود خامات PVC و MDF مع تركيب احترافي نظيف وتسليم في الموعد المحدد.',
    highlight: 'جودة وتشطيب متقن وضمان',
  },
];
