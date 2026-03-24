const https = require('https');
const fs = require('fs');
const path = require('path');

const PAGE_ID = process.env.FB_PAGE_ID;
const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const WEBSITE_URL = 'https://Shayariwale.in'; // Update with your actual domain

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
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % total;
}

function buildPostMessage(shayari) {
  const hashtags = CATEGORY_HASHTAGS[shayari.category] || '#Shayari #ShayariDil #Poetry';
  const text = shayari.text.replace(/\\n/g, '\n').trim();
  return `${text}\n\n✍️ — ${shayari.author || 'ShayariDil'}\n\n🌐 Read more: ${WEBSITE_URL}\n\n${hashtags}`;
}

function httpsPost(url, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.error) reject(new Error(`FB API Error: ${JSON.stringify(parsed.error)}`));
          else resolve(parsed);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${raw}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  if (!PAGE_ID || !ACCESS_TOKEN) {
    console.error('Missing FB_PAGE_ID or FB_ACCESS_TOKEN environment variables');
    process.exit(1);
  }

  const shayarisPath = path.join(__dirname, '../../app/public/shayaris.json');
  const shayaris = JSON.parse(fs.readFileSync(shayarisPath, 'utf-8'));

  const index = getTodayIndex(shayaris.length);
  const shayari = shayaris[index];

  console.log(`Posting shayari #${index}: [${shayari.category}] ${shayari.id}`);

  const message = buildPostMessage(shayari);
  const imageUrl = `${WEBSITE_URL}${shayari.image}`;

  console.log('Image URL:', imageUrl);
  console.log('Message preview:\n', message.substring(0, 200));

  const result = await httpsPost(
    `https://graph.facebook.com/v19.0/${PAGE_ID}/photos`,
    { url: imageUrl, caption: message, access_token: ACCESS_TOKEN }
  );

  console.log('Posted successfully! Post ID:', result.id || result.post_id);
}

main().catch(err => {
  console.error('Failed to post:', err.message);
  process.exit(1);
});
