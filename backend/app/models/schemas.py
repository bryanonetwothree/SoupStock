"""
Pydantic schemas for request and response validation.
FastAPI uses these to validate incoming JSON and serialize outgoing data.
"""

from pydantic import BaseModel
from typing import Optional
from datetime import date


# ---------------------------------------------------------------------------
# Ingredient schemas
# ---------------------------------------------------------------------------

class IngredientBase(BaseModel):
    """Fields shared between create and update."""
    name: str
    quantity: float
    unit: str
    category: str
    expiry_date: Optional[date] = None
    notes: Optional[str] = None


class IngredientCreate(IngredientBase):
    """Schema used when creating a new ingredient (POST)."""
    pass


class IngredientUpdate(BaseModel):
    """Schema used when updating an ingredient (PUT).
    All fields are optional so the client can send only what changed.
    """
    name: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    category: Optional[str] = None
    expiry_date: Optional[date] = None
    notes: Optional[str] = None


class Ingredient(IngredientBase):
    """Full ingredient schema returned by the API (includes database fields)."""
    id: int
    date_added: str  # ISO date string from Supabase

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Shopping check schemas
# ---------------------------------------------------------------------------

class ShoppingCheckRequest(BaseModel):
    """A list of ingredient names the user wants to check."""
    items: list[str]


class ShoppingCheckResponse(BaseModel):
    """Result of a shopping check."""
    available: list[str]   # Items already in the fridge
    missing: list[str]     # Items not found in the fridge
