"""
SoupStock - FastAPI Backend
Entry point for the API server.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routes import ingredients, shopping

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="SoupStock API",
    description="Family fridge inventory system for Cantonese soup cooking",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS – allow the frontend (Vercel) to call this API
# ---------------------------------------------------------------------------
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    # In production this should be your exact Vercel URL, e.g. https://soupstock.vercel.app
    allow_origins=[frontend_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(ingredients.router, prefix="/ingredients", tags=["Ingredients"])
app.include_router(shopping.router, prefix="/shopping-check", tags=["Shopping Check"])


@app.get("/")
def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "SoupStock API is running 🍲"}
