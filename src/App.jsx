import React, { useState, useRef, useEffect, useCallback } from 'react';

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,300;1,400;1,700&family=Raleway:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0a14;
    color: #f5f0e8;
    font-family: 'Raleway', sans-serif;
    overflow-x: hidden;
  }

  .scene-title {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: radial-gradient(ellipse at center, #1a1025 0%, #0a0a14 70%);
    position: relative;
  }

  .title-text {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(3rem, 8vw, 6rem);
    color: #f5f0e8;
    letter-spacing: 4px;
    text-align: center;
    line-height: 1.2;
  }

  .title-char {
    display: inline-block;
    opacity: 0;
    transform: translateY(30px);
    animation: charReveal 0.6s ease forwards;
  }

  @keyframes charReveal { to { opacity: 1; transform: translateY(0); } }

  .title-sub {
    font-family: 'Raleway', sans-serif;
    font-weight: 300;
    font-size: clamp(0.7rem, 2vw, 0.9rem);
    letter-spacing: 6px;
    text-transform: uppercase;
    color: #c9a96e;
    margin-top: 16px;
    opacity: 0;
    animation: fadeIn 1s ease 1.8s forwards;
  }

  .sparkle {
    position: absolute;
    border-radius: 50%;
    background: #c9a96e;
    animation: floatUp linear infinite;
    opacity: 0;
  }

  @keyframes floatUp {
    0% { opacity: 0; transform: translateY(0) scale(0); }
    20% { opacity: 1; transform: translateY(-20px) scale(1); }
    80% { opacity: 0.5; }
    100% { opacity: 0; transform: translateY(-120px) scale(0.3); }
  }

  .scene-exit { animation: sceneZoom 0.8s cubic-bezier(0.4,0,0.2,1) forwards; }
  @keyframes sceneZoom { to { opacity: 0; transform: scale(1.15); } }

  .app-shell {
    width: 100%;
    min-height: 100vh;
    background: #0a0a14;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 12px;
    gap: 12px;
    opacity: 0;
    transition: opacity 0.8s ease;
  }

  .app-shell.visible { opacity: 1; }

  .wall-art-row { display: flex; gap: 12px; align-items: flex-end; }

  .art-frame {
    width: 90px; height: 72px;
    border: 2px solid #c9a96e;
    background: linear-gradient(135deg, #1a1025, #0d0d1a);
    display: flex; align-items: center; justify-content: center;
    position: relative; flex-shrink: 0;
  }

  .art-frame::before {
    content: '';
    position: absolute; inset: 4px;
    border: 1px solid rgba(201,169,110,0.2);
    background: repeating-linear-gradient(45deg,transparent,transparent 4px,rgba(201,169,110,0.04) 4px,rgba(201,169,110,0.04) 5px);
  }

  .art-frame.centre { width: 120px; height: 96px; }
  .art-frame-text { font-family:'Playfair Display',serif; font-style:italic; color:rgba(201,169,110,0.5); font-size:10px; letter-spacing:2px; z-index:1; }

  .mirror-wrap {
    position: relative; width: 280px; height: 280px;
    cursor: pointer; flex-shrink: 0;
  }

  .mirror-frame {
    position: absolute; inset: 0; border-radius: 50%;
    background: radial-gradient(circle, #2a1f0e, #1a1008);
    border: 6px solid #c9a96e;
    box-shadow: 0 0 0 2px #8a6f35, 0 0 30px rgba(201,169,110,0.3), inset 0 0 20px rgba(0,0,0,0.5);
  }

  .mirror-glass {
    position: absolute; inset: 18px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #1e1e2e, #0a0a14);
    overflow: hidden;
    display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px;
  }

  .mirror-glass img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

  .mirror-prompt-text {
    font-family: 'Playfair Display', serif; font-style: italic; font-size: 1rem;
    color: rgba(201,169,110,0.8); animation: shimmer 3s ease-in-out infinite;
    text-align: center; padding: 0 12px;
  }

  .mirror-prompt-sub { font-size: 0.6rem; letter-spacing: 3px; text-transform: uppercase; color: rgba(201,169,110,0.4); }

  @keyframes shimmer { 0%,100%{opacity:0.6} 50%{opacity:1} }

  .bulb {
    position: absolute; width: 16px; height: 16px; border-radius: 50%;
    background: radial-gradient(circle, #fff9e6, #ffb347);
    box-shadow: 0 0 10px 3px rgba(255,179,71,0.7), 0 0 20px 6px rgba(255,179,71,0.3);
    animation: bulbPulse 2s ease-in-out infinite;
  }

  @keyframes bulbPulse {
    0%,100% { box-shadow: 0 0 10px 3px rgba(255,179,71,0.7), 0 0 20px 6px rgba(255,179,71,0.3); }
    50% { box-shadow: 0 0 16px 6px rgba(255,179,71,0.9), 0 0 30px 10px rgba(255,179,71,0.5); }
  }

  .vanity-table {
    width: 100%; max-width: 700px;
    background: linear-gradient(180deg, #1a1008, #0f0a04);
    border-top: 2px solid #c9a96e; height: 48px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; margin-top: -6px;
  }

  .reveal-btn {
    background: linear-gradient(135deg, #e2001a, #a50014);
    color: white; border: none; padding: 10px 28px;
    font-family: 'Playfair Display', serif; font-style: italic;
    font-size: 0.9rem; letter-spacing: 2px; border-radius: 30px; cursor: pointer;
    box-shadow: 0 4px 20px rgba(226,0,26,0.4); transition: all 0.3s ease;
    animation: fadeIn 0.5s ease forwards;
  }

  .reveal-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(226,0,26,0.6); }
  .reveal-btn:disabled { opacity:0.6; cursor:wait; }

  .loading-text {
    font-family: 'Playfair Display', serif; font-style: italic;
    color: #c9a96e; font-size: 0.95rem; animation: shimmer 1.5s ease-in-out infinite;
  }

  .error-text { color: #e2001a; font-size: 0.75rem; text-align: center; max-width: 360px; }

  .results-panel {
    width: 100%; max-width: 900px;
    display: grid; grid-template-columns: 200px 1fr; gap: 16px;
    opacity: 0; transform: translateY(16px); transition: all 0.7s ease;
  }

  .results-panel.show { opacity:1; transform:translateY(0); }

  .season-card {
    background: linear-gradient(160deg, #12101a, #0d0b14);
    border: 1px solid rgba(201,169,110,0.3); border-radius: 12px;
    padding: 16px; display: flex; flex-direction: column; gap: 8px; align-self: start;
  }

  .season-eyebrow { font-size: 0.55rem; letter-spacing: 4px; text-transform: uppercase; color: #c9a96e; }

  .season-name {
    font-family: 'Playfair Display', serif; font-style: italic;
    font-size: 1.6rem; color: #f5f0e8; line-height: 1.1;
  }

  .season-divider { display: flex; align-items: center; gap: 8px; }
  .sdl { height:1px; flex:1; background:linear-gradient(90deg,transparent,#c9a96e); }
  .sdl.r { background:linear-gradient(90deg,#c9a96e,transparent); }
  .sd-diamond { color:#c9a96e; font-size:10px; }

  .season-pills { display: flex; flex-direction: column; gap: 4px; }

  .season-pill {
    border: 1px solid rgba(226,0,26,0.4); color: #f5f0e8;
    padding: 3px 10px; border-radius: 20px; font-size: 0.65rem;
    letter-spacing: 1px; text-transform: capitalize; background: rgba(226,0,26,0.06);
  }

  .season-desc { font-weight: 300; color: rgba(201,169,110,0.7); font-size: 0.72rem; line-height: 1.6; }

  .try-again {
    background: transparent; border: 1px solid rgba(201,169,110,0.3); color: #c9a96e;
    padding: 6px 16px; font-size: 0.6rem; letter-spacing: 2px; text-transform: uppercase;
    border-radius: 20px; cursor: pointer; transition: all 0.3s; margin-top: 4px; align-self: flex-start;
  }

  .try-again:hover { background:rgba(201,169,110,0.08); }

  .upload-mode-btns {
    display: flex; gap: 8px; justify-content: center; margin-bottom: 4px;
  }

  .mode-btn {
    background: transparent;
    border: 1px solid rgba(201,169,110,0.3);
    color: rgba(201,169,110,0.7);
    padding: 5px 14px; font-size: 0.6rem; letter-spacing: 2px;
    text-transform: uppercase; border-radius: 20px; cursor: pointer;
    transition: all 0.3s; font-family: 'Raleway', sans-serif;
  }

  .mode-btn.active {
    background: rgba(201,169,110,0.15);
    border-color: #c9a96e; color: #c9a96e;
  }

  .mode-btn:hover { border-color: #c9a96e; color: #c9a96e; }

  .product-link {
    text-decoration: none;
    display: block;
    width: 100%;
  }

  .product-tag-linked {
    cursor: pointer;
    transition: all 0.2s;
  }

  .product-tag-linked:hover {
    background: #fff8ee;
    border-color: #e2001a;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(226,0,26,0.15);
  }

  .ptag-shop {
    font-size: 0.48rem; letter-spacing: 1.5px; text-transform: uppercase;
    color: #e2001a; margin-top: 3px; opacity: 0.8;
  }

  .bag-outer {
    background: linear-gradient(180deg, #f0e8d8, #e8dcc8);
    border-radius: 16px 16px 14px 14px; border: 2px solid #c9a96e;
    box-shadow: 0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3); overflow: hidden;
  }

  .bag-zipper {
    height: 14px; background: linear-gradient(180deg, #b8922a, #c9a96e, #b8922a);
    display: flex; align-items: center; justify-content: center; position: relative;
  }

  .bag-zipper::after {
    content:''; position:absolute; width:18px; height:18px;
    background: radial-gradient(circle, #e8c87a, #b8922a);
    border-radius:50%; border:2px solid #8a6f35; box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  }

  .bag-interior { padding: 14px; }
  .bag-label { text-align:center; font-size:0.55rem; letter-spacing:4px; text-transform:uppercase; color:#8a6f35; margin-bottom:10px; }

  .products-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }

  .product-slot {
    display:flex; flex-direction:column; align-items:center; gap:8px;
    opacity:0; transform:translateY(20px); transition: all 0.5s ease;
  }

  .product-slot.show { opacity:1; transform:translateY(0); }

  .product-tag {
    background:#faf4e8; border:1px solid #c9a96e; border-radius:4px;
    padding:5px 8px; text-align:center; width:100%;
    box-shadow:0 2px 6px rgba(0,0,0,0.12); position:relative;
  }

  .product-tag::before {
    content:''; position:absolute; top:-6px; left:50%; transform:translateX(-50%);
    width:1px; height:6px; background:#c9a96e;
  }

  .ptag-cat { font-size:0.5rem; letter-spacing:2px; text-transform:uppercase; color:#e2001a; margin-bottom:2px; }
  .ptag-name { font-family:'Playfair Display',serif; font-size:0.62rem; color:#2a1f0e; line-height:1.3; }
  .ptag-shade { font-size:0.55rem; color:#8a6f35; margin-top:2px; }

  .bag-trim { height:14px; background:linear-gradient(180deg,#b8922a,#8a6f35); display:flex; align-items:center; justify-content:center; }
  .bag-clasp { width:40px; height:12px; background:linear-gradient(180deg,#e8c87a,#b8922a); border-radius:3px; border:1px solid #8a6f35; display:flex; align-items:center; justify-content:center; }
  .bag-clasp span { font-size:0.35rem; letter-spacing:2px; text-transform:uppercase; color:#2a1f0e; }

  .footer-text { font-family:'Playfair Display',serif; font-style:italic; color:#c9a96e; font-size:0.8rem; text-align:center; letter-spacing:2px; padding-bottom:8px; }

  @keyframes fadeIn { to { opacity:1; } }
`;

const BULB_POSITIONS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * 30 - 90) * (Math.PI / 180);
  const r = 50;
  return {
    left: `calc(50% + ${r * Math.cos(angle)}% - 8px)`,
    top: `calc(50% + ${r * Math.sin(angle)}% - 8px)`,
    animationDelay: `${i * 0.17}s`,
  };
});

function LipstickSVG({ color = '#9c4d3c' }) {
  return (
    <svg width="44" height="80" viewBox="0 0 44 80">
      <rect x="13" y="48" width="18" height="30" rx="3" fill="#2a1f0e" />
      <rect x="15" y="50" width="14" height="26" rx="2" fill="#3a2f1e" />
      <rect x="11" y="44" width="22" height="6" rx="2" fill="#c9a96e" />
      <rect x="15" y="14" width="14" height="32" rx="2" fill={color} />
      <path d="M15 14 Q22 2 29 14" fill={color} />
      <rect x="18" y="18" width="3" height="16" rx="1.5" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

function FoundationSVG({ color = '#c9a97a' }) {
  return (
    <svg width="52" height="80" viewBox="0 0 52 80">
      <rect x="14" y="22" width="24" height="54" rx="5" fill="#f0f0f0" />
      <rect x="16" y="24" width="20" height="50" rx="4" fill="#e8e8e8" />
      <rect x="18" y="40" width="16" height="22" rx="2" fill={color} />
      <rect x="21" y="6" width="10" height="18" rx="3" fill="#d0d0d0" />
      <rect x="17" y="4" width="18" height="5" rx="2.5" fill="#b0b0b0" />
      <rect x="17" y="25" width="18" height="13" rx="1.5" fill="white" opacity="0.9" />
      <text x="26" y="31" textAnchor="middle" fontSize="3.5" fill="#2a1f0e" fontFamily="Raleway">L'ORÉAL</text>
      <text x="26" y="35" textAnchor="middle" fontSize="3" fill="#2a1f0e" fontFamily="Raleway">True Match</text>
      <rect x="32" y="26" width="2" height="44" rx="1" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}

function EyeshadowSVG({ color = '#8a5635' }) {
  const pans = ['#d4a882','#c9956a','#b87850','#a06038','#8a5635',color,'#6a3820','#4a2010','#e8c8a0','#d4a870','#b88850','#8a6030'];
  return (
    <svg width="90" height="64" viewBox="0 0 90 64">
      <rect x="2" y="2" width="86" height="60" rx="5" fill="#1a1008" />
      <rect x="4" y="4" width="82" height="56" rx="4" fill="#2a1f0e" />
      {pans.map((c, i) => (
        <rect key={i} x={7+(i%4)*19} y={7+Math.floor(i/4)*19} width="16" height="16" rx="2.5" fill={c}
          stroke={c===color?'#c9a96e':'transparent'} strokeWidth="1.5" />
      ))}
      <rect x="7" y="46" width="76" height="10" rx="2" fill="#c0c8d0" opacity="0.5" />
      <text x="45" y="53" textAnchor="middle" fontSize="4" fill="rgba(201,169,110,0.7)" fontFamily="Raleway">L'ORÉAL PARIS</text>
    </svg>
  );
}

function BlushSVG({ color = '#d4857a' }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r="34" fill="#2a1f0e" />
      <circle cx="36" cy="36" r="32" fill="#3a2f1e" />
      <circle cx="36" cy="36" r="32" fill="none" stroke="#c9a96e" strokeWidth="2.5" />
      <circle cx="36" cy="36" r="25" fill={color} />
      <ellipse cx="29" cy="29" rx="7" ry="4" fill="rgba(255,255,255,0.18)" transform="rotate(-30 29 29)" />
      <text x="36" y="39" textAnchor="middle" fontSize="4.5" fill="rgba(255,255,255,0.45)" fontFamily="Raleway">L'ORÉAL</text>
    </svg>
  );
}

const SEASONS_DESC = {
  'True Spring': 'Warm, radiant, clear — fresh and sunlit colours are your signature.',
  'Light Spring': 'Warm and delicate — soft golden tones and airy brights flatter you.',
  'Bright Spring': 'High clarity, warm-neutral — vivid, crisp shades bring you to life.',
  'True Summer': 'Cool and soft — refined, powdery shades harmonise beautifully.',
  'Light Summer': 'Cool and light — fresh rosy pastels and misty tones suit you best.',
  'Soft Summer': 'Cool-neutral, muted — elegant smoky colours create polish.',
  'True Autumn': 'Warm, rich, earthy — grounded tones feel naturally luxurious.',
  'Deep Autumn': 'Warm and deep — intense earthy shades and burnished warmth.',
  'Soft Autumn': 'Warm-neutral, very muted — subtle golden-earth tones create harmony.',
  'True Winter': 'Cool, clear, high contrast — jewel-like colours are your signature.',
  'Deep Winter': 'Cool and deep — dramatic shades and polished neutrals flatter best.',
  'Bright Winter': 'Cool-neutral, vivid — high-impact brilliant tones are your strength.',
};

const PROMPT = `You are a professional makeup artist and certified seasonal colour analyst. Analyse this person's face: skin tone, undertone (warm/cool/neutral), eye colour, hair colour, and contrast level.

IMPORTANT: Assess hue, value, and chroma INDEPENDENTLY. Do not default deeper skin tones to Autumn.

Assign one of: True Spring, Light Spring, Bright Spring, True Summer, Light Summer, Soft Summer, True Autumn, Deep Autumn, Soft Autumn, True Winter, Deep Winter, Bright Winter.

Then recommend specific L'ORÉAL PARIS products using ONLY these real product lines:
FOUNDATION: True Match Super-Blendable Foundation OR Infallible 24H Fresh Wear Foundation
LIP: Colour Riche Original Satin Lipstick OR Rouge Signature OR Infallible Pro Matte Liquid Lipstick
EYESHADOW: La Palette Nude Eye Shadow OR Colour Riche Eye Shadow Quads
BLUSH: True Match Blush OR Infallible Up to 24H Soft Matte Bronzer

Return ONLY valid JSON, no markdown:
{
  "season": "season name",
  "hue": "warm/cool/neutral",
  "value": "light/medium/deep",
  "chroma": "clear/soft/muted",
  "foundation": {"product": "exact product name", "shade": "exact shade name", "hex": "#xxxxxx", "reason": "one sentence"},
  "lip": {"product": "exact product name", "shade": "exact shade name", "hex": "#xxxxxx", "reason": "one sentence"},
  "eyeshadow": {"product": "exact product name", "shade": "exact shade name", "hex": "#xxxxxx", "reason": "one sentence"},
  "blush": {"product": "exact product name", "shade": "exact shade name", "hex": "#xxxxxx", "reason": "one sentence"}
}`;

export default function App() {
  const [scene, setScene] = useState('title');
  const [titleExiting, setTitleExiting] = useState(false);
  const [appVisible, setAppVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageType, setImageType] = useState('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [productsVisible, setProductsVisible] = useState([false,false,false,false]);
  const [error, setError] = useState(null);
  const [uploadMode, setUploadMode] = useState('gallery'); // gallery | camera
  const fileRef = useRef();
  const cameraRef = useRef();

  const PRODUCT_URLS = {
    'True Match Super-Blendable Foundation': 'https://www.lorealparisusa.com/makeup/face/foundation/true-match-super-blendable-foundation',
    'Infallible 24H Fresh Wear Foundation': 'https://www.lorealparisusa.com/makeup/face/foundation/infallible-24h-fresh-wear-foundation',
    'Colour Riche Original Satin Lipstick': 'https://www.lorealparisusa.com/makeup/lips/lipstick/colour-riche-original-satin-lipstick',
    'Rouge Signature': 'https://www.lorealparisusa.com/makeup/lips/lipstick/rouge-signature-lightweight-matte-lip-color',
    'Infallible Pro Matte Liquid Lipstick': 'https://www.lorealparisusa.com/makeup/lips/lipstick/infallible-pro-matte-lip-color',
    'La Palette Nude Eye Shadow': 'https://www.lorealparisusa.com/makeup/eyes/eyeshadow/la-palette-nude',
    'Colour Riche Eye Shadow Quads': 'https://www.lorealparisusa.com/makeup/eyes/eyeshadow/colour-riche-eye-shadow',
    'True Match Blush': 'https://www.lorealparisusa.com/makeup/face/blush/true-match-blush',
    'Infallible Up to 24H Soft Matte Bronzer': 'https://www.lorealparisusa.com/makeup/face/bronzer/infallible-up-to-24h-fresh-wear-soft-matte-bronzer',
  };

  const getProductUrl = (productName) => {
    if (!productName) return 'https://www.lorealparisusa.com/makeup';
    const key = Object.keys(PRODUCT_URLS).find(k => productName.includes(k) || k.includes(productName));
    return key ? PRODUCT_URLS[key] : 'https://www.lorealparisusa.com/makeup';
  };

  useEffect(() => {
    if (scene !== 'title') return;
    const t = setTimeout(() => {
      setTitleExiting(true);
      setTimeout(() => {
        setScene('app');
        setTimeout(() => setAppVisible(true), 100);
      }, 800);
    }, 3200);
    return () => clearTimeout(t);
  }, [scene]);

  useEffect(() => {
    if (!resultsVisible) return;
    [0,1,2,3].forEach(i => setTimeout(() => {
      setProductsVisible(prev => { const n=[...prev]; n[i]=true; return n; });
    }, 300 + i * 250));
  }, [resultsVisible]);

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageType(file.type);
    const reader = new FileReader();
    reader.onload = e => {
      setImage(e.target.result);
      setImageBase64(e.target.result.split(',')[1]);
      setError(null); setResults(null);
      setResultsVisible(false); setProductsVisible([false,false,false,false]);
    };
    reader.readAsDataURL(file);
  }, []);

  const analyse = async () => {
    if (!imageBase64) return;
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) { setError('Missing VITE_GEMINI_API_KEY in .env'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [
              { inline_data: { mime_type: imageType, data: imageBase64 } },
              { text: PROMPT }
            ]}]
          })
        }
      );
      if (!res.ok) throw new Error(`Gemini error (${res.status}): ${await res.text()}`);
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsed = JSON.parse(text.replace(/```json|```/g,'').trim());
      setResults(parsed);
      setTimeout(() => setResultsVisible(true), 100);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const reset = () => {
    setImage(null); setImageBase64(null); setResults(null);
    setResultsVisible(false); setProductsVisible([false,false,false,false]); setError(null);
  };

  const TITLE = 'Colour Analysis';

  return (
    <>
      <style>{STYLE}</style>

      {scene === 'title' && (
        <div className={`scene-title ${titleExiting ? 'scene-exit' : ''}`}>
          {Array.from({length:16}).map((_,i)=>(
            <div key={i} className="sparkle" style={{
              left:`${10+Math.random()*80}%`, top:`${20+Math.random()*60}%`,
              width:`${2+Math.random()*4}px`, height:`${2+Math.random()*4}px`,
              animationDuration:`${2+Math.random()*3}s`, animationDelay:`${Math.random()*2}s`
            }}/>
          ))}
          <div>
            <div className="title-text">
              {TITLE.split('').map((ch,i)=>(
                <span key={i} className="title-char" style={{animationDelay:`${i*0.08}s`, marginRight:ch===' '?'0.3em':'0'}}>
                  {ch===' '?'\u00A0':ch}
                </span>
              ))}
            </div>
            <div className="title-sub">L'Oréal Paris · AI Shade Match</div>
          </div>
        </div>
      )}

      {scene === 'app' && (
        <div className={`app-shell ${appVisible?'visible':''}`}>
          <div className="wall-art-row">
            <div className="art-frame"><span className="art-frame-text">◆</span></div>
            <div className="art-frame centre"><span className="art-frame-text">L'Oréal</span></div>
            <div className="art-frame"><span className="art-frame-text">◆</span></div>
          </div>

          <div className="upload-mode-btns">
            <button className={`mode-btn ${uploadMode==='gallery'?'active':''}`} onClick={()=>setUploadMode('gallery')}>📁 Gallery</button>
            <button className={`mode-btn ${uploadMode==='camera'?'active':''}`} onClick={()=>setUploadMode('camera')}>📷 Camera</button>
          </div>

          <div className="mirror-wrap" onClick={()=>!image&&(uploadMode==='camera'?cameraRef.current.click():fileRef.current.click())} title="Click to upload">
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}}
              onChange={e=>processFile(e.target.files[0])} />
            <input ref={cameraRef} type="file" accept="image/*" capture="user" style={{display:'none'}}
              onChange={e=>processFile(e.target.files[0])} />
            <div className="mirror-frame"/>
            {BULB_POSITIONS.map((pos,i)=>(
              <div key={i} className="bulb" style={{...pos, animationDelay:pos.animationDelay}}/>
            ))}
            <div className="mirror-glass">
              {image ? (
                <img src={image} alt="You" onClick={e=>{e.stopPropagation();fileRef.current.click();}} style={{cursor:'pointer'}}/>
              ) : (
                <div style={{textAlign:'center',pointerEvents:'none'}}>
                  <div className="mirror-prompt-text">Show us your light</div>
                  <div className="mirror-prompt-sub">click to upload</div>
                </div>
              )}
            </div>
          </div>

          <div className="vanity-table">
            <PerfumeSVG/><PerfumeSVG/>
          </div>

          {image && !loading && !results && (
            <button className="reveal-btn" onClick={analyse}>✦ Reveal My Season ✦</button>
          )}
          {loading && <div className="loading-text">Reading your light…</div>}
          {error && <div className="error-text">{error}</div>}

          {results && (
            <div className={`results-panel ${resultsVisible?'show':''}`}>
              <div className="season-card">
                <div className="season-eyebrow">Your Season</div>
                <div className="season-name">{results.season}</div>
                <div className="season-divider">
                  <div className="sdl"/><div className="sd-diamond">◆</div><div className="sdl r"/>
                </div>
                <div className="season-pills">
                  <span className="season-pill">Hue: {results.hue}</span>
                  <span className="season-pill">Value: {results.value}</span>
                  <span className="season-pill">Chroma: {results.chroma}</span>
                </div>
                <div className="season-desc">{SEASONS_DESC[results.season]||'A beautifully unique season.'}</div>
                <button className="try-again" onClick={reset}>Try Again</button>
              </div>

              <div>
                <div className="bag-outer">
                  <div className="bag-zipper"/>
                  <div className="bag-interior">
                    <div className="bag-label">L'Oréal Paris · Your Seasonal Edit</div>
                    <div className="products-grid">
                      {[
                        {key:'foundation', label:'Foundation', svg:<FoundationSVG color={results.foundation?.hex}/>},
                        {key:'lip', label:'Lip', svg:<LipstickSVG color={results.lip?.hex}/>},
                        {key:'eyeshadow', label:'Eye Shadow', svg:<EyeshadowSVG color={results.eyeshadow?.hex}/>},
                        {key:'blush', label:'Blush', svg:<BlushSVG color={results.blush?.hex}/>},
                      ].map(({key,label,svg},i)=>(
                        <div key={key} className={`product-slot ${productsVisible[i]?'show':''}`} style={{transitionDelay:`${i*0.12}s`}}>
                          {svg}
                          <a
                            className="product-link"
                            href={getProductUrl(results[key]?.product)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e=>e.stopPropagation()}
                          >
                            <div className="product-tag product-tag-linked">
                              <div className="ptag-cat">{label}</div>
                              <div className="ptag-name">{results[key]?.product}</div>
                              <div className="ptag-shade">{results[key]?.shade}</div>
                              <div className="ptag-shop">Shop now →</div>
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bag-trim"><div className="bag-clasp"><span>L'ORÉAL</span></div></div>
                </div>
                <div className="footer-text">"Because You're Worth It"</div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function PerfumeSVG() {
  return (
    <svg width="24" height="44" viewBox="0 0 24 44">
      <rect x="8" y="1" width="8" height="5" rx="1.5" fill="#c9a96e"/>
      <rect x="4" y="6" width="16" height="36" rx="5" fill="rgba(201,169,110,0.18)" stroke="#c9a96e" strokeWidth="0.8"/>
      <rect x="6" y="8" width="5" height="24" rx="2.5" fill="rgba(255,255,255,0.08)"/>
    </svg>
  );
}

