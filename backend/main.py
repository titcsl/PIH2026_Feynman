import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from db import get_connection
from crypto import generate_quantum_key, encrypt_data, decrypt_data

load_dotenv()

app = FastAPI(title="Quantum Wall")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
def home():

    return {
        "message": "pong",
    }

class Payload(BaseModel):
    id: str
    data: str

@app.post("/encrypt")
def encrypt(payload: Payload):

    start = time.perf_counter()

    key = generate_quantum_key()
    encrypted = encrypt_data(payload.data, key)

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO secure_storage (id, encrypted_data) VALUES (%s, %s)",
        (payload.id, encrypted)
    )

    conn.close()

    total_time = (time.perf_counter() - start) * 1000

    return {
        "status": "stored",
        "processing_time_ms": round(total_time, 3)
    }




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("APP_HOST"),
        port=int(os.getenv("APP_PORT")),
        reload=True
    )