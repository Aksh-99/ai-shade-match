import React, { useEffect, useMemo, useRef, useState } from 'react';

const seasonProfiles = {
  'True Spring': { family: 'spring', description: 'Warm, radiant, and naturally clear — your best colours are fresh and sunlit.' },
  'Light Spring': { family: 'spring', description: 'Warm and delicate with lightness — soft golden tones and airy brights flatter you.' },
  'Bright Spring': { family: 'spring', description: 'High clarity with warm-neutral influence — vivid, crisp shades bring you to life.' },
  'True Summer': { family: 'summer', description: 'Cool and balanced with softness — refined, powdery shades harmonise beautifully.' },
  'Light Summer': { family: 'summer', description: 'Cool and light with gentle chroma — fresh rosy pastels and misty tones suit you best.' },
  'Soft Summer': { family: 'summer', description: 'Cool-neutral and muted — elegant, smoky colours create your most polished look.' },
  'True Autumn': { family: 'autumn', description: 'Warm, rich, and earthy — grounded tones with depth feel naturally luxurious.' },
  'Deep Autumn': { family: 'autumn', description: 'Warm with deep value — intense earthy shades and burnished warmth are ideal.' },
  'Soft Autumn': { family: 'autumn', description: 'Warm-neutral and very muted — subtle golden-earth tones create harmony.' },
  'True Winter': { family: 'winter', description: 'Cool and clear with striking contrast — crisp, jewel-like colours are your signature.' },
  'Deep Winter': { family: 'winter', description: 'Cool with deep value — dramatic shades and polished neutrals flatter best.' },
  'Bright Winter': { family: 'winter', description: 'Cool-neutral with very clear chroma — high-impact, brilliant tones are your strength.' },
};

