'use client';

import { useState, useEffect, useRef } from 'react';

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const GROQ_ENDPOINT = process.env.NEXT_PUBLIC_GROQ_ENDPOINT;

const hints = [
  'I skipped gym again',
  'I spent $200 on coffee this month',
  'I watched 10 hours of TikTok instead of working',
  'I called in sick to sleep in',
  'I ate cereal for dinner again',
  'I texted my ex at 2AM',
  "I bought something I don't need",
  'I cancelled plans last minute',
  "I didn't study for my exam",
  'I broke my diet again',
];

const tones = {
  savage: "Be savage and attack the user's decision. Keep it funny but sharp. Mock them with wit.",
  brutal:
    'Be brutally sarcastic and savage. Attack personally. Be extra harsh, cutting, and witty. Pull no punches.',
  dead: 'Go FULL savage with dark humor and absolutely zero mercy. Be the most brutally honest judge ever, tear them apart with dark wit.',
};

const POOP_EMOJIS = ['💩', '🤢', '💔', '😵', '🔥', '😤'];

function getEmoji(score) {
  if (score <= 20) return '💀';
  if (score <= 40) return '😡';
  if (score <= 60) return '😐';
  if (score <= 80) return '🙂';
  return '🤩';
}

function getScoreColor(score) {
  if (score <= 40) return '#f87171';
  if (score <= 70) return '#fbbf24';
  return '#4ade80';
}

function getResultBg(score) {
  if (score <= 40) return 'rgba(127,29,29,0.2)';
  if (score <= 70) return 'rgba(120,90,0,0.2)';
  return 'rgba(20,80,30,0.2)';
}

function parseResponse(text) {
  const jMatch = text.match(/Judgment:\s*(.+?)(?=Score:|$)/is);
  const sMatch = text.match(/Score:\s*(\d+)/);
  const judgment = jMatch ? jMatch[1].trim() : text.trim();
  const score = sMatch ? Math.min(Math.max(parseInt(sMatch[1]), 0), 100) : 50;
  return { judgment, score };
}

