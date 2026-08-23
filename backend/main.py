from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from database import get_db_connection
from routers.auth import router as auth_router
from routers.vehicles import router as vehicles_router
from dependencies import get_current_user


app = FastAPI(title="Car Dealership Inventory System")


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Authentication routes
app.include_router(auth_router)

# Vehicle routes
app.include_router(vehicles_router)


@app.get("/")
def home():
    return {
        "message": "Car Dealership API is running"
    }


@app.get("/api/test-db")
def test_database():
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("SELECT DATABASE()")
    result = cursor.fetchone()

    cursor.close()
    db.close()

    return {
        "message": "Database connected successfully",
        "database": result[0]
    }


@app.get("/api/protected")
def protected_route(
    current_user=Depends(get_current_user)
):
    return {
        "message": "You are authenticated",
        "user": current_user
    }