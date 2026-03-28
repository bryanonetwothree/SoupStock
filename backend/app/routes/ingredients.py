"""
Ingredients API routes.
Handles all CRUD operations for fridge ingredients.
"""

from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import Ingredient, IngredientCreate, IngredientUpdate
from app.db.client import supabase

router = APIRouter()

TABLE = "ingredients"


# ---------------------------------------------------------------------------
# GET /ingredients  – list all ingredients (with optional search)
# ---------------------------------------------------------------------------

@router.get("/", response_model=list[Ingredient])
def get_ingredients(
    q: str = Query(default=None, description="Search by ingredient name"),
    category: str = Query(default=None, description="Filter by category"),
):
    """
    Return all ingredients from the fridge.
    Optionally filter by name (q) or category.
    """
    query = supabase.table(TABLE).select("*").order("name")

    # Apply search filter if provided
    if q:
        # Supabase ilike = case-insensitive LIKE
        query = query.ilike("name", f"%{q}%")

    # Apply category filter if provided
    if category:
        query = query.eq("category", category)

    response = query.execute()
    return response.data


# ---------------------------------------------------------------------------
# GET /ingredients/{id}  – get a single ingredient
# ---------------------------------------------------------------------------

@router.get("/{ingredient_id}", response_model=Ingredient)
def get_ingredient(ingredient_id: int):
    """Return a single ingredient by its ID."""
    response = supabase.table(TABLE).select("*").eq("id", ingredient_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    return response.data[0]


# ---------------------------------------------------------------------------
# POST /ingredients  – add a new ingredient
# ---------------------------------------------------------------------------

@router.post("/", response_model=Ingredient, status_code=201)
def create_ingredient(ingredient: IngredientCreate):
    """Add a new ingredient to the fridge."""
    # Convert Pydantic model to dict, removing None values
    data = ingredient.model_dump(exclude_none=True)

    # Convert date objects to ISO strings for Supabase
    if "expiry_date" in data and data["expiry_date"]:
        data["expiry_date"] = str(data["expiry_date"])

    response = supabase.table(TABLE).insert(data).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create ingredient")

    return response.data[0]


# ---------------------------------------------------------------------------
# PUT /ingredients/{id}  – update an ingredient
# ---------------------------------------------------------------------------

@router.put("/{ingredient_id}", response_model=Ingredient)
def update_ingredient(ingredient_id: int, ingredient: IngredientUpdate):
    """Update an existing ingredient. Only send the fields you want to change."""
    # Only include fields that were actually provided (not None)
    data = ingredient.model_dump(exclude_none=True)

    if not data:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    # Convert date objects to ISO strings
    if "expiry_date" in data and data["expiry_date"]:
        data["expiry_date"] = str(data["expiry_date"])

    response = supabase.table(TABLE).update(data).eq("id", ingredient_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    return response.data[0]


# ---------------------------------------------------------------------------
# DELETE /ingredients/{id}  – remove an ingredient
# ---------------------------------------------------------------------------

@router.delete("/{ingredient_id}", status_code=204)
def delete_ingredient(ingredient_id: int):
    """Remove an ingredient from the fridge."""
    response = supabase.table(TABLE).delete().eq("id", ingredient_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    # 204 No Content – nothing to return
    return None
