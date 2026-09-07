# Abhishek Tripathi — 3D & Animated Developer Portfolio

A state-of-the-art developer portfolio engineered with **Three.js WebGL**, **CSS 3D perspective tilt**, **cyber-glassmorphism aesthetics**, and real-time interactive showcases.

---

## 🚀 How to Deploy on Render (Step-by-Step)

### Step 1: Push this code to your GitHub
1. Go to [github.com/new](https://github.com/new) and create a new repository (e.g., `portfolio`).
2. Open terminal in this folder and run:
   ```bash
   git remote add origin https://github.com/abhishektripathi9/portfolio.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Render

#### Recommended: Static Site (100% Free, Global CDN, Fast)
1. Sign in to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** at the top right and select **Static Site**.
3. Connect your GitHub account and choose the `portfolio` repository.
4. Fill in the settings:
   - **Name**: `abhishek-tripathi-portfolio`
   - **Branch**: `main`
   - **Build Command**: *(leave blank)*
   - **Publish Directory**: `.` (a single dot)
5. Click **Create Static Site**.
6. Render will publish your site in seconds and provide a live URL like:
   `https://abhishek-tripathi-portfolio.onrender.com`

---

#### Alternative: Web Service (Node.js Server)
If you prefer deploying with the included Node.js server:
1. Click **New +** -> **Web Service**.
2. Connect your `portfolio` repository.
3. Settings:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Click **Create Web Service**.

---

#### 1-Click Blueprint Deploy:
1. Click **New +** -> **Blueprint**.
2. Connect your repository. Render will automatically detect `render.yaml` and configure the service for you!

---

## 💻 Local Development
To run locally:
```bash
# Using Node
npm start

# Or using Python
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.