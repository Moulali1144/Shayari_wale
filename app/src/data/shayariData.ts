// Comprehensive Shayari Database - 1300+ Shayaris from CSV
// Each Shayari has a unique image

export type Language = 'en' | 'hi' | 'te' | 'gu' | 'mr' | 'ta';

export type Category = 
  | 'ganesh' 
  | 'goodmorning' 
  | 'birthday' 
  | 'attitude' 
  | 'marriagefunny'
  | 'motivation'
  | 'breakup'
  | 'friendship'
  | 'marriageanniversary'
  | 'sad'
  | 'islamic'
  | 'durgapuja'
  | 'romantic';

export interface Shayari {
  id: string;
  text: string;
  textHi?: string;
  textTe?: string;
  textGu?: string;
  textMr?: string;
  textTa?: string;
  author: string;
  category: Category;
  likes: number;
  shares: number;
  downloads: number;
  image: string;
  isUserSubmitted?: boolean;
  submitterEmail?: string;
}

// English category names
export const categoryNamesEn: Record<string, string> = {
  ganesh: 'Ganesh Puja',
  goodmorning: 'Good Morning',
  birthday: 'Birthday',
  attitude: 'Attitude',
  marriagefunny: 'Marriage Funny',
  motivation: 'Motivation',
  breakup: 'Breakup',
  friendship: 'Friendship',
  marriageanniversary: 'Marriage Anniversary',
  sad: 'Sad',
  islamic: 'Islamic',
  durgapuja: 'Durga Puja',
  romantic: 'Romantic'
};

// Hindi category names
export const categoryNamesHi: Record<string, string> = {
  ganesh: 'गणेश पूजा',
  goodmorning: 'सुप्रभात',
  birthday: 'जन्मदिन',
  attitude: 'एटीट्यूड',
  marriagefunny: 'शादी मजेदार',
  motivation: 'प्रेरणा',
  breakup: 'ब्रेकअप',
  friendship: 'दोस्ती',
  marriageanniversary: 'शादी की सालगिरह',
  sad: 'उदास',
  islamic: 'इस्लामिक',
  durgapuja: 'दुर्गा पूजा',
  romantic: 'रोमांटिक'
};

// Telugu category names
export const categoryNamesTe: Record<string, string> = {
  ganesh: 'గణేశ పూజ',
  goodmorning: 'శుభోదయం',
  birthday: 'పుట్టినరోజు',
  attitude: 'ఆటిట్యూడ్',
  marriagefunny: 'వివాహం ఫన్నీ',
  motivation: 'ప్రేరణ',
  breakup: 'బ్రేకప్',
  friendship: 'స్నేహం',
  marriageanniversary: 'వివాహ వార్షికోత్సవం',
  sad: 'విచారం',
  islamic: 'ఇస్లామిక్',
  durgapuja: 'దుర్గా పూజ',
  romantic: 'రొమాంటిక్'
};

// Gujarati category names
export const categoryNamesGu: Record<string, string> = {
  ganesh: 'ગણેશ પૂજા',
  goodmorning: 'સુપ્રભાત',
  birthday: 'જન્મદિવસ',
  attitude: 'એટિટ્યૂડ',
  marriagefunny: 'લગ્ન ફની',
  motivation: 'પ્રેરણા',
  breakup: 'બ્રેકઅપ',
  friendship: 'મૈત્રી',
  marriageanniversary: 'લગ્ન વર્ષગાંઠ',
  sad: 'ઉદાસ',
  islamic: 'ઇસ્લામિક',
  durgapuja: 'દુર્ગા પૂજા',
  romantic: 'રોમેન્ટિક'
};

// Marathi category names
export const categoryNamesMr: Record<string, string> = {
  ganesh: 'गणेश पूजा',
  goodmorning: 'सुप्रभात',
  birthday: 'वाढदिवस',
  attitude: 'अ‍ॅटिट्यूड',
  marriagefunny: 'लग्न फनी',
  motivation: 'प्रेरणा',
  breakup: 'ब्रेकअप',
  friendship: 'मैत्री',
  marriageanniversary: 'लग्न वाढदिवस',
  sad: 'दुःखी',
  islamic: 'इस्लामिक',
  durgapuja: 'दुर्गा पूजा',
  romantic: 'रोमँटिक'
};

