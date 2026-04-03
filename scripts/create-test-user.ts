import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function createTestUser() {
  try {
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("         Creando usuario de prueba en WhatNow");
    console.log("═══════════════════════════════════════════════════════════\n");

    const email = "test@whatnow.com";
    const password = "Test123456!";
    const nickname = "TestUser";

    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("✅ Usuario de prueba ya existe:\n");
      console.log(`   Email: ${email}`);
      console.log(`   Contraseña: ${password}\n`);
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

    console.log("✅ Usuario de prueba creado exitosamente:\n");
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
