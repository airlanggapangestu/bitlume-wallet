# Gunakan base image yang ringan dan stabil
FROM python:3.10-slim

# Set workdir
WORKDIR /app

# Salin semua file ke dalam container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Jalankan Flask app
CMD ["python", "main.py"]
