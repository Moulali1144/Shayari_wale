const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const PAGE_ID = process.env.FB_PAGE_ID;
const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const WEBSITE_URL = 'https://shayaridil.com'; // Update with your actual domain

// Hashtag mapping per category
const CATEGORY_HASHTAGS = {
  romantic:           '#RomanticShayari #Love #Romance #Ishq #Mohabbat #ShayariDil #LoveQuotes #RomanticQuotes #DilKiBaat #PyaarShayari',
  sad:                '#SadShayari #Dard #Tanhai #BrokenHeart #SadQuotes #ShayariDil #DilDard #GhamShayari #EmotionalQuotes #SadPoetry',
  breakup:            '#BreakupShayari #LoveFailure #BrokenHeart #MovingOn #HeartbrokenQuotes #ShayariDil #DilTuta #AkeleHain #SadLove',
  friendship:         '#FriendshipShayari #Dosti #BestFriends #FriendshipGoals #YaarShayari #ShayariDil #DostiQuotes #TrueFriends #FriendshipDay',
  motivation:         '#MotivationalShayari #Inspiration #SuccessQuotes #NeverGiveUp #HimmatShayari #ShayariDil #MotivationDaily #PositiveVibes #LifeQuotes',
  birthday:           '#BirthdayShayari #HappyBirthday #BirthdayWishes #JanmdinMubarak #ShayariDil #BirthdayQuotes #CelebrationShayari #BirthdayVibes',
  ganesh:             '#GaneshShayari #JaiGanesh #GanpatiBappaMorya #GaneshChaturthi #DevotionalShayari #ShayariDil #BlessingsShayari #GaneshBhakti',
  goodmorning:        '#GoodMorningShayari #SubahBakhair #MorningVibes #GoodMorningQuotes #ShayariDil #MorningMotivation #NewDayNewBeginning #SunriseShayari',
  attitude:           '#AttitudeShayari #AttitudeQuotes #BoldShayari #SelfRespect #ShayariDil #AttitudeStatus #KingAttitude #ConfidenceShayari',
  marriagefunny:      '#MarriageShayari #FunnyShayari #ShadiShayari #HumorShayari #ShayariDil #MarriageHumor #WeddingFun #CoupleFunny',
  marriageanniversary:'#AnniversaryShayari #HappyAnniversary #ShadiSaalgirah #LoveAnniversary #ShayariDil #CoupleGoals #AnniversaryWishes #TogetherForever',
  islamic:            '#IslamicShayari #IslamicQuotes #Allah #Dua #IslamicPoetry #ShayariDil #IslamicWisdom #QuranQuotes #IslamicMotivation',
  durgapuja:          '#DurgaPujaShayari #JaiMaaDurga #DurgaPuja #NavratriShayari #ShayariDil #MaaDurga #DurgaPooja #DevotionalQuotes',
};

function getTodayIndex(total) {
  // Use day-of-year so each day gets a different shayari, cycling through all
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % total;
}

function buildPostMessage(shayari) {
  const hashtags = CATEGORY_HASHTAGS[shayari.category] || '#Shayari #ShayariDil #Poetry';

  // Clean up escaped newlines in text
  const text = shayari.text.replace(/\\n/g, '\n').trim();

  const message = `${text}

✍️ — ${shayari.author || 'ShayariDil'}

🌐 Read more: ${WEBSITE_URL}

${hashtags}`;

  return message;
}

async function getImageUrl(shayari) {
  // Build absolute image URL from the relative path stored in JSON
  const imagePath = shayari.image; // e.g. /images/shayaris/xxx.webp
  return `${WEBSITE_URL}${imagePath}`;
}

async function postToFacebook(message, imageUrl) {
  // Post with photo (uses /photos endpoint which creates a post with image)
  const url = `https://graph.facebook.com/v19.0/${PAGE_ID}/photos`;

  const body = {
    url: imageUrl,
    caption: message,
    access_token: ACCESS_TOKEN,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(`Facebook API error: ${JSON.stringify(data.error || data)}`);
  }

  return data;
}

async function main() {
  if (!PAGE_ID || !ACCESS_TOKEN) {
    console.error('Missing FB_PAGE_ID or FB_ACCESS_TOKEN environment variables');
    process.exit(1);
  }

  // Load shayaris
  const shayarisPath = path.join(__dirname, '../../app/public/shayaris.json');
  const shayaris = JSON.parse(fs.readFileSync(shayarisPath, 'utf-8'));

  const index = getTodayIndex(shayaris.length);
  const shayari = shayaris[index];

  console.log(`Posting shayari #${index}: [${shayari.category}] ${shayari.id}`);

  const message = buildPostMessage(shayari);
  const imageUrl = await getImageUrl(shayari);

  console.log('Image URL:', imageUrl);
  console.log('Message preview:\n', message.substring(0, 200));

  const result = await postToFacebook(message, imageUrl);
  console.log('Posted successfully! Post ID:', result.id || result.post_id);
}

main().catch(err => {
  console.error('Failed to post:', err.message);
  process.exit(1);
});
