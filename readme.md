# THE QUANTUM WALL

## Problem Statement

Today, in many applications, certain types of data, like authentication tokens, personal identifiable information, and confidential information, are stored directly in the database. This, however, poses a huge security risk. In case the database is compromised or leaked, the stored information will be exposed in plaintext form. This will result in severe privacy violations, along with security threats of many different types.

## Solution Overview

The Quantum Wall is a middleware security component that encrypts critical information before storing it in the database. This provides an application-layer encryption boundary, ensuring that if the database is compromised, the stored information will be encrypted and will not be readable.

The Quantum Wall does not rely on database security. It provides security for the stored information by encrypting it at the API level. This minimizes the effects of any potential data breach.

## How It Works

1.  The client sends information to the backend API.
2.  It uses quantum-inspired entropy to generate an encryption key.
3.  It uses AES-based encryption to encrypt the information.
4.  It stores only the encrypted information in the MySQL database.
5.  It decrypts the information when required.

Note: For this demo, encryption keys are stored in the database. A production deployment should use a dedicated Key Management System (KMS).

## Security Model
- No data in plaintext will be stored in the database.
- Encryption will be done at the application level.
- Even if the database gets leaked, users will not be able to access the data.
- It demonstrates the mitigation of data breach impact by using encryption.

Note: For demonstration purposes, the encryption key will be stored securely in the database. In actual use cases, a Key Management System (KMS) should be used.

## Tech Stack
### Backend
FastAPI
Cryptography
Qiskit
MySQL

### Frontend
Vite
### Infrastructure
Linux VPS
Nginx
### Backend
- Encryption code will be written.
- Quantum Wall security layer will be implemented.
- API will be written to handle encryption and decryption.

### Frontend
- Frontend UI will be built using Vite.
- Encryption and decryption will be done.
- Processing time will be shown.

## API Endpoints

### GET /ping
This is a health check endpoint.

### POST /encrypt
This endpoint is used for encrypting the data.

**Example Request**
```json
{
  "id": "123",
  "data": "Sensitive Information"
}
```

### GET /decrypt/{id}
This endpoint is used for decrypting the data.

## Deployment Status

**Frontend**
https://whatsgoinon.space/

**Backend API Docs**
https://backend.whatsgoinon.space/docs

**Deployment**
- Hosted on a Linux VPS
- Using Nginx as a reverse proxy server
- Using FastAPI for the backend
- Using a separate server for the frontend

## Conclusion
Quantum Wall is an application development technique that is centered on the security of the application. It is focused on the security of the application, especially when it comes to the information that is crucial to the application but has not yet reached the database. This has the advantage of reducing the risks associated with database breaches, hence making the application more secure.

The application has also shown that cryptographic methods are essential in application development.