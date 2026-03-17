# 🚀 RoleSync AI

An advanced, AI-powered **Resume Optimizer** and **Cover Letter Writer** designed to help software engineers and technical candidates bypass rigid Applicant Tracking Systems (ATS) and land more interviews.

Built on a modern **Next.js** edge stack and powered by **Google Gemini 2.5 Flash**, RoleSync AI acts as your personal technical recruiter. It intelligently scores your existing resume against target Job Descriptions, identifies critical missing syntax and domain-specific hard skills, and gives you a powerful rich-text editing suite to dynamically inject targeted keywords perfectly.

---

## ✨ Core Features

### 🎯 1. ATS & Domain Fit Scoring
* **Intelligent PDF Parsing:** Securely extracts raw text from your uploaded `.pdf` resume entirely in the browser. 
* **Dual-Metrics Engine:** Evaluates your profile on two independent axes: general ATS compatibility constraints and deep **Domain Fit** against the specific Job Description.
* **Contextual Analysis:** Employs advanced LLM reasoning to extract semantic context, parse your existing skills, and calculate a realistic baseline score before you even start editing.

### ✍️ 2. Physical Paper Editing Suite
* **A4 Document Canvas:** An elegant, distraction-free "Physical Paper" editing interface built on top of **TipTap**, allowing full markdown-style editing, formatting, and structural control over your resume with true-to-life A4 scaling.
* **Smart Highlight Overlays:** Injected optimizations or flagged keywords physically highlight in the document (mimicking a yellow highlighter via `mix-blend-mode`), allowing you to instantly visualize exactly where your attention is needed.
* **Rich Text Preservation:** When you're done, simply click "Copy Resume" to copy your entire document to your clipboard as rich `text/html`. This preserves all your bullet points, bolding, and structural formatting for seamless pasting into Google Docs or Gmail.
* **LaTeX PDF Export:** Generate and copy pristine LaTeX code directly from your optimized TipTap DOM.

### ✉️ 3. Autonomous Cover Letter Generation
* **Zero-Upload Dashboard:** Thanks to global `Zustand` state management, the Cover Letter writer seamlessly inherits the PDF and Job Description you already analyzed in your workspace.
* **Technical Recruiter Persona:** Powered by an ultra-strict Prompt Engineering layer, the AI generates punchy, metric-driven cover letters focusing entirely on day-one value.
* **Built-in Editor:** Adjust the AI's first draft right in the browser. Features a hardened browser fallback (utilizing native `ClipboardItem` APIs) allowing you to copy the fully formatted letter directly into your email client.

### 🔒 4. Absolute Privacy & Edge-Ready UI
* **Privacy First:** Textual extraction happens inside your browser. You own your data, and your actual PDF is never persistently logged or stored on external servers.
* **Next-Themes Dark Mode:** Fully synchronized OS system theme switching without layout flashing.
* **Tailwind CSS v4 & Typography:** Elegant styling featuring the `@tailwindcss/typography` plugin to beautifully format your generated content, complete with dynamic `framer-motion` scanning animations and gradients.

---

## 🛠 Tech Stack 

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion
- **State Management:** Zustand
- **Editor:** TipTap (ProseMirror core) 
- **AI/Language Model:** Google Gemini API (`@google/genai`) 
- **Utilities:** `lucide-react`, `pdf-parse`, `clsx`, `tailwind-merge` 

---

## ⚙️ Local Development Setup

To run RoleSync AI locally on your machine, clone the repository and execute the following:

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
Create a `.env.local` file in the root directory and add your Google Gemini API Key:
```env
GEMINI_API_KEY="AIzaSyYourGoogleGeminiApiKeyHere..."
```

3. **Start the Development Server**
```bash
npm run dev
```

4. **Access the App**
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new). The `/api/*` routes are built to handle server-side API generation and streaming gracefully.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Maarij-Aqeel/Role_Sync/issues).

## 📝 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
