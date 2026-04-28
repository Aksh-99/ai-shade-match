import { useMemo, useState } from 'react';

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
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_OPENAI_API_KEY. Add it to your environment before analysing.');
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

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${file.type || 'image/jpeg'};base64,${base64}` },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API request failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
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

  const handleDrop = (event) => {
    event.preventDefault();
    onFileSelect(event.dataTransfer.files?.[0]);
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
  };

  return (
    <main className="app-shell">
      <section className="panel">
        <p className="eyebrow">L’Oréal Paris</p>
        <h1>L’Oréal AI Shade Match</h1>
        <p className="intro">
          Upload a selfie for AI-powered seasonal colour analysis and personalised L’Oréal Paris shade guidance.
        </p>

        {!result && (
          <>
            <div
              className="drop-zone"
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
              onClick={() => document.getElementById('selfie-input')?.click()}
            >
              <input id="selfie-input" type="file" accept="image/*" onChange={handleInputChange} hidden />
              <p>Drag & drop your selfie here</p>
              <span>or click to browse</span>
            </div>
            <p className="intro">Designed to work across all skin tones, ethnicities, and ages.</p>

            {previewUrl && <img className="preview" src={previewUrl} alt="Selected selfie preview" />}

            <button className="primary-btn" onClick={handleAnalyze} disabled={loading}>
              {loading ? 'Analysing...' : 'Analyse My Colour Season'}
            </button>
          </>
        )}

        {loading && <div className="spinner" aria-label="Analysing image" />}

        {error && <p className="error">{error}</p>}

        {result && products && (
          <section className="results">
            <div className="season-head">
              <h2>{result.season.name}</h2>
              <div className="pills">
                <span>{result.season.hue}</span>
                <span>{result.season.value}</span>
                <span>{result.season.chroma}</span>
              </div>
              <p>{result.season.description}</p>
            </div>

            <div className="cards">
              {Object.entries(products).map(([key, item]) => (
                <article className="card" key={key}>
                  <div className="swatch" style={{ backgroundColor: item.hex }} />
                  <h3>{key}</h3>
                  <p className="product">{item.product}</p>
                  <p className="shade">{item.shade}</p>
                  <p className="reason">{item.reason}</p>
                  <code>{item.hex}</code>
                </article>
              ))}
            </div>

            <button className="secondary-btn" onClick={resetAll}>Try Another Photo</button>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
