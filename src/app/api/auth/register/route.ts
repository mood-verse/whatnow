import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password, nickname } = await request.json();

    // Validaciones básicas
    if (!email || !password || !nickname) {
      return NextResponse.json(
        { error: "Email, contraseña y nickname son requeridos" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El email no es válido" },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Validar longitud de nickname
    if (nickname.length < 2 || nickname.length > 30) {
      return NextResponse.json(
        { error: "El nickname debe tener entre 2 y 30 caracteres" },
        { status: 400 }
      );
    }

    // Normalizar email (convertir a minúsculas)
    const normalizedEmail = email.toLowerCase().trim();

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: nickname.trim(),
      },
    });

    return NextResponse.json(
      { 
        message: "Usuario registrado exitosamente",
        userId: user.id,
        email: user.email 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    
    // Manejo específico de errores de Prisma
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        return NextResponse.json(
          { error: "Este email ya está registrado" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error al crear la cuenta. Intenta de nuevo." },
      { status: 500 }
    );
  }
}