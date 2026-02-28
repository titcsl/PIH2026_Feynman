### THE QUANTUM WALL


## Problem Statement

In today’s applications, sensitive data such as authentication tokens, personal data, and confidential data are stored in the database, which creates a significant security risk since if the database gets compromised or leaked, the data will be at risk of being disclosed in plaintext, resulting in a major privacy breach and risk to the system

## Problem Description

Quantum Wall is middleware security software designed to encrypt critical information before it reaches the database, ensuring that in case of database compromise, the stored information will be secure. It provides an encryption boundary for applications, enhancing the security of information using robust encryption techniques, including those based on quantum physics, to minimize the effects of possible data breaches in modern systems.

## Tech Stack

FastAPI (Backend)

MySQL (Database)

Cryptography (AES encryption)

Qiskit (Quantum-inspired entropy simulation)

Vite (Frontend)

## Project Structure

# Backend

    Contains the core encryption logic.

    Implements the Quantum Wall security layer.

    Handles API endpoints for encrypting and decrypting data.

    Integrates with MySQL for secure encrypted storage.

# Frontend

    Provides the user interface.

    Allows users to send data for encryption and retrieve decrypted data.

    Displays processing time and system responses.