const hardcodedShadeMap = {
  spring: {
    foundation: {
      product: 'True Match Super-Blendable Foundation',
      shades: [
        { shade: 'W2 Light Ivory', hex: '#E1BE9D', value: 'light' },
        { shade: 'W4 Natural Beige', hex: '#C99670', value: 'medium' },
        { shade: 'W8 Cappuccino', hex: '#8A5A3B', value: 'deep' },
      ],
      reason: 'Yellow-beige warmth complements spring undertones, with options spanning light to deep complexions.',
    },
    lip: {
      product: 'Colour Riche Original Satin Lipstick',
      shade: 'Peach Fuzz',
      hex: '#E98A73',
      reason: 'Peachy coral warmth aligns with spring clarity and enhances natural vibrancy.',
    },
    eyeshadow: {
      product: 'Colour Riche Eye Shadow Quads',
      shade: 'Bronzed Coral',
      hex: '#B9734F',
      reason: 'Bronze-toned shimmer echoes the warm, clear spring colour direction.',
    },
    blush: {
      product: 'True Match Blush',
      shade: 'Golden Apricot',
      hex: '#D98667',
      reason: 'Golden-apricot blush adds a healthy, warm lift that reads fresh and polished.',
    },
  },
  summer: {
    foundation: {
      product: 'True Match Super-Blendable Foundation',
      shades: [
        { shade: 'C2 Creamy Natural', hex: '#E3C0A8', value: 'light' },
        { shade: 'C5 Shell Beige', hex: '#B78666', value: 'medium' },
        { shade: 'C8 Cool Espresso', hex: '#5D3B2B', value: 'deep' },
      ],
      reason: 'Pink-beige to cool-neutral undertones support summer harmony across the full value range.',
    },
    lip: {
      product: 'Rouge Signature Lightweight Matte Lip Color',
      shade: 'I Rule',
      hex: '#A65A73',
      reason: 'Soft rose-mauve harmonises with summer softness without overpowering natural colouring.',
    },
    eyeshadow: {
      product: 'La Palette Nude Eye Shadow',
      shade: 'Taupe Edit',
      hex: '#8A7A74',
      reason: 'Cool taupe depth enhances eyes in a refined, low-contrast summer-friendly way.',
    },
    blush: {
      product: 'True Match Blush',
      shade: 'Cool Pink Veil',
      hex: '#C87D92',
      reason: 'A cool pink veil mirrors summer’s rosy undertone and soft chroma.',
    },
  },
  autumn: {
    foundation: {
      product: 'Infallible 24H Fresh Wear Foundation',
      shades: [
        { shade: '140 Golden Beige', hex: '#D8AF8D', value: 'light' },
        { shade: '360 Golden Amber', hex: '#A87452', value: 'medium' },
        { shade: '380 Sienna', hex: '#7E543C', value: 'deep' },
      ],
      reason: 'Golden-warm base shades support autumn warmth from lighter tones through rich deep tones.',
    },
    lip: {
      product: 'Infallible Pro Matte Liquid Lipstick',
      shade: 'Terracotta Crush',
      hex: '#9C4D3C',
      reason: 'Terracotta warmth and earthy richness suit autumn’s muted depth beautifully.',
    },
    eyeshadow: {
      product: 'La Palette Nude Eye Shadow',
      shade: 'Copper Earth',
      hex: '#8A5635',
      reason: 'Earthy copper tones reinforce autumn harmony and natural warmth around the eyes.',
    },
    blush: {
      product: 'Infallible Up to 24H Fresh Wear Soft Matte Bronzer',
      shade: 'Warm Cinnamon',
      hex: '#A96D4B',
      reason: 'A bronzed matte warmth sculpts softly while staying true to autumn colour language.',
    },
  },
  winter: {
    foundation: {
      product: 'True Match Super-Blendable Foundation',
      shades: [
        { shade: 'N2 Classic Ivory', hex: '#E3BEA0', value: 'light' },
        { shade: 'N6 Honey Beige', hex: '#A4765A', value: 'medium' },
        { shade: 'N9 Deep Ebony', hex: '#4A3126', value: 'deep' },
      ],
      reason: 'Neutral-cool balance keeps winter clarity sharp, including deeper shades for high-contrast complexions.',
    },
    lip: {
      product: 'Colour Riche Original Satin Lipstick',
      shade: 'Blue Red Icon',
      hex: '#A0172B',
      reason: 'A true cool red provides high-impact clarity that complements winter intensity.',
    },
    eyeshadow: {
      product: 'Colour Riche Eye Shadow Quads',
      shade: 'Smoky Noir',
      hex: '#4F4952',
      reason: 'Smoky cool depth adds definition without introducing warmth, ideal for winter palettes.',
    },
    blush: {
      product: 'True Match Blush',
      shade: 'Berry Sculpt',
      hex: '#95506A',
      reason: 'Cool berry blush mirrors winter undertones and supports clean contrast.',
    },
  },
};

const seasonReference = `The 12 seasons and characteristics:\n- True Spring: warm hue, medium value, clear chroma\n- Light Spring: warm hue, light value, clear chroma\n- Bright Spring: warm-neutral hue, medium value, very clear chroma\n- True Summer: cool hue, medium value, soft chroma\n- Light Summer: cool hue, light value, soft chroma\n- Soft Summer: cool-neutral hue, medium value, very soft chroma\n- True Autumn: warm hue, medium value, muted chroma\n- Deep Autumn: warm hue, deep value, muted chroma\n- Soft Autumn: warm-neutral hue, medium value, very muted chroma\n- True Winter: cool hue, medium value, clear chroma\n- Deep Winter: cool hue, deep value, clear chroma\n- Bright Winter: cool-neutral hue, medium value, very clear chroma`;

