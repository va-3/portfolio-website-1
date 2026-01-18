# Vishnu Anapalli - Professional Portfolio

A modern, responsive portfolio website featuring an AI-powered chatbot, showcasing my experience as a Full Stack Engineer at PeerBridge and my 1st place hackathon-winning project, TheraBridge.

**Live Site**: [vishnuanapalli.com](https://vishnuanapalli.com)

---

## 🚀 Features

- **Custom Domain**: Professional branding with vishnuanapalli.com
- **Responsive Design**: Fully responsive layout optimized for all devices
- **AI Chatbot "Dobby"**: Intelligent fullscreen chatbot powered by OpenAI GPT-4o-mini with optimized layout and consistent UX
- **Modern UI/UX**: Clean, professional design with smooth animations, light/dark mode, and refined spacing
- **Photo Gallery**: Interactive 6-image gallery showcasing professional and personal moments
- **Resume Highlights**: Interactive timeline showcasing current role at PeerBridge and TheraBridge hackathon win
- **PDF Resume Viewer**: Optimized PDF loading with instant thumbnail preview and fullscreen modal
- **Technical Skills**: Comprehensive display of 22+ technologies (React, Node.js, PostgreSQL, MongoDB, Docker, AWS, etc.)
- **SEO Optimized**: Semantic HTML with proper meta tags for search visibility
- **Serverless Architecture**: Deployed on Netlify with serverless functions

---

## 📁 Project Structure

```
portfolio-website-1/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styling
├── js/
│   ├── main.js           # Navigation, gallery, scroll effects
│   ├── chatbot.js        # AI chatbot UI and persistence
│   ├── theme.js          # Light/dark mode toggle
│   ├── pdf-loader.js     # Optimized PDF loading
│   └── resume-modal.js   # Fullscreen resume viewer
├── netlify/
│   └── functions/
│       └── chat.js       # Serverless chatbot backend (OpenAI GPT-4o-mini)
├── images/               # Profile and gallery images
│   ├── profile.jpg
│   ├── gallery-*.jpg
│   └── logo.jpg
├── videos/
│   └── about-me.mp4      # Intro video
├── netlify.toml          # Netlify deployment configuration
├── package.json          # Dependencies (OpenAI SDK)
└── README.md
```

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+) - Vanilla JS, no frameworks
- Responsive design with CSS Grid and Flexbox
- Custom CSS theme system with CSS variables (light/dark mode)
- Font Awesome 6.4 icons
- Google Fonts (DM Sans, Crimson Pro, Inter)

**Backend:**
- Netlify Serverless Functions
- OpenAI GPT-4o-mini API
- Node.js runtime

**Deployment:**
- **Hosting**: Netlify
- **Domain**: Porkbun (DNS configured)
- **SSL**: Let's Encrypt (automatic via Netlify)
- **CDN**: Netlify Edge Network

---

## 🌐 Live Deployment

**Production URL**: https://vishnuanapalli.com

**Key Features:**
- ✅ Custom domain with HTTPS
- ✅ Automatic redirects (www → root domain)
- ✅ AI chatbot with knowledge about my professional background
- ✅ Updated resume content (PeerBridge, TheraBridge, Vivint)
- ✅ 22 technical skills displayed
- ✅ Mobile-responsive design

---

## 📝 Content Highlights

### Current Position
**Full Stack Engineer at PeerBridge** (Feb 2025 - Present)
- Building AI-powered mental health platforms serving 7+ countries
- 40% API response time reduction through optimization
- 75% increase in weekly active users
- Leading team of 4 engineers

### Major Achievement
**TheraBridge - 1st Place Hackathon Winner** 🏆
- Won among 100+ teams at PeerBridge Hackathon
- React/TypeScript, Node.js, MongoDB, AWS, OpenAI GPT-4
- 95% speaker identification accuracy
- 80% reduction in manual review time

### Technical Skills
Python, JavaScript, TypeScript, SQL, C, C++, React, Node.js, Redux, FastAPI, Jest, pandas, Git, Docker, AWS, Azure, Linux, Power BI, Tableau, Jira, PostgreSQL, MongoDB

### Education
**The University of Texas at Dallas**
- B.S. in Computer Information Systems
- GPA: 3.6/4.0
- Expected Graduation: May 2027

---

## 🤖 AI Chatbot "Dobby"

The portfolio features an intelligent fullscreen chatbot named "Dobby" that can answer questions about:
- Professional experience and current role at PeerBridge
- Projects and achievements (TheraBridge, PeerBridge features)
- Technical skills and certifications (Azure AI-900, AZ-900, Databricks)
- Education and coursework
- Personal journey from athlete to sales to software engineering

**Implementation:**
- Built using OpenAI GPT-4o-mini API
- Serverless function hosted on Netlify
- Comprehensive 140-line system prompt with 6 response examples
- Session management for conversation context
- Third-person responses (40-60 words, professional and concise)
- iMessage-style animated typing dots (teal/purple based on theme)
- Compact card widget with fixed height (550px)
- Optimized layout with natural top-to-bottom message flow
- Session storage for conversation persistence
- TheraBridge-inspired design (teal in light mode, purple in dark mode)

