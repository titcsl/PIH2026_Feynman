import base64
import hashlib
from cryptography.fernet import Fernet
from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer

backend = Aer.get_backend("aer_simulator")

def generate_quantum_key():
    qc = QuantumCircuit(4, 4)
    qc.h(range(4))
    qc.measure(range(4), range(4))

    qc_compiled = transpile(qc, backend)
    result = backend.run(qc_compiled, shots=1).result()
    counts = result.get_counts()

    bits = list(counts.keys())[0]
    return hashlib.sha256(bits.encode()).digest()


def encrypt_data(data: str, key: bytes):
    fernet_key = base64.urlsafe_b64encode(key)
    f = Fernet(fernet_key)
    return f.encrypt(data.encode())

def decrypt_data(token: bytes, key: bytes):
    fernet_key = base64.urlsafe_b64encode(key)
    f = Fernet(fernet_key)
    return f.decrypt(token).decode()