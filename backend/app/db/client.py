"""
Database connection layer.
Uses the supabase-py client to talk to Supabase Postgres.
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL: str = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY: str = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError(
        "Missing SUPABASE_URL or SUPABASE_KEY in environment variables. "
        "Please copy .env.example to .env and fill in your values."
    )

# Create a single shared Supabase client for the whole app
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
