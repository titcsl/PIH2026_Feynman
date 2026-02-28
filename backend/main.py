import os
import time
from dotenv import load_dotenv

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
    return {"message": "pong"}


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
        "INSERT INTO secure_storage (id, encrypted_data, encryption_key) VALUES (%s, %s, %s)",
        (payload.id, encrypted, key)
    )

    conn.close()

    total_time = (time.perf_counter() - start) * 1000

    return {
        "status": "stored",
        "processing_time_ms": round(total_time, 3)
    }



@app.get("/decrypt/{item_id}")
def decrypt(item_id: str):

    start = time.perf_counter()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT encrypted_data, encryption_key FROM secure_storage WHERE id=%s",
        (item_id,)
    )

    result = cursor.fetchone()
    conn.close()

    if not result:
        raise HTTPException(status_code=404, detail="Not found")

    encrypted_data = result[0]
    key = result[1]

    decrypted = decrypt_data(encrypted_data, key)

    total_time = (time.perf_counter() - start) * 1000

    return {
        "decrypted_data": decrypted,
        "processing_time_ms": round(total_time, 3),
        "actual_encrypted_data": encrypted_data
    }