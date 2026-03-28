"""
Shopping Check API route.
Compares a user's shopping list against the current fridge inventory.
"""

from fastapi import APIRouter
from app.models.schemas import ShoppingCheckRequest, ShoppingCheckResponse
from app.db.client import supabase

router = APIRouter()

TABLE = "ingredients"


def normalize(text: str) -> str:
    """
    Simple text normalization for matching:
    - lowercase
    - strip leading/trailing spaces
    
    Kept intentionally simple for v1. 
    Fuzzy matching can be added in a future version.
    """
    return text.lower().strip()


@router.post("/", response_model=ShoppingCheckResponse)
def shopping_check(request: ShoppingCheckRequest):
    """
    Compare the user's shopping list against fridge inventory.
    
    Returns:
    - available: items already in the fridge
    - missing: items not found in the fridge
    """
    # Fetch all ingredient names from the fridge
    response = supabase.table(TABLE).select("name").execute()
    fridge_names = {normalize(row["name"]) for row in response.data}

    available = []
    missing = []

    for item in request.items:
        # Skip empty strings (in case of accidental blank chips)
        if not item.strip():
            continue

        if normalize(item) in fridge_names:
            available.append(item)
        else:
            missing.append(item)

    return ShoppingCheckResponse(available=available, missing=missing)