function stripMarkdownFences(text) {
  return text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function analyzeSelfie(file) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY. Add it to your environment before analysing.');
  }

  const base64 = await fileToBase64(file);

  const prompt = `You are a professional seasonal colour analyst using Munsell colour theory.

${seasonReference}

Task:
1) Assess visible colouring and infer hue, value, and chroma independently:
   - Hue: warm/cool/neutral (or warm-neutral/cool-neutral when appropriate)
   - Value: light/medium/deep
   - Chroma: very clear/clear/soft/very soft/muted/very muted
   Important inclusivity rules:
   - Deep skin tones can be warm OR cool and bright OR muted; do not tie depth to one season family.
   - Never default deeper skin tones to Autumn; Deep Winter and deep spring-like palettes are equally valid depending on undertone/chroma.
   - Melanin-rich skin can have cool, neutral, or warm undertones.
   - Evaluate undertone cues (veins, inner wrist, and colour cast in natural light) instead of surface colour alone.
   - The same undertone family appears across different values (for example, Light Summer and Deep Winter are both cool but different in value/chroma).
   - Do not infer ethnicity; focus only on visible colour characteristics.
2) Assign exactly one of the 12 seasons above with a brief confidence explanation.
3) Use these examples as non-binding guidance (not rules):
   - Fair: Light Spring, Light Summer, True Winter, Bright Winter
   - Medium: True Spring, True Summer, True Autumn, True Winter
   - Olive: Soft Autumn, True Autumn, True Winter, Deep Winter
   - Deep/Rich: Deep Autumn, Deep Winter, Soft Autumn, Bright Winter
4) Return ONLY valid JSON matching this schema exactly:
{
  "season": {
    "name": "<one of the 12 seasons>",
    "hue": "warm|cool|warm-neutral|cool-neutral|neutral",
    "value": "light|medium|deep",
    "chroma": "very clear|clear|soft|very soft|muted|very muted",
    "description": "<include confidence explanation in one concise paragraph>"
  },
  "foundation": {"product": "", "shade": "", "hex": "", "reason": ""},
  "lip": {"product": "", "shade": "", "hex": "", "reason": ""},
  "eyeshadow": {"product": "", "shade": "", "hex": "", "reason": ""},
  "blush": {"product": "", "shade": "", "hex": "", "reason": ""}
}

Use the provided image only. Do not include markdown, comments, or extra text.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: file.type || 'image/jpeg',
              data: base64,
            },
          },
          {
            text: prompt,
          },
        ],
      }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API request failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error('No model content returned from API.');
  }

  const clean = stripMarkdownFences(content);
  let parsed;
  try {
    parsed = JSON.parse(clean);
  } catch (error) {
    throw new Error(`Failed to parse model JSON response. Raw output: ${clean}`);
  }

  return parsed;
}

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [introDone, setIntroDone] = useState(false);
  const inputRef = useRef(null);
  const scene2Ref = useRef(null);
  const scene3Ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroDone(true);
      scene2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const products = useMemo(() => {
    if (!result?.season?.name) return null;
    const family = seasonProfiles[result.season.name]?.family;
    if (!family) return null;

    const familyProducts = hardcodedShadeMap[family];
    const foundationShades = familyProducts.foundation.shades;
    const selectedValue = result?.season?.value;
    const chosenShade =
      foundationShades.find((item) => item.value === selectedValue)
      || foundationShades.find((item) => item.value === 'medium')
      || foundationShades[0];

    return {
      ...familyProducts,
      foundation: {
        product: familyProducts.foundation.product,
        shade: chosenShade.shade,
        hex: chosenShade.hex,
        reason: `${familyProducts.foundation.reason} Selected for ${selectedValue || 'medium'} value colouring.`,
      },
    };
  }, [result]);

  const onFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError('');
  };

  const handleInputChange = (event) => {
    onFileSelect(event.target.files?.[0]);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please upload a selfie before running analysis.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const aiResult = await analyzeSelfie(selectedFile);
      const seasonName = aiResult?.season?.name;
      const profile = seasonProfiles[seasonName];

      if (!profile) {
        throw new Error('Model returned an unknown season. Please try another photo.');
      }

      setResult({
        season: {
          ...aiResult.season,
          description: aiResult.season.description || profile.description,
        },
      });
      setTimeout(() => {
        scene3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 350);
    } catch (err) {
      setError(err.message || 'Something went wrong while analysing your photo.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setResult(null);
    setError('');
    setLoading(false);
    scene2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className={`cinematic-app ${introDone ? 'intro-done' : ''}`}>
      <section className="scene scene-title">
        <div className="sparkles" aria-hidden="true">
          {Array.from({ length: 30 }).map((_, idx) => (
            <span key={`sparkle-${idx}`} style={{ '--i': idx }} />
          ))}
        </div>
        <h1>Colour Analysis</h1>
      </section>

      <section className="scene scene-vanity" ref={scene2Ref}>
        <div className="wall-art" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="vanity-mirror-shell">
          <div className="vanity-bulbs" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, idx) => (
              <span key={`bulb-${idx}`} style={{ '--bulb': idx }} />
            ))}
          </div>

          <button className="vanity-mirror" onClick={() => inputRef.current?.click()} type="button">
            {!previewUrl && <p className="mirror-copy">Show us your light</p>}
            {previewUrl && <img src={previewUrl} alt="Selfie preview" className="mirror-photo" />}
            {result?.season?.name && <p className="mirror-season">{result.season.name}</p>}
          </button>

          <input ref={inputRef} id="selfie-input" type="file" accept="image/*" onChange={handleInputChange} hidden />

          <div className="perfume perfume-left" aria-hidden="true" />
          <div className="perfume perfume-right" aria-hidden="true" />
        </div>

        <div className="vanity-table" aria-hidden="true">
          <div className="drawer" />
          <div className="drawer" />
          <div className="drawer" />
        </div>
        <div className="velvet-stool" aria-hidden="true" />

        {previewUrl && (
          <button className="reveal-button" type="button" onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Revealing…' : 'Reveal My Season'}
          </button>
        )}

        {error && <p className="error-message">{error}</p>}
      </section>

      <section className="scene scene-bag" ref={scene3Ref}>
        <div className="bag-case">
          <div className="bag-lid">
            <div className="brush-holder" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className={`bag-base ${products ? 'ready' : ''}`}>
            <article className="product-block palette" style={{ '--shade': products?.eyeshadow?.hex || '#866455', '--delay': '0s' }}>
              <h3>Eyeshadow Palette</h3>
              <p>{products?.eyeshadow?.product || 'Awaiting analysis'}</p>
              <span>{products?.eyeshadow?.shade || '—'}</span>
            </article>

            <article className="product-block blush" style={{ '--shade': products?.blush?.hex || '#d29596', '--delay': '0.2s' }}>
              <h3>Blush Compact</h3>
              <p>{products?.blush?.product || 'Awaiting analysis'}</p>
              <span>{products?.blush?.shade || '—'}</span>
            </article>

            <article className="product-block lipstick" style={{ '--shade': products?.lip?.hex || '#aa4f5f', '--delay': '0.4s' }}>
              <h3>Lipstick</h3>
              <p>{products?.lip?.product || 'Awaiting analysis'}</p>
              <span>{products?.lip?.shade || '—'}</span>
            </article>

            <article className="product-block foundation" style={{ '--shade': products?.foundation?.hex || '#c9a27f', '--delay': '0.6s' }}>
              <h3>Foundation</h3>
              <p>{products?.foundation?.product || 'Awaiting analysis'}</p>
              <span>{products?.foundation?.shade || '—'}</span>
            </article>

            <aside className="season-card" style={{ '--delay': '0.8s' }}>
              <h2>{result?.season?.name || 'Your Season'}</h2>
              <div className="season-pills">
                <span>{result?.season?.hue || 'hue'}</span>
                <span>{result?.season?.value || 'value'}</span>
                <span>{result?.season?.chroma || 'chroma'}</span>
              </div>
              <p>{result?.season?.description || 'Upload a selfie and reveal your personalised seasonal profile.'}</p>
            </aside>
          </div>
        </div>

        <p className="worth-it">Because You’re Worth It</p>
        <button className="reset-button" type="button" onClick={resetAll}>Start Over</button>
      </section>
    </main>
  );
}

export default App;
