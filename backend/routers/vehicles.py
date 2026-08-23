from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database import get_db_connection
from dependencies import get_current_user

router = APIRouter(
    prefix="/api/vehicles",
    tags=["Vehicles"]
)


class VehicleCreate(BaseModel):
    make: str
    model: str
    category: str
    price: float
    quantity: int


@router.post("/")
def create_vehicle(
    vehicle: VehicleCreate,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO vehicles
        (make, model, category, price, quantity)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (
            vehicle.make,
            vehicle.model,
            vehicle.category,
            vehicle.price,
            vehicle.quantity
        )
    )

    db.commit()

    vehicle_id = cursor.lastrowid

    cursor.close()
    db.close()

    return {
        "message": "Vehicle added successfully",
        "vehicle_id": vehicle_id
    }
@router.get("/")
def get_vehicles(
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT id, make, model, category, price, quantity, created_at
        FROM vehicles
        WHERE quantity > 0
        """
    )

    vehicles = cursor.fetchall()

    cursor.close()
    db.close()

    return {
        "vehicles": vehicles
    }
@router.get("/search")
def search_vehicles(
    make: str | None = None,
    model: str | None = None,
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    query = """
        SELECT id, make, model, category, price, quantity, created_at
        FROM vehicles
        WHERE quantity > 0
    """

    params = []

    if make:
        query += " AND make LIKE %s"
        params.append(f"%{make}%")

    if model:
        query += " AND model LIKE %s"
        params.append(f"%{model}%")

    if category:
        query += " AND category LIKE %s"
        params.append(f"%{category}%")

    if min_price is not None:
        query += " AND price >= %s"
        params.append(min_price)

    if max_price is not None:
        query += " AND price <= %s"
        params.append(max_price)

    cursor.execute(query, tuple(params))

    vehicles = cursor.fetchall()

    cursor.close()
    db.close()

    return {
        "vehicles": vehicles
    }
class VehicleUpdate(BaseModel):
    make: str
    model: str
    category: str
    price: float
    quantity: int


@router.put("/{vehicle_id}")
def update_vehicle(
    vehicle_id: int,
    vehicle: VehicleUpdate,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    cursor = db.cursor()

    # Check whether vehicle exists
    cursor.execute(
        "SELECT id FROM vehicles WHERE id = %s",
        (vehicle_id,)
    )

    existing_vehicle = cursor.fetchone()

    if not existing_vehicle:
        cursor.close()
        db.close()

        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    # Update vehicle
    cursor.execute(
        """
        UPDATE vehicles
        SET make = %s,
            model = %s,
            category = %s,
            price = %s,
            quantity = %s
        WHERE id = %s
        """,
        (
            vehicle.make,
            vehicle.model,
            vehicle.category,
            vehicle.price,
            vehicle.quantity,
            vehicle_id
        )
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "Vehicle updated successfully",
        "vehicle_id": vehicle_id
    }
@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    current_user=Depends(get_current_user)
):
    # Only admin can delete vehicles
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    db = get_db_connection()
    cursor = db.cursor()

    # Check whether vehicle exists
    cursor.execute(
        "SELECT id FROM vehicles WHERE id = %s",
        (vehicle_id,)
    )

    existing_vehicle = cursor.fetchone()

    if not existing_vehicle:
        cursor.close()
        db.close()

        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    cursor.execute(
        "DELETE FROM vehicles WHERE id = %s",
        (vehicle_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "Vehicle deleted successfully",
        "vehicle_id": vehicle_id
    }
@router.post("/{vehicle_id}/purchase")
def purchase_vehicle(
    vehicle_id: int,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    # Check vehicle
    cursor.execute(
        "SELECT * FROM vehicles WHERE id = %s",
        (vehicle_id,)
    )

    vehicle = cursor.fetchone()

    if not vehicle:
        cursor.close()
        db.close()

        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    # Check stock
    if vehicle["quantity"] <= 0:
        cursor.close()
        db.close()

        raise HTTPException(
            status_code=400,
            detail="Vehicle is out of stock"
        )

    # Decrease quantity
    cursor.execute(
        """
        UPDATE vehicles
        SET quantity = quantity - 1
        WHERE id = %s
        """,
        (vehicle_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "Vehicle purchased successfully",
        "vehicle_id": vehicle_id,
        "remaining_quantity": vehicle["quantity"] - 1
    }
@router.post("/{vehicle_id}/restock")
def restock_vehicle(
    vehicle_id: int,
    quantity: int,
    current_user=Depends(get_current_user)
):
    # Only admin can restock
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    # Quantity must be positive
    if quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Restock quantity must be greater than 0"
        )

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    # Check vehicle exists
    cursor.execute(
        "SELECT id, quantity FROM vehicles WHERE id = %s",
        (vehicle_id,)
    )

    vehicle = cursor.fetchone()

    if not vehicle:
        cursor.close()
        db.close()

        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    # Increase quantity
    cursor.execute(
        """
        UPDATE vehicles
        SET quantity = quantity + %s
        WHERE id = %s
        """,
        (quantity, vehicle_id)
    )

    db.commit()

    new_quantity = vehicle["quantity"] + quantity

    cursor.close()
    db.close()

    return {
        "message": "Vehicle restocked successfully",
        "vehicle_id": vehicle_id,
        "added_quantity": quantity,
        "new_quantity": new_quantity
    }
