# 🍲 SoupStock 

A self hostable family fridge inventory system, built for households that cook
Cantonese soups and always seem to buy the same ingredients twice.

> *"屋企仲有冇無花果?"*
> Now you can check from the grocery store.

---

## Why This Exists

Cantonese slow cooked soups (老火湯) use a wide variety of ingredients 
carrots, green carrots, 南北杏, pork bones, ginger, and more.
Most of them live in the fridge or pantry, and family members constantly lose
track of what's already there.

**SoupStock** is a lightweight web app that any family can deploy for free
and use from their phone while grocery shopping.

---

## Features

- 📋 **Fridge inventory** — view, add, edit, and delete ingredients
- 🔍 **Search + filter** — find ingredients by name or category
- 🛒 **Shopping Check** — type what you plan to buy and instantly see what you already have
- 📅 **Expiry tracking** — optional expiry date with colour-coded warnings
- 📱 **Mobile-first** — designed to be used on a phone in the grocery store
- 🆓 **100% free to deploy** — runs on Vercel + Render + Supabase free tiers

---

## Tech Stack

| Layer    | Technology                      |
|----------|---------------------------------|
| Frontend | React 18, Vite, Tailwind CSS    |
| Backend  | Python FastAPI, Uvicorn         |
| Database | Supabase (Postgres)             |
| Hosting  | Vercel (frontend), Render (API) |

---

## Architecture

```
Browser (Phone / Desktop)
        │
        ▼
┌────────────────────┐
│   Vercel           │  ← React + Vite frontend
│   (free tier)      │
└────────┬───────────┘
         │  REST API calls (HTTPS)
         ▼
┌────────────────────┐
│   Render           │  ← FastAPI Python backend
│   (free tier)      │
└────────┬───────────┘
         │  Supabase client (HTTPS)
         ▼
┌────────────────────┐
│   Supabase         │  ← Postgres database
│   (free tier)      │
└────────────────────┘
```

---

## Project Structure

```
SoupStock/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS setup
│   │   ├── db/
│   │   │   └── client.py        # Supabase client singleton
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic request/response schemas
│   │   └── routes/
│   │       ├── ingredients.py   # CRUD endpoints
│   │       └── shopping.py      # Shopping check endpoint
│   ├── requirements.txt
│   ├── render.yaml              # Render deployment config
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Routing
│   │   ├── main.jsx             # Entry point
│   │   ├── index.css            # Tailwind + global styles
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── IngredientCard.jsx
│   │   │   ├── IngredientModal.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   └── CategoryBadge.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # My Fridge page
│   │   │   └── ShoppingCheck.jsx
│   │   ├── hooks/
│   │   │   └── useIngredients.js
│   │   └── utils/
│   │       ├── api.js           # All fetch calls to the backend
│   │       └── constants.js     # Categories, units, colours
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── supabase_schema.sql          # Run this in Supabase SQL Editor
├── .gitignore
└── README.md
```

---

## Local Development Setuppppppppppppppp

Follow these steps to run the project on your own computer. SO everyone can have their own cloud fridge storage!

### Prerequisites

