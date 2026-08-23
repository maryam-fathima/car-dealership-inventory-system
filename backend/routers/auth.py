from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_db_connection
from auth import hash_password, verify_password, create_access_token

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


class RegisterUser(BaseModel):
    username: str
    password: str


class LoginUser(BaseModel):
    username: str
    password: str


@router.post("/register")
def register_user(user: RegisterUser):

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE username = %s",
        (user.username,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        db.close()
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    hashed_password = hash_password(user.password)

    cursor.execute(
        """
        INSERT INTO users (username, password)
        VALUES (%s, %s)
        """,
        (user.username, hashed_password)
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "User registered successfully"
    }


@router.post("/login")
def login_user(user: LoginUser):

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE username = %s",
        (user.username,)
    )

    existing_user = cursor.fetchone()

    cursor.close()
    db.close()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    access_token = create_access_token({
        "user_id": existing_user["id"],
        "username": existing_user["username"],
        "role": existing_user["role"]
    })

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }
