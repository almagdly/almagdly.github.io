import { CategoryInfo } from '../types';
import { getProjectImage } from '../utils/assetHelper';

export const categoriesData: CategoryInfo[] = [
  {
    id: 'kitchens',
    nameArabic: 'مطابخ حديثة فاخرة',
    nameEn: 'Modern Luxury Kitchens',
    description: 'مطابخ عصرية مخصصة تجمع بين الفخامة والوظيفة العملية بخامات PVC و MDF مع أسطح رخام وكوارتز وأجهزة مدمجة.',
    image: getProjectImage('p1.jpg'),
    count: 67
  },
  {
    id: 'bedrooms',
    nameArabic: 'غرف نوم وأجنحة فندقية',
    nameEn: 'Luxury Bedroom Suites',
    description: 'تصميم وتصنيع غرف نوم رئيسية ماستر بتكسيات خشبية جدارية، خلفيات سرير منجدة، تسريحات، ودواليب ملابس مدمجة.',
    image: getProjectImage('b5.jpg'),
    count: 27
  },
  {
    id: 'wardrobes',
    nameArabic: 'خزائن ودواليب وغرف غسيل',
    nameEn: 'Custom Wardrobes, Closets & Laundry Units',
    description: 'تفصيل دواليب ملابس مدمجة ودريسنج روم زجاجي بتقسيمات ذكية، ووحدات خزائن غسيل مدمجة متطورة.',
    image: getProjectImage('w3.jpg'),
    count: 20
  },
  {
    id: 'interior-design',
    nameArabic: 'ديكور وتصميم داخلي للصالات',
    nameEn: 'Interior Architecture & Decor',
    description: 'تنسيق متكامل للصالات والمجالس، ديكورات شاشات بتكسيات بديل رخام وخشب، قواطع خشبية مفرغة، ومداخل فخمة بتشطيبات راقية.',
    image: getProjectImage('d4.jpg'),
    count: 20
  },
  {
    id: 'pvc-doors',
    nameArabic: 'أبواب ونوافذ و PVC عصرية',
    nameEn: 'PVC Doors, Windows & Custom Entrances',
    description: 'تصنيع وتفصيل أبواب داخلية وخارجية، نوافذ سحاب ومفصلية عازلة، قطاعات PVC ألمانية دبل جلاس عازلة للصوت والحرارة، وخشب مصفح للفيلات.',
    image: getProjectImage('dr8.jpg'),
    count: 39
  }
];
