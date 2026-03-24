import { useState, useEffect } from 'react';
import { 
  Heart, Share2, Download, Send, 
  Menu, X, Globe,
  Sparkles, Feather,
  Facebook, Twitter, Instagram, Youtube,
  ChevronRight, Quote, Copy, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  allShayaris, 
  loadShayaris,
  getCategoryNames,
  type Language,
  type Category,
  type Shayari 
} from './data/shayariData';
import './App.css';

// ─── Google AdSense Slot ───────────────────────────────────────────────────
// Replace data-ad-client and data-ad-slot values once your site is approved.
// Set VITE_ADSENSE_CLIENT in your .env file, e.g.: VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
const AD_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-XXXXXXXXXXXXXXXX';

function AdSlot({ slot, format = 'auto', className = '' }: { slot: string; format?: string; className?: string }) {
  // Only render when a real publisher ID is configured
  if (!import.meta.env.VITE_ADSENSE_CLIENT) return null;
  return (
    <div className={`ad-slot overflow-hidden text-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Category images mapping
const categoryImages: Record<string, string> = {
  ganesh: '/images/shayaris/ganesh_puja_1.jpg',
  goodmorning: '/images/shayaris/good_morning_1.jpg',
  birthday: '/images/shayaris/birthday_1.jpg',
  attitude: '/images/shayaris/attitude_1.jpg',
  marriagefunny: '/images/shayaris/marriage_funny_1.jpg',
  motivation: '/images/shayaris/motivation_1.jpg',
  breakup: '/images/shayaris/breakup_1.jpg',
  friendship: '/images/shayaris/friendship_1.jpg',
  marriageanniversary: '/images/shayaris/marriage_anniversary_1.jpg',
  sad: '/images/shayaris/sad_1.jpg',
  islamic: '/images/shayaris/islamic_1.jpg',
  durgapuja: '/images/shayaris/durga_puja_1.jpg',
  romantic: '/images/shayaris/romantic_1.jpg'
};
// User Submission Interface with email
interface UserSubmission {
  id: string;
  name: string;
  email: string;
  shayari: string;
  category: Category;
  language: Language;
  likes: number;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Translations
const translations = {
  en: {
    home: 'Home',
    categories: 'Categories',
    submitShayari: 'Submit Shayari',
    contact: 'Contact',
    heroTitle: 'Where Words Paint Emotions',
    heroSubtitle: 'Discover 1000+ beautiful Shayaris in every category. From love to longing, joy to sorrow - find shayari that speaks to your soul.',
    exploreShayari: 'Explore Shayari',
    submitYourOwn: 'Submit Your Own',
    stats: '1300+ Shayaris | 13 Categories | 1 Million+ Readers',
    categoriesTitle: 'Shayari Categories',
    categoriesSubtitle: 'Find the perfect words for every emotion and occasion',
    featuredShayari: 'Featured Shayari',
    viewAll: 'View All Categories',
    shareWords: 'Share Your Words With The World',
    shareDescription: 'Have a shayari that speaks to the heart? Submit your original poetry and join our community of wordsmiths. Every verse matters, every voice deserves to be heard.',
    name: 'Name',
    email: 'Email',
    category: 'Category',
    language: 'Language',
    yourShayari: 'Your Shayari',
    submit: 'Submit Your Shayari',
    submissionsReceived: 'Submissions Received',
    published: 'Published',
    dailySubmissions: 'Daily Submissions',
    redeemVoucher: 'Redeem Amazon Voucher',
    voucherDescription: 'Has your Shayari received 500+ likes? Claim your ₹500 Amazon voucher now!',
    voucherNote: 'Note: You must use the same email that was used to submit the Shayari.',
    likes: 'likes',
    download: 'Download',
    share: 'Share',
    copy: 'Copy',
    copied: 'Copied!',
    like: 'Like',
    liked: 'Liked!',
    footerDescription: 'Celebrating the art of poetry across languages and cultures.',
    quickLinks: 'Quick Links',
    legal: 'Legal',
    connect: 'Connect With Us',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    contentGuidelines: 'Content Guidelines',
    aboutUs: 'About Us',
    allRightsReserved: 'All rights reserved.',
    redeemNow: '',
    submitForReview: 'Submit for Review',
    enterDetails: '',
    fullName: '',
    phoneNumber: '',
    amazonEmail: '',
    shayariId: '',
    submitRedemption: '',
    successMessage: '',
    selectCategory: 'Select a category',
    selectLanguage: 'Select language',
    emailMismatch: 'Email verification failed! The email you entered does not match the email used to submit this Shayari.',
    notEnoughLikes: 'This Shayari does not have 500+ likes yet. Keep sharing to get more likes!',
    alreadyRedeemed: 'This Shayari has already been redeemed for a voucher.',
    verificationSuccess: 'Email verified successfully! Your redemption request has been submitted.',
    searchPlaceholder: 'Search Shayari...',
    noResults: 'No Shayari found. Try a different search.',
    loadMore: 'Load More',
    showing: 'Showing',
    of: 'of',
    total: 'total',
  },
  hi: {
    home: 'होम',
    categories: 'श्रेणियाँ',
    submitShayari: 'शायरी सबमिट करें',
    contact: 'संपर्क',
    heroTitle: 'जहां शब्द भावनाओं को रंगते हैं',
    heroSubtitle: 'हर श्रेणी में 1000+ सुंदर शायरियाँ खोजें। प्यार से लेकर तड़प, खुशी से लेकर दुख तक - अपनी आत्मा से बात करने वाली शायरी पाएं।',
    exploreShayari: 'शायरी देखें',
    submitYourOwn: 'अपनी शायरी दें',
    stats: '1000+ शायरियाँ | 11 श्रेणियाँ | 1 मिलियन+ पाठक',
    categoriesTitle: 'शायरी श्रेणियाँ',
    categoriesSubtitle: 'हर भावना और अवसर के लिए सही शब्द खोजें',
    featuredShayari: 'विशेष शायरी',
    viewAll: 'सभी श्रेणियाँ देखें',
    shareWords: 'दुनिया के साथ अपने शब्द साझा करें',
    shareDescription: 'क्या आपके पास दिल को छू लेने वाली शायरी है? अपनी मूल कविता सबमिट करें और शब्दकारों के हमारे समुदाय में शामिल हों। हर शेर मायने रखता है, हर आवाज सुनी जानी चाहिए।',
    name: 'नाम',
    email: 'ईमेल',
    category: 'श्रेणी',
    language: 'भाषा',
    yourShayari: 'आपकी शायरी',
    submit: 'शायरी सबमिट करें',
    submissionsReceived: 'प्राप्त सबमिशन',
    published: 'प्रकाशित',
    dailySubmissions: 'दैनिक सबमिशन',
    redeemVoucher: 'अमेज़न वाउचर रिडीम करें',
    voucherDescription: 'क्या आपकी शायरी को 500+ लाइक्स मिले हैं? अपना ₹500 अमेज़न वाउचर अभी प्राप्त करें!',
    voucherNote: 'नोट: आपको वही ईमेल उपयोग करना होगा जो शायरी सबमिट करते समय उपयोग किया गया था।',
    likes: 'लाइक्स',
    download: 'डाउनलोड',
    share: 'शेयर',
    copy: 'कॉपी',
    copied: 'कॉपी हो गया!',
    like: 'लाइक',
    liked: 'लाइक किया!',
    footerDescription: 'भाषाओं और संस्कृतियों में कविता की कला का जश्न।',
    quickLinks: 'त्वरित लिंक',
    legal: 'कानूनी',
    connect: 'हमसे जुड़ें',
    privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा की शर्तें',
    contentGuidelines: 'सामग्री दिशानिर्देश',
    aboutUs: 'हमारे बारे में',
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',
    redeemNow: 'अभी रिडीम करें',
    submitForReview: 'समीक्षा के लिए सबमिट करें',
    enterDetails: 'अपना वाउचर रिडीम करने के लिए अपनी जानकारी दर्ज करें',
    fullName: 'पूरा नाम',
    phoneNumber: 'फोन नंबर',
    amazonEmail: 'अमेज़न खाता ईमेल',
    shayariId: 'शायरी आईडी',
    submitRedemption: 'रिडीम अनुरोध सबमिट करें',
    successMessage: 'आपका रिडीम अनुरोध सबमिट कर दिया गया है! हम आपके ईमेल का सत्यापन करेंगे और 3-5 व्यावसायिक दिनों के भीतर आपका वाउचर भेज देंगे।',
    selectCategory: 'श्रेणी चुनें',
    selectLanguage: 'भाषा चुनें',
    emailMismatch: 'ईमेल सत्यापन विफल! आपके द्वारा दर्ज किया गया ईमेल शायरी सबमिट करते समय उपयोग किए गए ईमेल से मेल नहीं खाता।',
    notEnoughLikes: 'इस शायरी को अभी तक 500+ लाइक्स नहीं मिले हैं। और लाइक्स पाने के लिए शेयर करते रहें!',
    alreadyRedeemed: 'इस शायरी के लिए पहले ही वाउचर रिडीम किया जा चुका है।',
    verificationSuccess: 'ईमेल सफलतापूर्वक सत्यापित! आपका रिडीम अनुरोध सबमिट कर दिया गया है।',
    searchPlaceholder: 'शायरी खोजें...',
    noResults: 'कोई शायरी नहीं मिली। कुछ और खोजें।',
    loadMore: 'और देखें',
    showing: 'दिखा रहे हैं',
    of: 'में से',
    total: 'कुल',
  },
  ta: {
    home: 'முகப்பு',
    categories: 'வகைகள்',
    submitShayari: 'ஷாயரி சமர்ப்பிக்கவும்',
    contact: 'தொடர்பு',
    heroTitle: 'சொற்கள் உணர்வுகளை வரையும் இடம்',
    heroSubtitle: 'ஒவ்வொரு வகையிலும் 1000+ அழகான ஷாயரிகளைக் கண்டறியுங்கள். காதல் முதல் ஏக்கம், மகிழ்ச்சி முதல் துயரம் வரை - உங்கள் ஆன்மாவுடன் பேசும் ஷாயரியைக் கண்டறியுங்கள்.',
    exploreShayari: 'ஷாயரி காண்க',
    submitYourOwn: 'உங்களுடையதை சமர்ப்பிக்கவும்',
    stats: '1000+ ஷாயரிகள் | 11 வகைகள் | 1 மில்லியன்+ வாசகர்கள்',
    categoriesTitle: 'ஷாயரி வகைகள்',
    categoriesSubtitle: 'ஒவ்வொரு உணர்வுக்கும், ஒவ்வொரு நிகழ்வுக்கும் சரியான சொற்களைக் கண்டறியுங்கள்',
    featuredShayari: 'சிறப்பு ஷாயரி',
    viewAll: 'அனைத்து வகைகளையும் காண்க',
    shareWords: 'உலகத்துடன் உங்கள் சொற்களைப் பகிர்ந்து கொள்ளுங்கள்',
    shareDescription: 'இதயத்தைத் தொடும் ஷாயரி உங்களிடம் உள்ளதா? உங்கள் அசல் கவிதையைச் சமர்ப்பித்து, எங்கள் கவிஞர்கள் சமூகத்தில் சேருங்கள். ஒவ்வொரு வரியும் முக்கியம், ஒவ்வொரு குரலும் கேட்கப்பட வேண்டும்.',
    name: 'பெயர்',
    email: 'மின்னஞ்சல்',
    category: 'வகை',
    language: 'மொழி',
    yourShayari: 'உங்கள் ஷாயரி',
    submit: 'ஷாயரியை சமர்ப்பிக்கவும்',
    submissionsReceived: 'பெறப்பட்ட சமர்ப்பிப்புகள்',
    published: 'வெளியிடப்பட்டது',
    dailySubmissions: 'தினசரி சமர்ப்பிப்புகள்',
    redeemVoucher: 'அமேசான் வவுச்சர் பெறவும்',
    voucherDescription: 'உங்கள் ஷாயரிக்கு 500+ லைக்குகள் கிடைத்ததா? உங்கள் ₹500 அமேசான் வவுச்சரை இப்போதே பெறுங்கள்!',
    voucherNote: 'குறிப்பு: ஷாயரியை சமர்ப்பிக்கும்போது பயன்படுத்தப்பட்ட அதே மின்னஞ்சலை நீங்கள் பயன்படுத்த வேண்டும்.',
    likes: 'லைக்குகள்',
    download: 'பதிவிறக்கம்',
    share: 'பகிர்',
    copy: 'காப்பி',
    copied: 'காப்பி செய்யப்பட்டது!',
    like: 'லைக்',
    liked: 'லைக் செய்யப்பட்டது!',
    footerDescription: 'மொழிகள் மற்றும் கலாச்சாரங்களில் கவிதை கலையைக் கொண்டாடுதல்.',
    quickLinks: 'விரைவு இணைப்புகள்',
    legal: 'சட்டம்',
    connect: 'எங்களுடன் இணையுங்கள்',
    privacyPolicy: 'தனியுரிமைக் கொள்கை',
    termsOfService: 'சேவை விதிமுறைகள்',
    contentGuidelines: 'உள்ளடக்க வழிகாட்டுதல்கள்',
    aboutUs: 'எங்களைப் பற்றி',
    allRightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    redeemNow: 'இப்போதே பெறவும்',
    submitForReview: 'மதிப்பீட்டிற்கு சமர்ப்பிக்கவும்',
    enterDetails: 'உங்கள் வவுச்சரைப் பெற உங்கள் விவரங்களை உள்ளிடவும்',
    fullName: 'முழு பெயர்',
    phoneNumber: 'தொலைபேசி எண்',
    amazonEmail: 'அமேசான் கணக்கு மின்னஞ்சல்',
    shayariId: 'ஷாயரி ஐடி',
    submitRedemption: 'ரிடீம் கோரிக்கையை சமர்ப்பிக்கவும்',
    successMessage: 'உங்கள் ரிடீம் கோரிக்கை சமர்ப்பிக்கப்பட்டது! உங்கள் மின்னஞ்சலை சரிபார்த்து 3-5 வணிக நாட்களுக்குள் உங்கள் வவுச்சரை அனுப்புவோம்.',
    selectCategory: 'வகையைத் தேர்ந்தெடுக்கவும்',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    emailMismatch: 'மின்னஞ்சல் சரிபார்ப்பு தோல்வியடைந்தது! நீங்கள் உள்ளிட்ட மின்னஞ்சல், இந்த ஷாயரியை சமர்ப்பிக்கும்போது பயன்படுத்தப்பட்ட மின்னஞ்சலுடன் பொருந்தவில்லை.',
    notEnoughLikes: 'இந்த ஷாயரிக்கு இன்னும் 500+ லைக்குகள் கிடைக்கவில்லை. மேலும் லைக்குகளைப் பெற பகிர்ந்து கொள்ளுங்கள்!',
    alreadyRedeemed: 'இந்த ஷாயரிக்கு ஏற்கனவே வவுச்சர் பெறப்பட்டுள்ளது.',
    verificationSuccess: 'மின்னஞ்சல் வெற்றிகரமாக சரிபார்க்கப்பட்டது! உங்கள் ரிடீம் கோரிக்கை சமர்ப்பிக்கப்பட்டது.',
    searchPlaceholder: 'ஷாயரி தேடுங்கள்...',
    noResults: 'ஷாயரி எதுவும் கிடைக்கவில்லை. வேறு தேடல் முயற்சிக்கவும்.',
    loadMore: 'மேலும் காண்க',
    showing: 'காட்டுகிறது',
    of: 'இல்',
    total: 'மொத்தம்',
  },
  te: {
    home: 'హోమ్',
    categories: 'వర్గాలు',
    submitShayari: 'షాయరి సమర్పించండి',
    contact: 'సంప్రదింపు',
    heroTitle: 'పదాలు భావోద్వేగాలను రంగులోకి తీసుకువచ్చే ప్రదేశం',
    heroSubtitle: 'ప్రతి వర్గంలో 1300+ అందమైన షాయరీలను కనుగొనండి. ప్రేమ నుండి ఆశ, సంతోషం నుండి విచారం వరకు - మీ ఆత్మతో మాట్లాడే షాయరీని కనుగొనండి.',
    exploreShayari: 'షాయరీని అన్వేషించండి',
    submitYourOwn: 'మీ సొంత షాయరీని సమర్పించండి',
    stats: '1300+ షాయరీలు | 13 వర్గాలు | 1 మిలియన్+ పాఠకులు',
    categoriesTitle: 'షాయరీ వర్గాలు',
    categoriesSubtitle: 'ప్రతి భావోద్వేగానికి, ప్రతి సందర్భానికి సరైన పదాలను కనుగొనండి',
    featuredShayari: 'ఫీచర్డ్ షాయరీ',
    viewAll: 'అన్ని వర్గాలను చూడండి',
    shareWords: 'ప్రపంచంతో మీ పదాలను పంచుకోండి',
    shareDescription: 'హృదయాన్ని తాకే షాయరీ మీ వద్ద ఉందా? మీ అసలైన కవిత్వాన్ని సమర్పించండి, మా కవుల సమాజంలో చేరండి. ప్రతి పంక్తి ముఖ్యమైనది, ప్రతి స్వరం వినబడాలి.',
    name: 'పేరు',
    email: 'ఇమెయిల్',
    category: 'వర్గం',
    language: 'భాష',
    yourShayari: 'మీ షాయరీ',
    submit: 'మీ షాయరీని సమర్పించండి',
    submissionsReceived: 'స్వీకరించిన సమర్పణలు',
    published: 'ప్రచురించబడింది',
    dailySubmissions: 'రోజువారీ సమర్పణలు',
    redeemVoucher: 'అమెజాన్ వౌచర్ రీడీమ్ చేయండి',
    voucherDescription: 'మీ షాయరీకి 500+ లైక్స్ వచ్చాయా? ఇప్పుడే మీ ₹500 అమెజాన్ వౌచర్ పొందండి!',
    voucherNote: 'గమనిక: మీరు షాయరీని సమర్పించినప్పుడు ఉపయోగించిన అదే ఇమెయిల్ ఉపయోగించాలి.',
    likes: 'లైక్స్',
    download: 'డౌన్‌లోడ్',
    share: 'షేర్',
    copy: 'కాపీ',
    copied: 'కాపీ చేయబడింది!',
    like: 'లైక్',
    liked: 'లైక్ చేయబడింది!',
    footerDescription: 'భాషలు మరియు సంస్కృతులలో కవిత్వ కళను జరుపుకోవడం.',
    quickLinks: 'త్వరిత లింక్‌లు',
    legal: 'చట్టబద్ధమైనది',
    connect: 'మాతో కనెక్ట్ అవ్వండి',
    privacyPolicy: 'గోప్యతా విధానం',
    termsOfService: 'సేవా నిబంధనలు',
    contentGuidelines: 'కంటెంట్ మార్గదర్శకాలు',
    aboutUs: 'మా గురించి',
    allRightsReserved: 'సర్వహక్కులు ప్రత్యేకించబడ్డాయి.',
    redeemNow: 'ఇప్పుడే రీడీమ్ చేయండి',
    submitForReview: 'సమీక్ష కోసం సమర్పించండి',
    enterDetails: 'మీ వౌచర్ రీడీమ్ చేయడానికి మీ వివరాలను నమోదు చేయండి',
    fullName: 'పూర్తి పేరు',
    phoneNumber: 'ఫోన్ నంబర్',
    amazonEmail: 'అమెజాన్ ఖాతా ఇమెయిల్',
    shayariId: 'షాయరీ ఐడి',
    submitRedemption: 'రీడెమ్షన్ అభ్యర్థనను సమర్పించండి',
    successMessage: 'మీ రీడెమ్షన్ అభ్యర్థన సమర్పించబడింది! మేము మీ ఇమెయిల్‌ను ధృవీకరించి 3-5 వ్యాపార రోజుల్లో మీ వౌచర్ పంపిస్తాము.',
    selectCategory: 'వర్గాన్ని ఎంచుకోండి',
    selectLanguage: 'భాషను ఎంచుకోండి',
    emailMismatch: 'ఇమెయిల్ ధృవీకరణ విఫలమైంది! మీరు నమోదు చేసిన ఇమెయిల్, ఈ షాయరీని సమర్పించడానికి ఉపయోగించిన ఇమెయిల్‌తో సరిపోలడం లేదు.',
    notEnoughLikes: 'ఈ షాయరీకి ఇంకా 500+ లైక్స్ రాలేదు. మరిన్ని లైక్స్ పొందడానికి షేర్ చేయండి!',
    alreadyRedeemed: 'ఈ షాయరీ కోసం ఇప్పటికే వౌచర్ రీడీమ్ చేయబడింది.',
    verificationSuccess: 'ఇమెయిల్ విజయవంతంగా ధృవీకరించబడింది! మీ రీడెమ్షన్ అభ్యర్థన సమర్పించబడింది.',
    searchPlaceholder: 'షాయరీని శోధించండి...',
    noResults: 'షాయరీ ఏదీ కనుగొనబడలేదు. వేరే శోధన ప్రయత్నించండి.',
    loadMore: 'మరింత లోడ్ చేయండి',
    showing: 'చూపిస్తున్నది',
    of: 'లో',
    total: 'మొత్తం',
  },
  gu: {
    home: 'હોમ',
    categories: 'શ્રેણીઓ',
    submitShayari: 'શાયરી સબમિટ કરો',
    contact: 'સંપર્ક',
    heroTitle: 'જ્યાં શબ્દો ભાવનાઓને રંગે છે',
    heroSubtitle: 'દરેક શ્રેણીમાં 1300+ સુંદર શાયરીઓ શોધો. પ્રેમથી લઈને તરસ, આનંદથી લઈને દુઃખ સુધી - તમારા આત્મા સાથે વાત કરતી શાયરી શોધો.',
    exploreShayari: 'શાયરી શોધો',
    submitYourOwn: 'તમારી શાયરી સબમિટ કરો',
    stats: '1300+ શાયરીઓ | 13 શ્રેણીઓ | 1 મિલિયન+ વાચકો',
    categoriesTitle: 'શાયરી શ્રેણીઓ',
    categoriesSubtitle: 'દરેક ભાવના અને પ્રસંગ માટે સાચા શબ્દો શોધો',
    featuredShayari: 'ફીચર્ડ શાયરી',
    viewAll: 'બધી શ્રેણીઓ જુઓ',
    shareWords: 'વિશ્વ સાથે તમારા શબ્દો શેર કરો',
    shareDescription: 'હૃદયને સ્પર્શતી શાયરી તમારી પાસે છે? તમારી મૂળ કવિતા સબમિટ કરો, અમારા કવિઓના સમુદાયમાં જોડાઓ. દરેક પંક્તિ મહત્વની છે, દરેક અવાજ સાંભળવો જોઈએ.',
    name: 'નામ',
    email: 'ઇમેઇલ',
    category: 'શ્રેણી',
    language: 'ભાષા',
    yourShayari: 'તમારી શાયરી',
    submit: 'તમારી શાયરી સબમિટ કરો',
    submissionsReceived: 'પ્રાપ્ત સબમિશન્સ',
    published: 'પ્રકાશિત',
    dailySubmissions: 'રોજિંદા સબમિશન્સ',
    redeemVoucher: 'એમેઝોન વાઉચર રિડીમ કરો',
    voucherDescription: 'તમારી શાયરીને 500+ લાઇક્સ મળ્યા છે? તમારું ₹500 એમેઝોન વાઉચર હમણાં જ મેળવો!',
    voucherNote: 'નોંધ: તમારે શાયરી સબમિટ કરતી વખતે ઉપયોગમાં લેવાયેલું જ ઇમેઇલ ઉપયોગમાં લેવું જોઈએ.',
    likes: 'લાઇક્સ',
    download: 'ડાઉનલોડ',
    share: 'શેર',
    copy: 'કોપી',
    copied: 'કોપી કર્યું!',
    like: 'લાઇક',
    liked: 'લાઇક કર્યું!',
    footerDescription: 'ભાષાઓ અને સંસ્કૃતિઓમાં કવિતાની કલાનું સમારોહ.',
    quickLinks: 'ઝડપી લિંક્સ',
    legal: 'કાનૂની',
    connect: 'અમારી સાથે કનેક્ટ થાઓ',
    privacyPolicy: 'ગોપનીયતા નીતિ',
    termsOfService: 'સેવાની શરતો',
    contentGuidelines: 'કન્ટેન્ટ માર્ગદર્શિકાઓ',
    aboutUs: 'અમારા વિશે',
    allRightsReserved: 'સર્વાધિકાર સુરક્ષિત.',
    redeemNow: 'હમણાં જ રિડીમ કરો',
    submitForReview: 'સમીક્ષા માટે સબમિટ કરો',
    enterDetails: 'તમારું વાઉચર રિડીમ કરવા માટે તમારી વિગતો દાખલ કરો',
    fullName: 'પૂરું નામ',
    phoneNumber: 'ફોન નંબર',
    amazonEmail: 'એમેઝોન ખાતું ઇમેઇલ',
    shayariId: 'શાયરી આઈડી',
    submitRedemption: 'રિડેમ્પ્શન વિનંતી સબમિટ કરો',
    successMessage: 'તમારી રિડેમ્પ્શન વિનંતી સબમિટ કરવામાં આવી છે! અમે તમારા ઇમેઇલની ચકાસણી કરીશું અને 3-5 કારોબારી દિવસોમાં તમારું વાઉચર મોકલીશું.',
    selectCategory: 'શ્રેણી પસંદ કરો',
    selectLanguage: 'ભાષા પસંદ કરો',
    emailMismatch: 'ઇમેઇલ ચકાસણી નિષ્ફળ! તમે દાખલ કરેલું ઇમેઇલ આ શાયરી સબમિટ કરવા માટે ઉપયોગમાં લેવાયેલા ઇમેઇલ સાથે મેળ ખાતું નથી.',
    notEnoughLikes: 'આ શાયરીને હજુ સુધી 500+ લાઇક્સ મળ્યા નથી. વધુ લાઇક્સ મેળવવા માટે શેર કરતા રહો!',
    alreadyRedeemed: 'આ શાયરી માટે પહેલેથી જ વાઉચર રિડીમ કરવામાં આવ્યું છે.',
    verificationSuccess: 'ઇમેઇલ સફળતાપૂર્વક ચકાસાયું! તમારી રિડેમ્પ્શન વિનંતી સબમિટ કરવામાં આવી છે.',
    searchPlaceholder: 'શાયરી શોધો...',
    noResults: 'કોઈ શાયરી મળી નથી. અલગ શોધ પ્રયાસ કરો.',
    loadMore: 'વધુ લોડ કરો',
    showing: 'બતાવી રહ્યું છે',
    of: 'માંથી',
    total: 'કુલ',
  },
  mr: {
    home: 'होम',
    categories: 'श्रेण्या',
    submitShayari: 'शायरी सबमिट करा',
    contact: 'संपर्क',
    heroTitle: 'जिथे शब्द भावनांना रंगतात',
    heroSubtitle: 'प्रत्येक श्रेणीत 1300+ सुंदर शायऱ्या शोधा. प्रेमापासून ते तळमळ, आनंदापासून ते दुःख - तुमच्या आत्म्याशी बोलणारी शायरी शोधा.',
    exploreShayari: 'शायरी शोधा',
    submitYourOwn: 'तुमची शायरी सबमिट करा',
    stats: '1300+ शायऱ्या | 13 श्रेण्या | 1 मिलियन+ वाचक',
    categoriesTitle: 'शायरी श्रेण्या',
    categoriesSubtitle: 'प्रत्येक भावना आणि प्रसंगासाठी योग्य शब्द शोधा',
    featuredShayari: 'फीचर्ड शायरी',
    viewAll: 'सर्व श्रेण्या पाहा',
    shareWords: 'जगासोबत तुमचे शब्द शेअर करा',
    shareDescription: 'हृदयाला स्पर्श करणारी शायरी तुमच्याकडे आहे? तुमची मूळ कविता सबमिट करा, आमच्या कवींच्या समुदायात सामील व्हा. प्रत्येक ओळ महत्त्वाची आहे, प्रत्येक आवाज ऐकला जावा.',
    name: 'नाव',
    email: 'ईमेल',
    category: 'श्रेणी',
    language: 'भाषा',
    yourShayari: 'तुमची शायरी',
    submit: 'तुमची शायरी सबमिट करा',
    submissionsReceived: 'प्राप्त सबमिशन्स',
    published: 'प्रकाशित',
    dailySubmissions: 'दैनिक सबमिशन्स',
    redeemVoucher: 'अमेझॉन व्हाउचर रिडीम करा',
    voucherDescription: 'तुमच्या शायरीला 500+ लाइक्स मिळाले आहेत का? तुमचे ₹500 अमेझॉन व्हाउचर आत्ताच मिळवा!',
    voucherNote: 'टीप: तुम्हाला शायरी सबमिट करताना वापरलेले तेच ईमेल वापरावे लागेल.',
    likes: 'लाइक्स',
    download: 'डाउनलोड',
    share: 'शेअर',
    copy: 'कॉपी',
    copied: 'कॉपी केले!',
    like: 'लाइक',
    liked: 'लाइक केले!',
    footerDescription: 'भाषा आणि संस्कृतींमध्ये कवितेच्या कलेचा सण.',
    quickLinks: 'द्रुत दुवे',
    legal: 'कायदेशीर',
    connect: 'आमच्याशी कनेक्ट व्हा',
    privacyPolicy: 'गोपनीयता धोरण',
    termsOfService: 'सेवा अटी',
    contentGuidelines: 'सामग्री मार्गदर्शक तत्त्वे',
    aboutUs: 'आमच्याबद्दल',
    allRightsReserved: 'सर्व हक्क राखीव.',
    redeemNow: 'आत्ताच रिडीम करा',
    submitForReview: 'समीक्षेसाठी सबमिट करा',
    enterDetails: 'तुमचे व्हाउचर रिडीम करण्यासाठी तुमचे तपशील प्रविष्ट करा',
    fullName: 'पूर्ण नाव',
    phoneNumber: 'फोन नंबर',
    amazonEmail: 'अमेझॉन खाते ईमेल',
    shayariId: 'शायरी आयडी',
    submitRedemption: 'रिडेम्शन विनंती सबमिट करा',
    successMessage: 'तुमची रिडेम्शन विनंती सबमिट केली आहे! आम्ही तुमच्या ईमेलची पडताळणी करू आणि 3-5 व्यवसाय दिवसांत तुमचे व्हाउचर पाठवू.',
    selectCategory: 'श्रेणी निवडा',
    selectLanguage: 'भाषा निवडा',
    emailMismatch: 'ईमेल पडताळणी अयशस्वी! तुम्ही प्रविष्ट केलेले ईमेल या शायरीला सबमिट करण्यासाठी वापरलेल्या ईमेलशी जुळत नाही.',
    notEnoughLikes: 'या शायरीला अद्याप 500+ लाइक्स मिळालेले नाहीत. अधिक लाइक्स मिळवण्यासाठी शेअर करत रहा!',
    alreadyRedeemed: 'या शायरीसाठी आधीच व्हाउचर रिडीम केले आहे.',
    verificationSuccess: 'ईमेल यशस्वीरित्या पडताळले! तुमची रिडेम्शन विनंती सबमिट केली आहे.',
    searchPlaceholder: 'शायरी शोधा...',
    noResults: 'कोणतीही शायरी सापडली नाही. वेगळा शोध प्रयत्न करा.',
    loadMore: 'अधिक लोड करा',
    showing: 'दाखवत आहे',
    of: 'पैकी',
    total: 'एकूण',
  }
};

// Language Names
const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  te: 'తెలుగు',
  gu: 'ગુજરાતી',
  mr: 'मराठी',
  ta: 'தமிழ்'
};

// All categories from CSV
const allCategories: Category[] = [
  'ganesh', 'goodmorning', 'birthday', 'attitude', 'marriagefunny',
  'motivation', 'breakup', 'friendship', 'marriageanniversary',
  'sad', 'islamic', 'durgapuja', 'romantic'
];

// Language button labels
const languageButtons: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'HI' },
  { code: 'te', label: 'TE' },
  { code: 'ta', label: 'TA' },
  { code: 'gu', label: 'GU' },
  { code: 'mr', label: 'MA' }
];

// Helper function to fix newlines - converts \n to actual newlines
const fixNewlines = (text: string | undefined): string => {
  if (!text) return '';
  return text.replace(/\\n/g, '\n');
};

// Helper function to get Shayari text in specific language
const getShayariTextByLanguage = (shayari: Shayari, lang: Language): string => {
  let text: string | undefined;
  switch (lang) {
    case 'hi': text = shayari.textHi; break;
    case 'te': text = shayari.textTe; break;
    case 'gu': text = shayari.textGu; break;
    case 'mr': text = shayari.textMr; break;
    case 'ta': text = shayari.textTa; break;
    default: text = shayari.text;
  }
  return fixNewlines(text || shayari.text);
};

// Shayari Card Component with Flip Animation
interface ShayariCardProps {
  shayari: Shayari;
  initialLang: Language;
  likedShayaris: Set<string>;
  copiedId: string | null;
  onLike: (id: string) => void;
  onCopy: (text: string, id: string) => void;
  onShare: (shayari: Shayari, lang?: Language) => void;
  onDownload: (shayari: Shayari, lang?: Language) => Promise<void>;
  getCategoryNames: (lang: Language) => Record<string, string>;
}

function ShayariCard({ 
  shayari, 
  initialLang,
  likedShayaris, 
  copiedId, 
  onLike, 
  onCopy, 
  onShare, 
  onDownload, 
  getCategoryNames
}: ShayariCardProps) {
  const [cardLanguage, setCardLanguage] = useState<Language>(initialLang);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Update card language when global language changes
  useEffect(() => {
    setCardLanguage(initialLang);
  }, [initialLang]);

  const handleLanguageChange = (lang: Language) => {
    if (lang !== cardLanguage) {
      setIsFlipping(true);
      setTimeout(() => {
        setCardLanguage(lang);
        setIsFlipping(false);
      }, 200);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload(shayari, cardLanguage);
    } finally {
      setIsDownloading(false);
    }
  };

  const displayText = getShayariTextByLanguage(shayari, cardLanguage);
  const categoryName = getCategoryNames(initialLang)[shayari.category] || shayari.category;

  // Get font class based on language
  const getFontClass = (lang: Language) => {
    switch (lang) {
      case 'hi':
      case 'mr':
        return 'font-hindi';
      case 'te':
      case 'ta':
        return 'font-tamil';
      case 'gu':
        return 'font-gujarati';
      default:
        return '';
    }
  };

  return (
    <Card className="overflow-hidden card-hover animate-fade-in-up group flex flex-col">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={shayari.image}
          alt={categoryName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="gradient-bg text-white text-xs">
            {categoryName}
          </Badge>
        </div>
      </div>

      {/* Language Buttons Strip - between image and content */}
      <div className="flex flex-wrap gap-1 px-3 py-2 bg-gray-50 border-b">
        {languageButtons.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code)}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all duration-200 ${
              cardLanguage === code
                ? 'bg-[#ff6b6b] text-white shadow-sm'
                : 'bg-white text-[#2c3e50] border border-gray-200 hover:bg-[#ff6b6b] hover:text-white hover:border-[#ff6b6b]'
            }`}
            title={languageNames[code]}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content Section with Flip Animation */}
      <CardContent className="p-5 flex flex-col flex-1">
        <div 
          className={`text-base text-[#2c3e50] mb-4 whitespace-pre-line leading-relaxed h-[120px] overflow-y-auto transition-all duration-300 ${
            isFlipping ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          } ${getFontClass(cardLanguage)}`}
        >
          {displayText}
        </div>
        
        {/* Author and Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
              {shayari.author[0]}
            </div>
            <span className="text-sm text-[#2c3e50]/70">{shayari.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onLike(shayari.id)}
              className={`p-2 rounded-full transition-all ${
                likedShayaris.has(shayari.id) 
                  ? 'text-red-500 bg-red-50 animate-heartbeat' 
                  : 'text-[#2c3e50]/50 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${likedShayaris.has(shayari.id) ? 'fill-current' : ''}`} />
            </button>
            <span className="text-xs text-[#2c3e50]/70 min-w-[40px]">
              {shayari.likes}
            </span>
            <button
              onClick={() => onCopy(displayText, shayari.id)}
              className="p-2 rounded-full text-[#2c3e50]/50 hover:text-[#4ecdc4] hover:bg-[#4ecdc4]/10 transition-all"
            >
              {copiedId === shayari.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onShare(shayari, cardLanguage)}
              className="p-2 rounded-full text-[#2c3e50]/50 hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/10 transition-all"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#2c3e50]/50">{shayari.shares ?? 0}</span>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`p-2 rounded-full transition-all ${
                isDownloading 
                  ? 'text-[#ff6b6b] animate-spin' 
                  : 'text-[#2c3e50]/50 hover:text-[#2c3e50] hover:bg-[#2c3e50]/10'
              }`}
            >
              {isDownloading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
            <span className="text-xs text-[#2c3e50]/50">{shayari.downloads ?? 0}</span>
          </div>
        </div>
        
      </CardContent>
    </Card>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [shayaris, setShayaris] = useState<Shayari[]>(allShayaris);
  const [userSubmissions, setUserSubmissions] = useState<UserSubmission[]>([]);
  const [likedShayaris, setLikedShayaris] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(12);
  const [tickerShayari, setTickerShayari] = useState<Shayari | null>(null);
  const [tickerLang, setTickerLang] = useState<Language>('en');
  const [tickerCardRect, setTickerCardRect] = useState<DOMRect | null>(null);
  
  // Form States
  const [submitForm, setSubmitForm] = useState({
    name: '',
    email: '',
    shayari: '',
    category: '' as Category | '',
    language: 'en' as Language
  });

  const t = translations[language];

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load full Shayari data from JSON
  useEffect(() => {
    loadShayaris().then(data => {
      setShayaris(data);
    });
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('likedShayaris');
    if (saved) {
      setLikedShayaris(new Set(JSON.parse(saved)));
    }
    const savedSubmissions = localStorage.getItem('userSubmissions');
    if (savedSubmissions) {
      setUserSubmissions(JSON.parse(savedSubmissions));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('likedShayaris', JSON.stringify([...likedShayaris]));
  }, [likedShayaris]);

  useEffect(() => {
    localStorage.setItem('userSubmissions', JSON.stringify(userSubmissions));
  }, [userSubmissions]);

  // Persist shayari counts (likes, shares, downloads) to localStorage
  useEffect(() => {
    if (shayaris.length === 0) return;
    const counts: Record<string, { likes: number; shares: number; downloads: number }> = {};
    shayaris.forEach(s => { counts[s.id] = { likes: s.likes, shares: s.shares ?? 0, downloads: s.downloads ?? 0 }; });
    localStorage.setItem('shayariCounts', JSON.stringify(counts));
  }, [shayaris]);

  const handleLike = (id: string) => {
    if (likedShayaris.has(id)) {
      setLikedShayaris(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setShayaris(prev => prev.map(s => s.id === id ? { ...s, likes: s.likes - 1 } : s));
      toast.info(t.like);
    } else {
      setLikedShayaris(prev => new Set(prev).add(id));
      setShayaris(prev => prev.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s));
      toast.success(t.liked);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(t.copied);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Shared canvas builder — used by both download and share
  const buildShayariCanvas = async (shayari: Shayari, displayLang: Language): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No canvas context');

    // helper: beginPath + roundRect + fill
    const fillRRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
    };
    // helper: beginPath + roundRect + stroke
    const strokeRRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.stroke();
    };

    const textToDisplay = getShayariTextByLanguage(shayari, displayLang);
    canvas.width = 1080;
    canvas.height = 1920;

    // Gradient background — no random circles
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(0.5, '#ff8e8e');
    gradient.addColorStop(1, '#4ecdc4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // White card (shadow then fill, clear shadow immediately)
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;
    ctx.fillStyle = 'white';
    fillRRect(50, 50, canvas.width - 100, canvas.height - 100, 40);
    ctx.restore();

    // Inner border
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 3;
    strokeRRect(70, 70, canvas.width - 140, canvas.height - 140, 30);

    // Corner accents
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(70, 110); ctx.lineTo(70, 70); ctx.lineTo(110, 70); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(canvas.width - 110, 70); ctx.lineTo(canvas.width - 70, 70); ctx.lineTo(canvas.width - 70, 110); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(70, canvas.height - 110); ctx.lineTo(70, canvas.height - 70); ctx.lineTo(110, canvas.height - 70); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(canvas.width - 110, canvas.height - 70); ctx.lineTo(canvas.width - 70, canvas.height - 70); ctx.lineTo(canvas.width - 70, canvas.height - 110); ctx.stroke();

    // Brand name
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 48px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Shayari wale', canvas.width / 2, 140);

    // Category badge — width auto-fits the text
    const categoryName = getCategoryNames(language)[shayari.category] || shayari.category;
    ctx.font = 'bold 26px Poppins, sans-serif';
    const badgePad = 40;
    const badgeW = Math.max(200, ctx.measureText(categoryName).width + badgePad * 2);
    const badgeH = 54;
    const badgeX = canvas.width / 2 - badgeW / 2;
    const badgeY = 185;
    ctx.fillStyle = '#fff0f0';
    fillRRect(badgeX, badgeY, badgeW, badgeH, badgeH / 2);
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    strokeRRect(badgeX, badgeY, badgeW, badgeH, badgeH / 2);
    ctx.fillStyle = '#ff6b6b';
    ctx.fillText(categoryName, canvas.width / 2, badgeY + 36);

    // Load shayari image — use absolute URL to guarantee fetch works
    const imgY = 280, imgWidth = 800, imgHeight = 500;
    const imgX = (canvas.width - imgWidth) / 2;
    let imgLoaded = false;
    try {
      const absoluteUrl = new URL(shayari.image, window.location.origin).href;
      const resp = await fetch(absoluteUrl);
      if (!resp.ok) throw new Error('fetch failed');
      const blob = await resp.blob();
      const dataUrl = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(blob);
      });
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const el = new Image();
        el.onload = () => res(el);
        el.onerror = rej;
        el.src = dataUrl;
      });
      // Draw image clipped to rounded rect — no shadow inside clip
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgWidth, imgHeight, 20);
      ctx.clip();
      ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
      ctx.restore();
      // Border around image
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 3;
      strokeRRect(imgX, imgY, imgWidth, imgHeight, 20);
      imgLoaded = true;
    } catch {
      imgLoaded = false;
    }

    if (!imgLoaded) {
      // Gradient placeholder — no circle artifacts
      const ph = ctx.createLinearGradient(imgX, imgY, imgX + imgWidth, imgY + imgHeight);
      ph.addColorStop(0, '#ffe0e0');
      ph.addColorStop(1, '#e0f7f5');
      ctx.fillStyle = ph;
      fillRRect(imgX, imgY, imgWidth, imgHeight, 20);
    }

    // Text area background — starts right after image with small gap
    const textY = 820;
    ctx.fillStyle = '#fafafa';
    fillRRect(90, textY - 20, canvas.width - 180, 560, 20);

    // Opening quote
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 90px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText('\u201C', 115, textY + 55);

    // Shayari text — larger font
    ctx.fillStyle = '#2c3e50';
    ctx.textAlign = 'center';
    let fontFamily = 'Poppins, sans-serif';
    if (displayLang === 'hi' || displayLang === 'mr') fontFamily = '"Noto Sans Devanagari", sans-serif';
    else if (displayLang === 'te' || displayLang === 'ta') fontFamily = '"Noto Sans Telugu", sans-serif';
    else if (displayLang === 'gu') fontFamily = '"Noto Sans Gujarati", sans-serif';
    ctx.font = `46px ${fontFamily}`;

    const wrapText = (text: string, maxWidth: number): string[] => {
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let cur = '';
      for (const word of words) {
        const test = cur ? cur + ' ' + word : word;
        if (ctx.measureText(test).width > maxWidth && cur) { lines.push(cur); cur = word; }
        else cur = test;
      }
      if (cur) lines.push(cur);
      return lines;
    };

    const paragraphs = textToDisplay.split('\n').filter(p => p.trim());
    let currentY = textY + 70;
    const lineH = 64;
    for (const para of paragraphs) {
      for (const line of wrapText(para, 880)) {
        ctx.fillText(line, canvas.width / 2, currentY);
        currentY += lineH;
      }
      currentY += 16;
    }

    // Closing quote
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 90px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText('\u201D', canvas.width - 115, currentY);

    // Author — tight gap after text
    ctx.textAlign = 'center';
    ctx.fillStyle = '#666';
    ctx.font = 'italic 34px Poppins, sans-serif';
    ctx.fillText(`\u2014 ${shayari.author} \u2014`, canvas.width / 2, currentY + 55);

    // Language label — small, close under author
    ctx.fillStyle = '#aaa';
    ctx.font = '24px Poppins, sans-serif';
    ctx.fillText(`In ${languageNames[displayLang]}`, canvas.width / 2, currentY + 100);

    // Footer
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 28px Poppins, sans-serif';
    ctx.fillText('Shayari wale', canvas.width / 2, canvas.height - 120);
    ctx.fillStyle = '#999';
    ctx.font = '22px Poppins, sans-serif';
    ctx.fillText('shayariwale.in', canvas.width / 2, canvas.height - 85);
    ctx.fillStyle = '#ccc';
    ctx.font = '18px Poppins, sans-serif';
    ctx.fillText('Share the love of Shayari \u2764', canvas.width / 2, canvas.height - 55);

    return canvas;
  };

  const handleShare = async (shayari: Shayari, lang?: Language) => {
    const displayLang = lang || language;
    const textToShare = getShayariTextByLanguage(shayari, displayLang);
    const siteUrl = 'https://shayariwale.in';
    const shareText = `${textToShare}\n\n— ${shayari.author}\n\n${siteUrl}`;

    // Increment share count
    setShayaris(prev => prev.map(s => s.id === shayari.id ? { ...s, shares: (s.shares ?? 0) + 1 } : s));

    try {
      // Build the image first
      const canvas = await buildShayariCanvas(shayari, displayLang);

      // Convert canvas to a File for sharing
      const blob = await new Promise<Blob>((res, rej) =>
        canvas.toBlob(b => b ? res(b) : rej(new Error('toBlob failed')), 'image/png', 1.0)
      );
      const file = new File([blob], `shayari-${shayari.id}.png`, { type: 'image/png' });

      // Share with image if supported, else fall back to text+url
      if (navigator.share) {
        const canShareFiles = navigator.canShare && navigator.canShare({ files: [file] });
        if (canShareFiles) {
          await navigator.share({ title: 'Shayari wale', text: shareText, files: [file] });
        } else {
          await navigator.share({ title: 'Shayari wale', text: shareText, url: siteUrl });
        }
      } else {
        // Desktop fallback: download the image + copy text
        const link = document.createElement('a');
        link.download = `shayari-${shayari.id}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        await navigator.clipboard.writeText(shareText);
        toast.success('Image saved & text copied!');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        // Fallback to text-only share
        if (navigator.share) {
          try { await navigator.share({ title: 'Shayari wale', text: shareText, url: siteUrl }); } catch { /* cancelled */ }
        } else {
          await navigator.clipboard.writeText(shareText);
          toast.success(t.copied);
        }
      }
    }
  };

  const handleDownload = async (shayari: Shayari, lang?: Language) => {
    const displayLang = lang || language;
    const canvas = await buildShayariCanvas(shayari, displayLang);
    const link = document.createElement('a');
    link.download = `shayari-${shayari.id}-${displayLang}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    // Increment download count
    setShayaris(prev => prev.map(s => s.id === shayari.id ? { ...s, downloads: (s.downloads ?? 0) + 1 } : s));
    toast.success('Shayari downloaded successfully!');
  };

  // Helper function to normalize text for comparison
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
  };

  // Helper function to check for duplicate Shayari
  const checkDuplicateShayari = (newShayari: string): { isDuplicate: boolean; existingShayari?: Shayari } => {
    const normalizedNew = normalizeText(newShayari);
    
    // Check against all existing Shayaris
    for (const existing of shayaris) {
      // Check in all language versions
      const textsToCheck = [
        existing.text,
        existing.textHi,
        existing.textTe,
        existing.textGu,
        existing.textMr,
        existing.textTa
      ].filter(Boolean) as string[];
      
      for (const existingText of textsToCheck) {
        const normalizedExisting = normalizeText(existingText);
        
        // Check for exact match or high similarity (80% match)
        if (normalizedExisting === normalizedNew) {
          return { isDuplicate: true, existingShayari: existing };
        }
        
        // Check if one contains the other (for partial matches)
        if (normalizedExisting.length > 20 && normalizedNew.length > 20) {
          if (normalizedExisting.includes(normalizedNew) || normalizedNew.includes(normalizedExisting)) {
            return { isDuplicate: true, existingShayari: existing };
          }
        }
      }
    }
    
    // Also check against pending user submissions
    for (const submission of userSubmissions) {
      const normalizedSubmission = normalizeText(submission.shayari);
      if (normalizedSubmission === normalizedNew) {
        return { isDuplicate: true };
      }
    }
    
    return { isDuplicate: false };
  };

  const handleSubmitShayari = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitForm.name || !submitForm.email || !submitForm.shayari || !submitForm.category) {
      toast.error('Please fill all fields');
      return;
    }
    
    // Check for duplicate Shayari
    const duplicateCheck = checkDuplicateShayari(submitForm.shayari);
    if (duplicateCheck.isDuplicate) {
      toast.error('Please upload unique shayari. This shayari is already available on our website.', {
        duration: 5000,
      });
      return;
    }
    
    // Find a suitable image — match by first line of shayari text against existing shayaris
    const firstLine = submitForm.shayari.split('\n')[0].trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
    let assignedImage = '';

    // Try to find a shayari whose text starts with a similar first line
    if (firstLine.length > 5) {
      const textMatch = shayaris.find(s => {
        const sFirst = s.text.split('\n')[0].trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
        return sFirst.startsWith(firstLine.substring(0, Math.min(firstLine.length, 20)));
      });
      if (textMatch) assignedImage = textMatch.image;
    }

    // Fallback: pick from same category
    if (!assignedImage) {
      const categoryShayaris = shayaris.filter(s => s.category === submitForm.category);
      if (categoryShayaris.length > 0) {
        assignedImage = categoryShayaris[Math.floor(Math.random() * categoryShayaris.length)].image;
      }
    }
    
    const newSubmission: UserSubmission = {
      id: Date.now().toString(),
      name: submitForm.name,
      email: submitForm.email.toLowerCase().trim(),
      shayari: submitForm.shayari,
      category: submitForm.category,
      language: submitForm.language,
      likes: 0,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    // Store submission with assigned image
    const submissionWithImage = {
      ...newSubmission,
      assignedImage: assignedImage
    };
    
    setUserSubmissions(prev => [...prev, submissionWithImage]);
    
    // Save to localStorage with image reference
    const allSubmissions = JSON.parse(localStorage.getItem('userSubmissions') || '[]');
    allSubmissions.push(submissionWithImage);
    localStorage.setItem('userSubmissions', JSON.stringify(allSubmissions));
    
    // Also save to a separate "pending uploads" list for admin review
    const pendingUploads = JSON.parse(localStorage.getItem('pendingShayariUploads') || '[]');
    pendingUploads.push({
      ...submissionWithImage,
      suggestedImage: assignedImage,
      uploadDate: new Date().toISOString()
    });
    localStorage.setItem('pendingShayariUploads', JSON.stringify(pendingUploads));
    
    setSubmitForm({ name: '', email: '', shayari: '', category: '', language: 'en' });
    setShowSubmitDialog(false);
    toast.success('Shayari submitted for review! We will notify you via email once approved.', {
      duration: 4000,
    });
  };

  // Filter shayaris by category and search
  const filteredShayaris = shayaris.filter(s => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      s.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedShayaris = filteredShayaris.slice(0, displayCount);
  const hasMore = displayCount < filteredShayaris.length;

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'glass shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <Feather className="w-8 h-8 text-[#ff6b6b] transition-transform group-hover:rotate-12" />
              <span className="font-display text-2xl lg:text-3xl text-[#2c3e50] group-hover:text-[#ff6b6b] transition-colors">
                Shayari wale
              </span>
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#home" className="text-[#2c3e50] hover:text-[#ff6b6b] transition-colors font-medium relative group">
                {t.home}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff6b6b] transition-all group-hover:w-full" />
              </a>
              <a href="#categories" className="text-[#2c3e50] hover:text-[#ff6b6b] transition-colors font-medium relative group">
                {t.categories}
              </a>
              <a href="#submit" className="text-[#2c3e50] hover:text-[#ff6b6b] transition-colors font-medium relative group">
                {t.submitShayari}
              </a>
              <a href="#contact" className="text-[#2c3e50] hover:text-[#ff6b6b] transition-colors font-medium relative group">
                {t.contact}
              </a>
            </div>
            
            {/* Language Selector */}
            <div className="hidden lg:flex items-center gap-4">
              <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                <SelectTrigger className="w-32 border-[#ff6b6b]/30">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(languageNames) as Language[]).map(lang => (
                    <SelectItem key={lang} value={lang}>
                      {languageNames[lang]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden glass border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#home" className="block py-2 text-[#2c3e50]" onClick={() => setIsMenuOpen(false)}>{t.home}</a>
              <a href="#categories" className="block py-2 text-[#2c3e50]" onClick={() => setIsMenuOpen(false)}>{t.categories}</a>
              <a href="#submit" className="block py-2 text-[#2c3e50]" onClick={() => setIsMenuOpen(false)}>{t.submitShayari}</a>
              <a href="#contact" className="block py-2 text-[#2c3e50]" onClick={() => setIsMenuOpen(false)}>{t.contact}</a>
              <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                <SelectTrigger className="w-full mt-4">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(languageNames) as Language[]).map(lang => (
                    <SelectItem key={lang} value={lang}>
                      {languageNames[lang]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 pb-52 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b6b]/10 via-transparent to-[#4ecdc4]/10" />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-[#ff6b6b]/10 text-4xl font-urdu"
              style={{
                left: `${Math.random() * 100}%`,
                animation: `particle-float ${15 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            >
              {['श', 'ی', 'ر', 'ق', 'ल', 'फ', '़', 'द', 'ا', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ'][i]}
            </div>
          ))}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#2c3e50] leading-tight mb-6">
                {t.heroTitle.split(' ').map((word, i) => (
                  <span 
                    key={i} 
                    className="inline-block animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {word}{' '}
                  </span>
                ))}
              </h1>
              <p className="text-lg sm:text-xl text-[#2c3e50]/70 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                {t.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <Button 
                  size="lg" 
                  className="gradient-bg text-white hover:opacity-90 animate-pulse-glow"
                  onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t.exploreShayari}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-white"
                  onClick={() => setShowSubmitDialog(true)}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t.submitYourOwn}
                </Button>
              </div>
              <p className="mt-8 text-sm text-[#2c3e50]/60 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                {t.stats}
              </p>
            </div>
            
            {/* Right Content - Featured Cards */}
            <div className="hidden lg:block relative h-[500px]">
              {shayaris.slice(0, 3).map((shayari, i) => (
                <Card
                  key={shayari.id}
                  className="absolute w-80 p-6 bg-white/90 backdrop-blur shadow-2xl transition-all duration-500 hover:scale-105"
                  style={{
                    top: `${i * 60}px`,
                    left: `${i * 40}px`,
                    transform: `rotate(${(i - 1) * 5}deg)`,
                    zIndex: 3 - i,
                    animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`
                  }}
                >
                  <Quote className="w-8 h-8 text-[#ff6b6b]/30 mb-3" />
                  <p className={`text-sm text-[#2c3e50] mb-4 line-clamp-3 ${language === 'hi' || language === 'mr' ? 'font-hindi' : language === 'te' || language === 'ta' ? 'font-tamil' : ''}`}>
                    {getShayariTextByLanguage(shayari, language).slice(0, 100)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#2c3e50]/60">- {shayari.author}</span>
                    <Badge variant="secondary" className="text-xs">
                      <Heart className="w-3 h-3 mr-1" />
                      {shayari.likes}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        {/* Most-Liked Shayari Card Ticker — image cards scrolling inside hero bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '200px' }}>
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent)' }} />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.6), transparent)' }} />
          {/* Scrolling cards */}
          <div className="ticker-cards h-[200px] py-3 px-2" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            {(() => {
              // Daily seed: rotate which 12 shayaris show based on today's date
              const today = new Date();
              const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
              const sorted = [...allShayaris].sort((a, b) => b.likes - a.likes);
              const pool = sorted.slice(0, 50);
              const offset = daySeed % (pool.length - 12);
              const top = pool.slice(offset, offset + 12);
              const items = [...top, ...top, ...top]; // triple for seamless -33.333% loop
              return items.map((s, i) => (
                <div
                  key={`tc-${s.id}-${i}`}
                  className="flex-shrink-0 relative rounded-xl overflow-hidden shadow-lg cursor-pointer"
                  style={{ width: '140px', height: '172px' }}
                  onClick={(e) => {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    setTickerCardRect(rect);
                    setTickerShayari(tickerShayari?.id === s.id ? null : s);
                    setTickerLang('en');
                  }}
                >
                  <img src={s.image} alt={s.author} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-white text-[10px] leading-tight line-clamp-2 font-medium">
                      {s.text.replace(/\\n/g, '\n').split('\n')[0].trim()}
                    </p>
                    <p className="text-white/60 text-[9px] mt-1 italic">— {s.author}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/40 rounded-full px-1.5 py-0.5">
                    <Heart className="w-2.5 h-2.5 text-[#ff6b6b] fill-current" />
                    <span className="text-white text-[9px]">{s.likes}</span>
                  </div>
                  {tickerShayari?.id === s.id && (
                    <div className="absolute inset-0 ring-2 ring-[#ff6b6b] rounded-xl" />
                  )}
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Floating Shayari Popup — appears above clicked ticker card */}
      {tickerShayari && tickerCardRect && (
        <>
          {/* Backdrop to close */}
          <div className="fixed inset-0 z-40" onClick={() => setTickerShayari(null)} />
          {/* Popup card — same aspect ratio as category cards */}
          <div
            className="fixed z-50 shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up"
            style={{
              width: '260px',
              aspectRatio: '3/4',
              left: Math.min(Math.max(tickerCardRect.left + tickerCardRect.width / 2 - 130, 8), window.innerWidth - 268),
              top: tickerCardRect.top - (260 * 4 / 3) - 12,
            }}
          >
            {/* Background image */}
            <img src={tickerShayari.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)' }} />

            {/* Close button */}
            <button
              onClick={() => setTickerShayari(null)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center text-xs hover:bg-black/80 transition-colors z-10"
            >✕</button>

            {/* Like badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
              <Heart className="w-3 h-3 text-[#ff6b6b] fill-current" />
              <span className="text-white text-[10px]">{tickerShayari.likes}</span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
              {/* Language toggles */}
              <div className="flex gap-1 flex-wrap">
                {(['en','hi','ta','mr','gu'] as Language[]).map(l => (
                  <button
                    key={l}
                    onClick={() => setTickerLang(l)}
                    className={`text-[9px] px-2 py-0.5 rounded-full border transition-colors ${
                      tickerLang === l
                        ? 'bg-[#ff6b6b] border-[#ff6b6b] text-white'
                        : 'border-white/40 text-white/60 hover:border-white hover:text-white'
                    }`}
                  >
                    {l === 'en' ? 'EN' : l === 'hi' ? 'HI' : l === 'ta' ? 'TA' : l === 'mr' ? 'MR' : 'GU'}
                  </button>
                ))}
              </div>

              {/* Shayari text */}
              <p className="text-white text-sm leading-relaxed whitespace-pre-line line-clamp-5">
                {getShayariTextByLanguage(tickerShayari, tickerLang).replace(/\\n/g, '\n')}
              </p>
              <p className="text-white/60 text-xs italic">— {tickerShayari.author}</p>

              {/* Action row */}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => handleShare(tickerShayari, tickerLang)}
                  className="flex-1 flex items-center justify-center gap-1 bg-white/15 hover:bg-white/25 text-white text-xs py-1.5 rounded-full transition-colors"
                >
                  <Share2 className="w-3 h-3" /> Share
                </button>
                <button
                  onClick={() => handleDownload(tickerShayari, tickerLang)}
                  className="flex-1 flex items-center justify-center gap-1 bg-white/15 hover:bg-white/25 text-white text-xs py-1.5 rounded-full transition-colors"
                >
                  <Download className="w-3 h-3" /> Save
                </button>
                <button
                  onClick={() => { setTickerShayari(null); setSelectedCategory(tickerShayari.category); setDisplayCount(12); document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="flex-1 flex items-center justify-center gap-1 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-xs py-1.5 rounded-full transition-colors"
                >
                  More
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl text-[#2c3e50] mb-4">
              {t.categoriesTitle}
            </h2>
            <p className="text-lg text-[#2c3e50]/60">
              {t.categoriesSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allCategories.map((cat, i) => (
              <Card
                key={cat}
                className="group relative overflow-hidden cursor-pointer card-hover"
                onClick={() => {
                  setSelectedCategory(cat);
                  setDisplayCount(12);
                  document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="aspect-shayari relative overflow-hidden">
                  <img
                    src={categoryImages[cat]}
                    alt={getCategoryNames(language)[cat]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-xl text-white mb-1">
                      {getCategoryNames(language)[cat]}
                    </h3>
                    <p className="text-xs text-white/70">
                      {shayaris.filter(s => s.category === cat).length} Shayaris
                    </p>
                    <Button 
                      size="sm" 
                      className="mt-3 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 gradient-bg text-xs"
                    >
                      {t.exploreShayari}
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ad slot — between Categories and Featured */}
      <AdSlot slot="1234567890" className="py-4 bg-white" />

      {/* Featured Shayari Section */}
      <section id="featured" className="py-20 bg-[#f7f7f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl text-[#2c3e50] mb-2">
                {t.featuredShayari}
              </h2>
              <p className="text-[#2c3e50]/60">
                {selectedCategory !== 'all' && getCategoryNames(language)[selectedCategory]}
              </p>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Input
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(12);
              }}
              className="flex-1"
            />
            <Select value={selectedCategory} onValueChange={(v) => {
              setSelectedCategory(v as Category | 'all');
              setDisplayCount(12);
            }}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t.selectCategory} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryNames(language)[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Results Count */}
          <p className="text-sm text-[#2c3e50]/60 mb-6">
            {t.showing} {Math.min(displayCount, filteredShayaris.length)} {t.of} {filteredShayaris.length} {t.total}
          </p>
          
          {filteredShayaris.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-[#2c3e50]/60">{t.noResults}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedShayaris.map((shayari, i) => (
                  <div key={shayari.id} style={{ animationDelay: `${i * 0.05}s` }} className="animate-fade-in-up">
                    <ShayariCard
                      shayari={shayari}
                      initialLang={language}
                      likedShayaris={likedShayaris}
                      copiedId={copiedId}
                      onLike={handleLike}
                      onCopy={handleCopy}
                      onShare={handleShare}
                      onDownload={handleDownload}
                      getCategoryNames={getCategoryNames}
                    />
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-8">
                  <Button
                    onClick={() => setDisplayCount(prev => prev + 12)}
                    variant="outline"
                    className="border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-white"
                  >
                    {t.loadMore}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Ad slot — between Featured and Submit */}
      <AdSlot slot="0987654321" className="py-4 bg-[#f7f7f7]" />

      {/* Submit Shayari Section */}
      <section id="submit" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b6b]/5 to-[#4ecdc4]/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl text-[#2c3e50] mb-6">
                {t.shareWords}
              </h2>
              <p className="text-lg text-[#2c3e50]/70 mb-8">
                {t.shareDescription}
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">5,000+</div>
                  <div className="text-sm text-[#2c3e50]/60">{t.submissionsReceived}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">1,200+</div>
                  <div className="text-sm text-[#2c3e50]/60">{t.published}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">50+</div>
                  <div className="text-sm text-[#2c3e50]/60">{t.dailySubmissions}</div>
                </div>
              </div>
            </div>
            
            <Card className="p-8 shadow-2xl">
              <form onSubmit={handleSubmitShayari} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">{t.name}</label>
                    <Input
                      value={submitForm.name}
                      onChange={e => setSubmitForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t.name}
                      className="border-[#e0e0e0] focus:border-[#ff6b6b] focus:ring-[#ff6b6b]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">{t.email}</label>
                    <Input
                      type="email"
                      value={submitForm.email}
                      onChange={e => setSubmitForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder={t.email}
                      className="border-[#e0e0e0] focus:border-[#ff6b6b] focus:ring-[#ff6b6b]"
                    />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">{t.category}</label>
                    <Select 
                      value={submitForm.category} 
                      onValueChange={v => setSubmitForm(prev => ({ ...prev, category: v as Category }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectCategory} />
                      </SelectTrigger>
                      <SelectContent>
                        {allCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {getCategoryNames(language)[cat]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">{t.language}</label>
                    <Select 
                      value={submitForm.language} 
                      onValueChange={v => setSubmitForm(prev => ({ ...prev, language: v as Language }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectLanguage} />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(languageNames) as Language[]).map(lang => (
                          <SelectItem key={lang} value={lang}>
                            {languageNames[lang]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#2c3e50] mb-2">{t.yourShayari}</label>
                  <Textarea
                    value={submitForm.shayari}
                    onChange={e => setSubmitForm(prev => ({ ...prev, shayari: e.target.value }))}
                    placeholder={t.yourShayari}
                    rows={6}
                    className="border-[#e0e0e0] focus:border-[#ff6b6b] focus:ring-[#ff6b6b] resize-none"
                  />
                  <p className="text-xs text-[#2c3e50]/50 mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    We check for duplicate Shayaris. Please submit unique content only.
                  </p>
                </div>
                
                <Button type="submit" size="lg" className="w-full gradient-bg btn-glow">
                  <Send className="w-5 h-5 mr-2" />
                  {t.submit}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#2c3e50] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Wave SVG */}
          <div className="relative -mt-24 mb-12 overflow-hidden">
            <svg className="w-full h-16 animate-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path 
                d="M0,60 C300,120 600,0 900,60 C1200,120 1200,60 1200,60 L1200,120 L0,120 Z" 
                fill="#2c3e50"
              />
            </svg>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Logo & Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Feather className="w-8 h-8 text-[#ff6b6b]" />
                <span className="font-display text-2xl">Shayari wale</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                {t.footerDescription}
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">{t.quickLinks}</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-white/70 hover:text-[#ff6b6b] transition-colors">{t.home}</a></li>
                <li><a href="#categories" className="text-white/70 hover:text-[#ff6b6b] transition-colors">{t.categories}</a></li>
                <li><a href="#submit" className="text-white/70 hover:text-[#ff6b6b] transition-colors">{t.submitShayari}</a></li>
                <li><a href="/about-us.html" className="text-white/70 hover:text-[#ff6b6b] transition-colors">{t.aboutUs}</a></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="font-semibold text-lg mb-4">{t.legal}</h4>
              <ul className="space-y-2">
                <li><a href="/privacy-policy.html" className="text-white/70 hover:text-[#ff6b6b] transition-colors">{t.privacyPolicy}</a></li>
                <li><a href="/terms-of-service.html" className="text-white/70 hover:text-[#ff6b6b] transition-colors">{t.termsOfService}</a></li>
                <li><a href="/content-guidelines.html" className="text-white/70 hover:text-[#ff6b6b] transition-colors">{t.contentGuidelines}</a></li>
              </ul>
            </div>
            
            {/* Connect */}
            <div>
              <h4 className="font-semibold text-lg mb-4">{t.connect}</h4>
              <div className="flex gap-3 mb-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ff6b6b] transition-all hover:scale-110">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ff6b6b] transition-all hover:scale-110">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ff6b6b] transition-all hover:scale-110">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ff6b6b] transition-all hover:scale-110">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
              <a
                href="mailto:shayariwale.in@gmail.com"
                className="text-white/70 hover:text-[#ff6b6b] transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                shayariwale.in@gmail.com
              </a>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Shayari wale (Shayariwale.in). {t.allRightsReserved}
            </p>
          </div>
        </div>
      </footer>

      {/* Submit Shayari Dialog (Mobile) */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.submitYourOwn}</DialogTitle>
            <DialogDescription>{t.shareDescription}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitShayari} className="space-y-4 mt-4">
            <div className="grid gap-4">
              <Input
                value={submitForm.name}
                onChange={e => setSubmitForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t.name}
              />
              <Input
                type="email"
                value={submitForm.email}
                onChange={e => setSubmitForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder={t.email}
              />
              <Select 
                value={submitForm.category} 
                onValueChange={v => setSubmitForm(prev => ({ ...prev, category: v as Category }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.selectCategory} />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {getCategoryNames(language)[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={submitForm.shayari}
                onChange={e => setSubmitForm(prev => ({ ...prev, shayari: e.target.value }))}
                placeholder={t.yourShayari}
                rows={6}
              />
              <p className="text-xs text-[#2c3e50]/50 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                We check for duplicate Shayaris. Please submit unique content only.
              </p>
            </div>
            <Button type="submit" className="w-full gradient-bg">
              <Send className="w-5 h-5 mr-2" />
              {t.submit}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
