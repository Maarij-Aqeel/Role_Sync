# 🚀 RoleSync AI 

An advanced AI-powered **Resume Optimizer** and **Cover Letter Writer** designed to help software engineers and technical candidates bypass rigid Applicant Tracking Systems (ATS). 

Built on a modern **Next.js** edge stack and powered by **Google Gemini 2.5 Flash**, RoleSync AI intelligently scores your existing resume against target Job Descriptions, identifies critical missing syntax and domain-specific hard skills, and dynamically injects rewritten bullet points directly into a rich-text editing suite. 

![RoleSync AI Landing](https://via.placeholder.com/800x400.png?text=RoleSync+AI+Landing+Page) *(Replace with actual screenshot)*

## ✨ Key Features

### 🎯 1. ATS & Domain Fit Scoring
* **Intelligent PDF Parsing:** securely exacts raw text buffers from your uploaded `.pdf` resume entirely in the browser using `pdf-parse` without persisting your data on external databases.
* **Dual-Metrics Engine:** Evaluates your profile on two axes: general ATS compatibility constraints, and deep **Domain Fit** against the specific Job Description.
* **Animated Progress Tracking:** Gorgeous, buttery-smooth SVG stroke animations powered by `framer-motion` to visually reward you as your score increases upon injecting missing skills. 

### ✍️ 2. Holistic Resume Editing Suite
* **Rich Text Interface:** Built natively on **TipTap**, allowing full markdown-style editing, formatting, and structural control over your resume.
* **One-Click Keyword Injection:** Advanced DOM-scanning AI maps missing skills explicitly to specific headings (e.g., "Experience" or "Skills"). Clicking a suggested keyword instantly writes a grammatically perfect, metric-driven sentence directly into your resume canvas.
* **Visual Context Highlights:** Injected optimizations physically pulse in red inside the document, allowing you to instantly visualize exactly where the AI manipulated your history.
* **Dynamic LaTeX PDF Export:** Seamlessly exports your highly-optimized TipTap Document directly into a pristine `.pdf` powered by a backend compilation bridge to an external `TexLive` LaTeX engine.

### ✉️ 3. Autonomous Cover Letter Generation
* **Zero-Upload Dashboard:** Thanks to global `Zustand` state management, the Cover Letter writer seamlessly inherits the PDF and Job Description you already uploaded!
* **Technical Recruiter Persona:** Powered by an ultra-strict Prompt Engineering layer, the AI generates punchy, sub-300-word, metric-driven cover letters focusing entirely on day-one value.
* **Rich Text Clipboard API:** Features a hardened 3-tier browser fallback (utilizing the native `ClipboardItem` and DOM `Range` APIs) allowing you to click **Copy** and flawlessly paste bulleted, bolded HTML directly into Gmail. 
* **Dedicated PDF Export:** Bypasses clunky browser `window.print()` dialogs and instead creates dedicated, perfectly-styled PDF renders locally on your client utilizing `@html2pdf.js` and Tailwind Typography. 

### 🌙 4. Edge-Ready UI/UX
* **Next-Themes Dark Mode:** Fully synchronized OS system theme preference switching without layout flashing. 
* **Tailwind CSS v4 & Typography:** Elegant styling featuring the `@tailwindcss/typography` plugin to beautifully format generated raw HTML. 

## 🛠 Tech Stack 

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion
- **State Management:** Zustand
- **Editor:** TipTap (ProseMirror core) 
- **AI/LLM:** Google Gemini API (`@google/genai`) 
- **Utilities:** `html2pdf.js`, `lucide-react`, `pdf-parse`, `clsx`, `tailwind-merge` 

## ⚙️ Local Development Setup

To run RoleSync AI locally, clone the repository and execute the following:

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
Create a `.env.local` file in the root directory and add your Google Gemini API Key:
```env
GEMINI_API_KEY="AIzaSyYourKeyHere..."
```

3. **Start the Development Server**
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🚀 Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new). The `/api/export` and `/api/analyze` routes are built specifically to handle serverless Vercel function timeout limitations gracefully.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Maarij-Aqeel/Role_Sync/issues).

## 📝 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