export default function Home() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('savage');
  const [loading, setLoading] = useState(false);
  const [judgment, setJudgment] = useState('');
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [particles, setParticles] = useState([]);
  const [splat, setSplat] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [hint, setHint] = useState('');

  // Set random hint on client side only to avoid hydration mismatch
  useEffect(() => {
    setHint(hints[Math.floor(Math.random() * hints.length)]);
  }, []);

  function triggerPoopExplosion() {
    setSplat(true);
    setTimeout(() => setSplat(false), 900);

    const newParticles = Array.from({ length: 28 }, (_, i) => ({
      id: Date.now() + i,
      left: 20 + Math.random() * 60,
      top: 20 + Math.random() * 60,
      tx: (Math.random() - 0.5) * 600,
      ty: (Math.random() - 0.3) * 600,
      rot: (Math.random() - 0.5) * 1440,
      dur: 0.8 + Math.random() * 1,
      delay: Math.random() * 0.3,
      emoji: POOP_EMOJIS[Math.floor(Math.random() * POOP_EMOJIS.length)],
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2500);

    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  }

  async function handleJudge() {
    if (!input.trim()) {
      triggerPoopExplosion();
      setError('Please enter a life choice first, you coward.');
      return;
    }

    setError('');
    setLoading(true);
    setJudgment('');
    setScore(null);

    const tone = tones[mode];
    const prompt = `You are a ruthlessly funny AI judge of poor life decisions. ${tone}

The user confessed: "${input}"

Give:
1. A short witty judgment (max 2 lines, punchy and devastating)
2. A score out of 100 (higher = better life choice)

Respond EXACTLY in this format, nothing else:
Judgment: [your judgment here]
Score: [number]`;

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 200,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const text = data.choices[0].message.content;
      const { judgment: judgeText, score: scoreNum } = parseResponse(text);

      setJudgment(judgeText);
      setScore(scoreNum);
    } catch (err) {
      triggerPoopExplosion();
      setError(`The judge exploded. Probably your fault. (${err.message || 'Unknown error'})`);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      handleJudge();
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(`${judgment}\n\nScore: ${score}/100`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <style>{`
        @keyframes poopFly {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          60% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.3); opacity: 0; }
        }
        @keyframes splatPop {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          40% { transform: translate(-50%, -50%) scale(1.4); opacity: 1; }
          70% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        @keyframes shakeCard {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-10px) rotate(-2deg); }
          30% { transform: translateX(10px) rotate(2deg); }
          45% { transform: translateX(-8px) rotate(-1deg); }
          60% { transform: translateX(8px) rotate(1deg); }
          75% { transform: translateX(-4px); }
          90% { transform: translateX(4px); }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .poop-particle {
          position: fixed;
          font-size: 2rem;
          pointer-events: none;
          animation: poopFly var(--dur) ease-out forwards;
          z-index: 9999;
        }
        .splat-center {
          position: fixed;
          top: 50%;
          left: 50%;
          font-size: 7rem;
          pointer-events: none;
          z-index: 10000;
          animation: splatPop 0.85s ease-out forwards;
        }
        .card-shake {
          animation: shakeCard 0.55s ease-in-out;
        }
        .result-animate {
          animation: fadeSlide 0.4s ease;
        }
        .spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }
        .judge-btn:hover:not(:disabled) {
          transform: scale(1.02);
          filter: brightness(1.1);
        }
        .judge-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .copy-btn:hover {
          background: rgba(255,255,255,0.1) !important;
          color: #e8e6ff !important;
        }
      `}</style>

      {/* Poop particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="poop-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            '--rot': `${p.rot}deg`,
            '--dur': `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Big center splat */}
      {splat && <div className="splat-center">💩</div>}

      <main
        className="min-h-screen flex items-center justify-center px-4 py-10"
        style={{ background: '#0d0d0f' }}
      >
        <div className="w-full max-w-xl">

          {/* Header */}
          <div className="text-center mb-10">
            <h1
              className="text-5xl font-black mb-3 leading-tight"
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #ec4899, #f97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AI Judges Your Life Choices
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              "Type your decision. Face the consequences."
            </p>
          </div>

          {/* Main card */}
          <div
            className={shaking ? 'card-shake' : ''}
            style={{
              background: '#111116',
              border: '1px solid #2a2a3a',
              borderRadius: '20px',
              padding: '2rem',
            }}
          >
            {/* Textarea */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="lifeChoice"
                style={{
                  display: 'block', fontSize: '0.75rem', fontWeight: 600,
                  color: '#9ca3af', marginBottom: '0.5rem',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}
              >
                Your Life Choice
              </label>
              <textarea
                id="lifeChoice"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`e.g. ${hint}`}
                maxLength={200}
                rows={3}
                style={{
                  width: '100%', background: '#1a1a24', border: '1px solid #3a3a50',
                  borderRadius: '12px', padding: '0.85rem 1rem', color: '#e8e6ff',
                  fontSize: '0.95rem', resize: 'none', fontFamily: 'inherit',
                  lineHeight: 1.6, outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
                onBlur={(e) => (e.target.style.borderColor = '#3a3a50')}
              />
              <p style={{ textAlign: 'right', fontSize: '0.75rem', color: '#4b4b65', marginTop: '0.25rem' }}>
                {input.length}/200
              </p>
            </div>

            {/* Mode selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="intensity"
                style={{
                  display: 'block', fontSize: '0.75rem', fontWeight: 600,
                  color: '#9ca3af', marginBottom: '0.5rem',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}
              >
                Judge Intensity
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  id="intensity"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  style={{
                    width: '100%', background: '#1a1a24', border: '1px solid #3a3a50',
                    borderRadius: '12px', padding: '0.85rem 2.5rem 0.85rem 1rem',
                    color: '#e8e6ff', fontSize: '0.95rem', fontFamily: 'inherit',
                    cursor: 'pointer', appearance: 'none', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
                  onBlur={(e) => (e.target.style.borderColor = '#3a3a50')}
                >
                  <option value="savage">🔥 Savage</option>
                  <option value="brutal">💀 Brutally Savage</option>
                  <option value="dead">☠️ Dead Savage</option>
                </select>
                <span style={{
                  position: 'absolute', right: '1rem', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none', color: '#7c3aed',
                }}>
                  ▾
                </span>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                className="result-animate"
                style={{
                  marginBottom: '1.25rem', padding: '0.85rem 1rem',
                  background: 'rgba(180,0,0,0.15)', border: '1px solid #dc2626',
                  borderRadius: '10px', color: '#fca5a5', fontSize: '0.9rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>💩</span>
                <span>{error}</span>
              </div>
            )}

            {/* Judge button */}
            <button
              className="judge-btn"
              onClick={handleJudge}
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#374151' : 'linear-gradient(135deg, #7c3aed, #db2777)',
                border: 'none', borderRadius: '12px', padding: '1rem',
                color: 'white', fontSize: '1rem', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                transition: 'transform 0.15s, filter 0.15s, opacity 0.2s',
                opacity: loading ? 0.6 : 1,
                marginBottom: '1.25rem',
              }}
            >
              {loading ? (
                <span>
                  <span className="spinner" style={{ marginRight: '0.4rem' }}>⏳</span>
                  Judging your life...
                </span>
              ) : (
                'Judge Me'
              )}
            </button>

            {/* Loading placeholder */}
            {loading && !judgment && (
              <div
                className="result-animate"
                style={{
                  border: '2px solid #ca8a04', borderRadius: '16px',
                  padding: '1.5rem', background: 'rgba(120,90,0,0.15)', textAlign: 'center',
                }}
              >
                <div className="spinner" style={{ fontSize: '2rem', display: 'inline-block', marginBottom: '0.75rem' }}>
                  ⚖️
                </div>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                  Consulting the judgment council...
                </p>
              </div>
            )}

            {/* Result card */}
            {judgment && score !== null && (
              <div
                className="result-animate"
                style={{
                  border: `2px solid ${getScoreColor(score)}`,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  background: getResultBg(score),
                }}
              >
                <p style={{
                  fontSize: '1.05rem', lineHeight: 1.7, color: '#e8e6ff',
                  fontStyle: 'italic', marginBottom: '1.25rem',
                }}>
                  {judgment}
                </p>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingBottom: '1rem', marginBottom: '1rem',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <div>
                    <p style={{
                      fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase',
                      letterSpacing: '0.06em', marginBottom: '0.2rem',
                    }}>
                      Your Score
                    </p>
                    <p style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1, color: getScoreColor(score) }}>
                      {score}
                    </p>
                  </div>
                  <div style={{ fontSize: '3.5rem', lineHeight: 1 }}>
                    {getEmoji(score)}
                  </div>
                </div>

                <button
                  className="copy-btn"
                  onClick={handleCopy}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                    padding: '0.6rem', color: copied ? '#4ade80' : '#9ca3af',
                    fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  {copied ? '✓ Copied to clipboard' : 'Copy Judgment'}
                </button>
              </div>
            )}

            {/* Hint */}
            {!judgment && !loading && (
              <div style={{
                textAlign: 'center', paddingTop: '1rem',
                borderTop: '1px solid #1e1e2e', color: '#4b4b65', fontSize: '0.85rem',
              }}>
                Try: "{hint}"
              </div>
            )}
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#3a3a50', fontSize: '0.8rem' }}>
            Your life choices are no longer safe.
          </p>
        </div>
      </main>
    </>
  );
}