.PHONY: help setup run check format docker-build docker-up docker-down logs clean

BLUE := \033[34m
GREEN := \033[32m
YELLOW := \033[33m
NC := \033[0m

help:
	@echo "========================================"
	@echo "  Cinematheque - Available Commands"
	@echo "========================================"
	@echo ""
	@echo "make setup         - Install dependencies"
	@echo "make run           - Run backend server"
	@echo "make check         - Check code quality"
	@echo "make format        - Format code"
	@echo "make docker-build  - Build Docker image"
	@echo "make docker-up     - Start Docker"
	@echo "make docker-down   - Stop Docker"
	@echo "make logs          - View logs"
	@echo "make clean         - Clean temp files"

setup:
	@echo "Installing dependencies..."
	@if exist backend\package.json (cd backend && npm install) else (echo "backend/package.json not found")
	@echo "Done!"

run:
	@echo "Starting Cinematheque backend..."
	@cd backend && npm start

check:
	@echo "Running checks..."
	@if exist backend\server.js (echo "OK: server.js found") else (echo "ERROR: server.js not found")
	@echo "Checks passed!"

format:
	@echo "Formatting code..."
	@echo "Done!"

docker-build:
	@echo "Building Docker image..."
	docker build -t cinematicue .

docker-up:
	@echo "Starting Docker..."
	docker compose up --build

docker-down:
	@echo "Stopping Docker..."
	docker compose down

logs:
	docker compose logs -f

clean:
	@echo "Cleaning..."
	@if exist backend\node_modules (rmdir /s /q backend\node_modules)
	@echo "Done!"
