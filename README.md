# Abhishek Tripathi — Personal Portfolio

A premium dark-themed developer portfolio showcasing projects, skills, and professional experience.

## Quick Start (VS Code)

1. Open the `portfolio` folder in VS Code
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions panel
3. Right-click `index.html` → **Open with Live Server**
4. The site opens at `http://127.0.0.1:5500` (auto-refreshes on save)

## Adding Your Files

### Profile Photo
Place your photo at `assets/profile.jpg`.
- Recommended: 400×400px or larger (square/circular crop)
- Format: JPG or PNG

### Resume PDF
Place your resume at `assets/resume.pdf`.
- The "Download Resume" button links to this file automatically

### Project Screenshots
Place project screenshots in `assets/projects/`.
- Recommended: 800×500px
- Then update the `<img>` tag inside `.project-image-placeholder` in `index.html`

### GitHub / Live Demo Links
Search for `YOUR_GITHUB_PROJECT_LINK` and `YOUR_LIVE_PROJECT_LINK` in `index.html` and replace them with your actual URLs.

### Certificate Links
Search for `YOUR_CERTIFICATE_LINK` in `index.html` and replace with your certificate URLs.

## File Structure

```
portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── profile.jpg      ← add your photo
│   ├── resume.pdf        ← add your resume
│   └── projects/         ← add project screenshots
└── README.md
```

## Tech Stack

- HTML5 (semantic)
- CSS3 (custom properties, glassmorphism, animations)
- JavaScript (vanilla, no frameworks)
- Lucide Icons (CDN)
- Google Fonts: Inter + JetBrains Mono

## Features

- Dark premium theme with gradient accents
- Glassmorphism cards
- Particle grid hero background
- Scroll-reveal animations
- Active nav link highlighting
- Responsive (desktop, tablet, mobile)
- Mobile hamburger menu
- Frontend-only contact form
- SEO meta tags + Open Graph