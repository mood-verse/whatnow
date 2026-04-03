#!/bin/bash
# Script para crear un usuario de prueba

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}         Creando usuario de prueba en WhatNow${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Ejecutar script de Prisma
npx tsx << 'EOF'
import { prisma } from "./src/lib/prisma";
import bcrypt from "bcryptjs";

async function createTestUser() {
  try {
    const email = "test@whatnow.com";
    const password = "Test123456!";
    const nickname = "TestUser";

    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("\n✅ Usuario de prueba ya existe:");
      console.log(`   Email: ${email}`);
      console.log(`   Contraseña: ${password}`);
      return;
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: nickname,
      },
    });

    console.log("\n✅ Usuario de prueba creado exitosamente:\n");
    console.log(`   📧 Email:      ${email}`);
    console.log(`   🔐 Contraseña: ${password}`);
    console.log(`   👤 Nickname:   ${nickname}`);
    console.log(`   🆔 ID:         ${user.id}\n`);
    console.log("📝 Copia estas credenciales para probar la app.\n");
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
EOF

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
