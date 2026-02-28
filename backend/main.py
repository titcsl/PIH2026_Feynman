import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException


load_dotenv()

app = FastAPI(title="Quantum Wall")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/home")
def home():

    return {
        "status": "success",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("APP_HOST"),
        port=int(os.getenv("APP_PORT")),
        reload=True
    )