**Try it**: Visit [vishnuanapalli.com](https://vishnuanapalli.com) and click the Dobby icon to chat with the AI!

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- OpenAI API key
- Git

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/va-3/Portfolio.git
cd Portfolio
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file (not tracked in git):
```
OPENAI_API_KEY=your_openai_api_key_here
```

**Getting an OpenAI API Key:**
- Visit https://platform.openai.com/api-keys
- Create a new API key
- Copy and paste it into your `.env` file

4. **Run locally:**
```bash
# Option 1: Simple file server (without chatbot)
python3 -m http.server 8000

# Option 2: Netlify Dev (with chatbot functions)
npm install -g netlify-cli
netlify dev
```

5. **Open in browser:**
- Simple server: http://localhost:8000
- Netlify dev: http://localhost:8888

---

## 📦 Deployment

### Deploy to Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify:**
```bash
netlify login
```

3. **Deploy:**
```bash
netlify deploy --prod
```

4. **Configure environment variables in Netlify:**
- Go to Netlify dashboard → Site settings → Environment variables
- Add `OPENAI_API_KEY` with your API key

### Custom Domain Setup (Porkbun)

**DNS Records:**
- **A Record**: `@` → `75.2.60.5` (Netlify load balancer)
- **CNAME Record**: `www` → `vishnuanapalli.netlify.app`

**SSL Certificate:**
- Automatically provisioned by Netlify (Let's Encrypt)
- Force HTTPS enabled
- Auto-renewal every 90 days

---

## 🎨 Customization

### Update Personal Information

1. **index.html** - Update resume highlights, skills, about me section
2. **netlify/functions/chat.js** - Update chatbot system prompt with your information
3. **images/** - Replace with your profile photo and gallery images
4. **videos/** - Add your introduction video

### Modify Styling

Edit `css/styles.css` and update CSS variables:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #8b5cf6;
    --accent-color: #f59e0b;
    /* ... */
}
```

---

## 🔄 Recent Updates

### January 2026
- **Chatbot UX Enhancement**: Fixed layout with natural top-to-bottom chat flow, scroll-to-top on logo click, and smooth auto-scroll
- **Gallery Refresh**: Updated photo gallery with new professional and personal images
- **CSS Optimization**: Improved flexbox layout for chat messages container
- **Theme System**: Light/dark mode with TheraBridge-inspired color palette
- **PDF Viewer**: Optimized resume loading with instant thumbnail preview

### Previous Updates
- AI chatbot implementation with GPT-4o-mini
- Fullscreen resume modal with dark mode filter
- Session-based chat persistence
- About Me section redesign with video card layout
- Simplified chatbot greeting for natural conversation flow

---

## 🐛 Troubleshooting

### Chatbot Not Responding
1. Check that `OPENAI_API_KEY` is set in Netlify environment variables
2. Verify the API key is valid on OpenAI platform
3. Check browser console (F12) for errors
4. Ensure Netlify function deployed successfully

### Images Not Loading
1. Verify images are in the `images/` folder
2. Check file paths are correct (case-sensitive)
3. Use supported formats (.jpg, .jpeg, .png, .webp)

### Custom Domain Not Working
1. Wait 24-48 hours for DNS propagation
2. Verify DNS records in Porkbun match Netlify requirements
3. Check Netlify domain settings show green checkmark
4. Try clearing browser cache or using incognito mode

---

## 💰 Cost Considerations

**Hosting:**
- Netlify: Free tier (100GB bandwidth/month, sufficient for portfolio)

**AI Chatbot:**
- OpenAI GPT-4o-mini: ~$0.001 per chat interaction
- Typical monthly cost: $1-5 depending on traffic
- Set up billing alerts in OpenAI dashboard

**Domain:**
- Porkbun: ~$10-15/year (varies by TLD)

---

## 📊 Performance

- **Lighthouse Score**: 90+ (all metrics)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Mobile-Friendly**: 100% responsive
- **SEO Score**: 95+
- **PDF Load Optimization**: 50x faster perceived load with instant thumbnail preview
- **Lazy Loading**: Gallery images load on demand for faster initial page load

---

## 🔒 Security

- ✅ HTTPS enforced site-wide
- ✅ API keys stored as environment variables (not in code)
- ✅ `.env` file in `.gitignore`
- ✅ CORS configured for Netlify functions
- ✅ No sensitive data exposed in frontend

---

## 📄 License

MIT License - Feel free to fork and customize for your own portfolio!

---

## 👤 About Me

**Vishnu Anapalli**
- 📧 Email: vxa220055@utdallas.edu
- 🔗 LinkedIn: [linkedin.com/in/vishnu-anapalli](https://www.linkedin.com/in/vishnu-anapalli)
- 🐙 GitHub: [github.com/va-3](https://github.com/va-3)
- 🌐 Portfolio: [vishnuanapalli.com](https://vishnuanapalli.com)

**Current Role:** Full Stack Engineer @ PeerBridge

**Recent Achievement:** 🏆 1st Place Winner - PeerBridge Hackathon (TheraBridge)

---

## 🙏 Credits

- **AI Integration**: OpenAI GPT-4o-mini API
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins, Inter, Lora)
- **Hosting**: Netlify
- **Domain**: Porkbun

---

**⭐ If you found this helpful, please give it a star!**

Built with passion and deployed with pride 🚀
