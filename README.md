# AI Judges Your Life Choices

A brutal AI-powered website that judges your life decisions with savage humor and scores them 0-100.

## Features

✨ **Dark Theme** - Modern black/charcoal UI with gradient accents
🎭 **Three Judgment Modes** - Savage, Brutally Savage, Dead Savage
⚡ **Smooth Animations** - Fade-in, slide-up, glowing effects
📱 **Fully Responsive** - Works perfectly on mobile and desktop
🤖 **GROQ AI Integration** - Powered by Llama 3.3 70B
🎨 **Score-Based Coloring** - Red (0-40), Yellow (41-70), Green (71-100)
😄 **Emoji Reactions** - Dynamic emojis based on score
📋 **Copy to Clipboard** - Share your judgments easily

## Setup

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **GROQ API** - AI powered judgments using Llama 3.3 70B model
- **JavaScript/React** - Frontend logic

## API Configuration

The GROQ API key is embedded in the code. To use a different key:

1. Open `app/page.js`
2. Find the line: `const GROQ_API_KEY = '...'`
3. Replace with your own GROQ API key from https://console.groq.com

## Features Walkthrough

**Input Box** - Enter a life decision with up to 200 characters

**Judge Intensity** - Choose your preferred tone:
- Savage: Sharp humor
- Brutally Savage: Sarcastic and personal
- Dead Savage: Maximum offense and dark humor

**Judge Me Button** - Submit for judgment (also works with Enter key on textarea)

**Loading State** - Watch the hourglass ⏳ while the AI judges you

**Judgment Output** - Get a witty punishment and score out of 100

**Copy Button** - Share your judgment instantly

## Customization

- **Placeholders:** Edit the `placeholders` array in `app/page.js`
- **Colors:** Modify Tailwind classes (purple-500, red-500, green-500, etc.)
- **Model:** Change `llama-3.3-70b-versatile` to another GROQ model
- **Animation Speed:** Update keyframes in `tailwind.config.js`

## Error Handling

If the API fails, you'll see: "The judge has gone silent... 🤐"

This prevents harsh crashes and maintains the brutal aesthetic.

## Deployment

Deploy to Vercel with one click:

```bash
vercel deploy
```

Or use any Node.js hosting (Netlify, Railway, Heroku, etc.)

---

**Make Your Life Choices. Let the AI Judge You. 💀**
