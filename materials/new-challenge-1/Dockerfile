# Use a minimal Python base image
FROM python:3.10-slim

# Install `/usr/bin/time` for execution time & memory tracking
RUN apt-get update && apt-get install -y time && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app/sandbox

# run a simple python command
CMD ["python", "-c", "print('Hello, World!')"]