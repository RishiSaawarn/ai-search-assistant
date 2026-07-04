# 🚀 Deployment Guide: Taking Your App Online

To host this AI Search Assistant on the internet for free (or very cheap), the easiest modern approach is splitting it into two parts:
1. **Frontend (React/Vite)** -> Hosted on **Vercel**
2. **Backend (Node.js)** -> Hosted on **Render** (or Railway)

Here is exactly how to do it.

---

## Step 1: Prepare the Codebase for Production

Right now, your React app sends requests to `/chats`, and Vite magically forwards them to `http://localhost:3000`. In production, they are on different servers, so we must tell React exactly where the backend lives.

*(Note: The codebase has already been updated in `client/src/services/api.ts` to automatically support a `VITE_API_URL` environment variable).*

1. Push your entire `ai-search-assistant` folder to a new **GitHub Repository**.

---

## Step 2: Deploy the Backend (Render)

We deploy the backend first so we can get its live URL.

1. Go to [Render.com](https://render.com) and create an account.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub account and select your `ai-search-assistant` repository.
4. Fill out the configuration:
   - **Root Directory**: `server` *(Important!)*
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. Scroll down to **Environment Variables** and add all the keys from your `server/.env` file:
   - `PORTKEY_API_KEY`, `PORTKEY_VIRTUAL_KEY`, `TAVILY_API_KEY`, `GROQ_API_KEY`, `LANGSMITH_API_KEY`, etc.
6. Click **Deploy Web Service**.
7. Once deployed, Render will give you a URL like `https://ai-search-backend.onrender.com`. Copy this URL!

---

## Step 3: Deploy the Frontend (Vercel)

Now we deploy the UI and connect it to your live backend.

1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New -> Project**.
3. Import your `ai-search-assistant` repository.
4. In the configuration settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client` *(Important!)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Open the **Environment Variables** dropdown and add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://ai-search-backend.onrender.com` *(Paste the URL from Render here, with NO trailing slash)*
6. Click **Deploy**.

## That's it! 🎉

Vercel will give you a live URL (e.g. `https://ai-search-assistant.vercel.app`). You can share this link with anyone, and it will safely route their chats to your Render backend, run through your Groq Guardrails, perform the Tavily web search, and return the answer from Gemini!