// Tamil category names
export const categoryNamesTa: Record<string, string> = {
  ganesh: 'விநாயகர் பூஜை',
  goodmorning: 'காலை வணக்கம்',
  birthday: 'பிறந்தநாள்',
  attitude: 'அணுகுமுறை',
  marriagefunny: 'திருமண நகைச்சுவை',
  motivation: 'உறுதுணை',
  breakup: 'பிரிவு',
  friendship: 'நட்பு',
  marriageanniversary: 'திருமண நாள்',
  sad: 'சோகம்',
  islamic: 'இஸ்லாமிய',
  durgapuja: 'துர்கா பூஜை',
  romantic: 'காதல்'
};

// Function to get category names based on language
export function getCategoryNames(lang: string): Record<string, string> {
  switch (lang) {
    case 'hi': return categoryNamesHi;
    case 'te': return categoryNamesTe;
    case 'gu': return categoryNamesGu;
    case 'mr': return categoryNamesMr;
    case 'ta': return categoryNamesTa;
    default: return categoryNamesEn;
  }
}

// Sample Shayaris for initial render
export const sampleShayaris: Shayari[] = [
  {
    id: 'ganesh_001',
    text: 'Lord Ganesha, remover of obstacles,\nBless us with wisdom and prosperity,\nYour divine grace guides our path,\nWe bow to your sacred feet.',
    textHi: 'भगवान गणेश, बाधाओं के हर्ता,\nहमें ज्ञान और समृद्धि का आशीर्वाद दें,\nआपकी दिव्य कृपा हमारा मार्ग दर्शाती है,\nहम आपके पवित्र चरणों में प्रणाम करते हैं।',
    textTe: 'లార్డ్ గణేశ్, అడ్డంకులను తొలగించేవాడు,\nమాకు జ్ఞానం మరియు సమృద్ధిని ఆశీర్వదించండి,\nమీ దివ్య కృప మా మార్గాన్ని మార్గదర్శకం చేస్తుంది,\nమేము మీ పవిత్ర పాదాలకు నమస్కరిస్తాము.',
    textGu: 'ભગવાન ગણેશ, અવરોધો દૂર કરનાર,\nઅમને જ્ઞાન અને સમૃદ્ધિનો આશીર્વાદ આપો,\nતમારી દૈવી કૃપા અમારા માર્ગને દર્શાવે છે,\nઅમે તમારા પવિત્ર ચરણોમાં પ્રણામ કરીએ છીએ.',
    textMr: 'भगवान गणेश, अडथळे दूर करणारे,\nआम्हाला ज्ञान आणि समृद्धीचे आशीर्वाद द्या,\nतुमची दैवी कृपा आमचा मार्ग दाखवते,\nआम्ही तुमच्या पवित्र चरणांना प्रणाम करतो.',
    textTa: 'கடவுள் கணேசா, தடைகளை நீக்குபவர்,\nஎங்களுக்கு ஞானம் மற்றும் வளத்தை ஆசீர்வதியுங்கள்,\nஉங்கள் தெய்வீக அருள் எங்கள் பாதையை வழிகாட்டுகிறது,\nஉங்கள் புனித பாதங்களுக்கு நாங்கள் வணங்குகிறோம்.',
    author: 'Afsa Aleha',
    category: 'ganesh',
    likes: 4567,
    shares: 0,
    downloads: 0,
    image: '/images/shayaris/1_broken_heart_glass_symbolism_1_20260312_192611_result.webp'
  },
  {
    id: 'goodmorning_001',
    text: 'Good morning! Rise and shine,\nA new day brings new opportunities,\nMay your day be filled with joy,\nAnd your heart with gratitude.',
    textHi: 'सुप्रभात! उठो और चमको,\nएक नया दिन नए अवसर लाता है,\nआपका दिन खुशियों से भरा हो,\nऔर आपका दिल कृतज्ञता से भरा हो।',
    textTe: 'శుభోదయం! లేచి ప్రకాశించండి,\nకొత్త రోజు కొత్త అవకాశాలను తెస్తుంది,\nమీ రోజు సంతోషంతో నిండి ఉండాలి,\nమరియు మీ హృదయం కృతజ్ఞతతో నిండి ఉండాలి.',
    textGu: 'સુપ્રભાત! ઊઠો અને ચમકો,\nનવો દિવસ નવા અવસરો લાવે છે,\nતમારો દિવસ આનંદથી ભરેલો હોય,\nઅને તમારું હૃદય કૃતજ્ઞતાથી ભરેલું હોય.',
    textMr: 'सुप्रभात! उठा आणि चमका,\nनवीन दिवस नवीन संधी घेऊन येतो,\nतुमचा दिवस आनंदाने भरलेला असावा,\nआणि तुमचे हृदय कृतज्ञतेने भरलेले असावे.',
    textTa: 'காலை வணக்கம்! எழுந்து பிரகாசியுங்கள்,\nபுதிய நாள் புதிய வாய்ப்புகளைக் கொண்டுவருகிறது,\nஉங்கள் நாள் மகிழ்ச்சியால் நிரம்பியிருக்கட்டும்,\nஉங்கள் இதயம் நன்றியுணர்வால் நிரம்பியிருக்கட்டும்.',
    author: 'Arfa Aleha',
    category: 'goodmorning',
    likes: 2345,
    shares: 0,
    downloads: 0,
    image: '/images/shayaris/68_soft_pastel_sunrise_sky_inspir_1_20260311_213614_result.webp'
  },
  {
    id: 'birthday_001',
    text: 'Happy Birthday! May your day be special,\nFilled with love, laughter, and cheer,\nMay all your dreams come true,\nAnd bring you joy throughout the year.',
    textHi: 'जन्मदिन मुबारक! आपका दिन खास हो,\nप्यार, हंसी और खुशी से भरा हो,\nआपके सभी सपने सच हों,\nऔर पूरे साल आपको खुशी लाए।',
    textTe: 'పుట్టినరోజు శుభాకాంక్షలు! మీ రోజు ప్రత్యేకంగా ఉండాలి,\nప్రేమ, నవ్వులు మరియు ఆనందంతో నిండి ఉండాలి,\nమీ అన్ని కలలు నెరవేరాలి,\nమరియు మీకు సంవత్సరం మొత్తం ఆనందం తీసుకురావాలి.',
    textGu: 'જન્મદિવસની શુભકામનાઓ! તમારો દિવસ ખાસ રહે,\nપ્રેમ, હાસ્ય અને આનંદથી ભરેલો રહે,\nતમારા બધા સપના સાચા થાય,\nઅને વર્ષ દરમિયાન તમને આનંદ લાવે.',
    textMr: 'वाढदिवसाच्या शुभेच्छा! तुमचा दिवस खास असावा,\nप्रेम, हसण्याने आणि आनंदाने भरलेला असावा,\nतुमची सर्व स्वप्ने खरी व्हावीत,\nआणि वर्षभर तुम्हाला आनंद घेऊन यावा.',
    textTa: 'பிறந்தநாள் வாழ்த்துக்கள்! உங்கள் நாள் சிறப்பாக இருக்கட்டும்,\nகாதல், சிரிப்பு மற்றும் மகிழ்ச்சியால் நிரம்பியிருக்கட்டும்,\nஉங்கள் அனைத்து கனவுகளும் நிறைவேறட்டும்,\nமற்றும் ஆண்டு முழுவதும் உங்களுக்கு மகிழ்ச்சியைக் கொண்டுவரட்டும்.',
    author: 'Afsa Aleha',
    category: 'birthday',
    likes: 3456,
    shares: 0,
    downloads: 0,
    image: '/images/shayaris/168_minimal_happy_birthday_poster_1_20260311_215726_result.webp'
  }
];

// Full data will be loaded from shayaris.json
export let allShayaris: Shayari[] = [...sampleShayaris];

// Function to load full data
export async function loadShayaris(): Promise<Shayari[]> {
  try {
    const response = await fetch('/shayaris.json');
    const data: Shayari[] = await response.json();

    // Merge persisted counts from localStorage
    let counts: Record<string, { likes: number; shares: number; downloads: number }> = {};
    try {
      const saved = localStorage.getItem('shayariCounts');
      if (saved) counts = JSON.parse(saved);
    } catch { /* ignore */ }

    allShayaris = data.map(s => ({
      ...s,
      likes: counts[s.id]?.likes ?? s.likes ?? 0,
      shares: counts[s.id]?.shares ?? s.shares ?? 0,
      downloads: counts[s.id]?.downloads ?? s.downloads ?? 0,
    }));
    return allShayaris;
  } catch (error) {
    console.error('Failed to load shayaris:', error);
    return sampleShayaris;
  }
}

export default allShayaris;
