#!/bin/bash
# Panacea Portal Development Setup Verification Script
# Usage: bash VERIFY_SETUP.sh

echo "🔍 Panacea Portal Setup Verification"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# 1. Check Node.js
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    ((ERRORS++))
fi
echo ""

# 2. Check PostgreSQL
echo "2️⃣  Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    echo -e "${GREEN}✅ PostgreSQL installed: $PSQL_VERSION${NC}"

    # Check if running and database exists
    if psql -U postgres -d panacea_dev -c "SELECT 1" &> /dev/null; then
        echo -e "${GREEN}✅ PostgreSQL running and database 'panacea_dev' accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  PostgreSQL may not be running or database not set up${NC}"
        echo "   Try: createdb -U postgres panacea_dev"
    fi
else
    echo -e "${RED}❌ PostgreSQL not found${NC}"
    ((ERRORS++))
fi
echo ""

# 3. Check Frontend environment
echo "3️⃣  Checking Frontend environment..."
if [ -f "frontend/.env.local" ]; then
    echo -e "${GREEN}✅ frontend/.env.local exists${NC}"

    # Check required variables
    if grep -q "NEXT_PUBLIC_API_BASE_URL" frontend/.env.local; then
        echo -e "${GREEN}✅ NEXT_PUBLIC_API_BASE_URL configured${NC}"
    else
        echo -e "${RED}❌ NEXT_PUBLIC_API_BASE_URL missing${NC}"
        ((ERRORS++))
    fi

    if grep -q "NODE_ENV" frontend/.env.local; then
        echo -e "${GREEN}✅ NODE_ENV configured${NC}"
    else
        echo -e "${YELLOW}⚠️  NODE_ENV not found (optional)${NC}"
    fi
else
    echo -e "${RED}❌ frontend/.env.local not found${NC}"
    ((ERRORS++))
fi
echo ""

# 4. Check Backend environment
echo "4️⃣  Checking Backend environment..."
if [ -f "panacea-api/.env.local" ]; then
    echo -e "${GREEN}✅ panacea-api/.env.local exists${NC}"

    # Check required variables
    REQUIRED_VARS=("DATABASE_URL" "JWT_SECRET" "MAILTRAP_API_TOKEN" "FRONTEND_URL")
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=" panacea-api/.env.local; then
            echo -e "${GREEN}✅ $var configured${NC}"
        else
            echo -e "${RED}❌ $var missing${NC}"
            ((ERRORS++))
        fi
    done
else
    echo -e "${RED}❌ panacea-api/.env.local not found${NC}"
    ((ERRORS++))
fi
echo ""

# 5. Check npm packages
echo "5️⃣  Checking npm dependencies..."
if [ -f "frontend/package-lock.json" ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend dependencies not installed (run: cd frontend && npm install)${NC}"
fi

if [ -f "panacea-api/package-lock.json" ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Backend dependencies not installed (run: cd panacea-api && npm install)${NC}"
fi
echo ""

# 6. Check Prisma
echo "6️⃣  Checking Prisma status..."
cd panacea-api
if npx prisma migrate status &> /dev/null; then
    echo -e "${GREEN}✅ Prisma migrations synced${NC}"
else
    echo -e "${YELLOW}⚠️  Prisma migrations may need deployment (run: npx prisma migrate deploy)${NC}"
fi
cd ..
echo ""

# Summary
echo "===================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed!${NC}"
    echo ""
    echo "To start development:"
    echo "  Terminal 1: cd panacea-api && npm run dev"
    echo "  Terminal 2: cd frontend && npm run dev"
    echo ""
    echo "Access:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend:  http://localhost:4000"
else
    echo -e "${RED}❌ $ERRORS issue(s) found${NC}"
    echo "Please fix the above issues and re-run this script"
fi
echo ""
