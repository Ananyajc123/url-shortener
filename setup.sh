#!/bin/bash
# Run this once to set up everything on Mac

echo "🚀 Setting up URL Shortener..."

# Check Java
if ! java -version 2>&1 | grep -q "17\|18\|19\|20\|21"; then
  echo "❌ Java 17+ required. Install from https://adoptium.net/"
  exit 1
fi
echo "✅ Java found"

# Check PostgreSQL
if ! pg_isready > /dev/null 2>&1; then
  echo "Installing PostgreSQL..."
  brew install postgresql@15
  brew services start postgresql@15
fi
echo "✅ PostgreSQL running"

# Create database
psql postgres -c "CREATE DATABASE urlshortener;" 2>/dev/null || echo "Database already exists"
echo "✅ Database ready"

# Check Redis
if ! redis-cli ping > /dev/null 2>&1; then
  echo "Installing Redis..."
  brew install redis
  brew services start redis
fi
echo "✅ Redis running"

# Install frontend deps
echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..
echo "✅ Frontend ready"

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start backend:  ./mvnw spring-boot:run"
echo "To start frontend: cd frontend && npm start"