- **Node.js** v18 or later — [nodejs.org](https://nodejs.org)
- **Python** 3.11 or later — [python.org](https://python.org)
- A free **Supabase** account — [supabase.com](https://supabase.com)

---

### Step 1 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** and give it a name (e.g. `soupstock`).
3. Wait for the project to finish setting up (~1 minute).
4. In the left sidebar, click **SQL Editor → New Query**.
5. Paste the contents of `supabase_schema.sql` and click **Run**.
6. Your database is ready.

**Get your API credentials:**
- Go to **Project Settings → API**.
- Copy your **Project URL** and **anon public** key.
  You will need these in the next steps.

---

### Step 2 — Run the Backend

```bash
# Navigate to the backend folder
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy the example env file and fill in your values
cp .env.example .env
```

Open `backend/.env` and fill in:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key
FRONTEND_URL=http://localhost:5173
```

```bash
# Start the backend server
uvicorn app.main:app --reload
```

The API will be available at **http://localhost:8000**.
Visit http://localhost:8000/docs to see the interactive API docs.

---

### Step 3 — Run the Frontend

Open a new terminal window:

```bash
# Navigate to the frontend folder
cd frontend

# Install Node dependencies
npm install

# Copy the example env file
cp .env.example .env
```

Open `frontend/.env` and fill in:
```
VITE_API_BASE_URL=http://localhost:8000
```

```bash
# Start the frontend dev server
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## Free-Tier Deployment Guide

This is how another family can deploy their own private copy of SoupStock
at $0/month.

### 1 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
# Create a repo on github.com and follow their instructions to push
git remote add origin https://github.com/YOUR_USERNAME/SoupStock.git
git push -u origin main
```

---

### 2 — Deploy the Backend to Render

[Render](https://render.com) hosts Python web services for free.

1. Create a free account at [render.com](https://render.com).
2. Click **New → Web Service**.
3. Connect your GitHub account and choose your SoupStock repo.
4. Set the **Root Directory** to `backend`.
5. Render should auto-detect the `render.yaml` config. If not, use:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Under **Environment Variables**, add:
   - `SUPABASE_URL` → your Supabase project URL
   - `SUPABASE_KEY` → your Supabase anon key
   - `FRONTEND_URL` → your Vercel URL (you'll get this in the next step — come back and update it)
7. Click **Create Web Service**.

Render will give you a URL like:
`https://soupstock-api.onrender.com`

---

### 3 — Deploy the Frontend to Vercel

[Vercel](https://vercel.com) hosts React apps for free.

1. Create a free account at [vercel.com](https://vercel.com).
2. Click **Add New → Project**.
3. Import your GitHub repo.
4. Set the **Root Directory** to `frontend`.
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` → your Render URL (e.g. `https://soupstock-api.onrender.com`)
6. Click **Deploy**.

Vercel will give you a URL like:
`https://soupstock.vercel.app`

---

### 4 — Final wiring

Go back to **Render → your service → Environment** and update:
```
FRONTEND_URL=https://soupstock.vercel.app
```

Then click **Manual Deploy → Deploy Latest Commit** to apply the change.

Your app is live! 🎉

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable       | Description                               | Example                                   |
|----------------|-------------------------------------------|-------------------------------------------|
| `SUPABASE_URL` | Your Supabase project URL                 | `https://abcdef.supabase.co`              |
| `SUPABASE_KEY` | Your Supabase anon (public) key           | `eyJhbGci...`                             |
| `FRONTEND_URL` | Your Vercel URL (for CORS)                | `https://soupstock.vercel.app`            |

### Frontend (`frontend/.env`)

| Variable             | Description                      | Example                                       |
|----------------------|----------------------------------|-----------------------------------------------|
| `VITE_API_BASE_URL`  | Your Render API URL              | `https://soupstock-api.onrender.com`          |

---

## API Endpoints

| Method | Path                      | Description                          |
|--------|---------------------------|--------------------------------------|
| GET    | `/ingredients/`           | List all ingredients                 |
| GET    | `/ingredients/?q=ginger`  | Search by name                       |
| GET    | `/ingredients/?category=meat` | Filter by category               |
| GET    | `/ingredients/{id}`       | Get one ingredient                   |
| POST   | `/ingredients/`           | Add a new ingredient                 |
| PUT    | `/ingredients/{id}`       | Update an ingredient                 |
| DELETE | `/ingredients/{id}`       | Remove an ingredient                 |
| POST   | `/shopping-check/`        | Compare list against fridge          |

Interactive docs available at: `http://localhost:8000/docs`

---

## Free-Tier Limitations

Be aware of these limits when self-hosting:

| Service  | Limitation |
|----------|------------|
| **Render** | Free web services spin down after 15 minutes of inactivity. The first request after a sleep takes ~30–60 seconds to wake up. Totally fine for family use. |
| **Supabase** | Free tier allows 500MB database storage and 2GB bandwidth per month. More than enough for a family fridge app. |
| **Vercel** | Free tier is generous — 100GB bandwidth, unlimited personal projects. |

**Tip:** If the backend is slow to respond the first time you open the app
after a while, just wait a few seconds — Render is waking up.

---

## Future Improvements (v2 ideas)

- [ ] Barcode scanning with the phone camera
- [ ] Expiry date notifications (email or push)
- [ ] Simple PIN-based auth for shared family use
- [ ] Multiple fridges / pantry sections
- [ ] Recipe suggestions based on what's in stock
- [ ] Shopping list export (copy to clipboard / share)
- [ ] Multi-language support (Traditional Chinese 繁中)

---

## How to Self-Host Your Own Copy

1. **Fork** this repo on GitHub (click the Fork button top-right).
2. Follow the [Local Development Setup](#local-development-setup) above.
3. Follow the [Free-Tier Deployment Guide](#free-tier-deployment-guide) above.
4. Share the Vercel link with your family.

That's it. No servers to manage, no monthly bills.

---

## Contributing

This project is open-source and built for learning. Pull requests are welcome!
If you find a bug or want to suggest a feature, please open an issue.

---

## License

MIT License — free to use, modify, and share.

---

*Built with ❤️ for families who love a good bowl of soup.*
