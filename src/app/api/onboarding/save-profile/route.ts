import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const { anchors, genres, availableTime, platforms, primaryMood } =
      await request.json();

    // Validar datos
    if (!genres || genres.length < 2) {
      return NextResponse.json(
        { error: "Debes seleccionar al menos 2 géneros" },
        { status: 400 }
      );
    }

    if (!availableTime || !primaryMood) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Crear o actualizar perfil
    const userProfile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        availableTime,
        primaryMood,
        preferredFormats: ["MOVIE", "SERIES", "BOOK"], // Por defecto todos
        platforms: platforms || [],
      },
      update: {
        availableTime,
        primaryMood,
        platforms: platforms || [],
        updatedAt: new Date(),
      },
    });

    // Crear pesos de géneros iniciales
    // Primero eliminar pesos existentes
    await prisma.userGenreWeight.deleteMany({
      where: { userId: user.id },
    });

    // Crear pesos nuevos
    const genreWeights = genres.map((genre: string) => ({
      userId: user.id,
      genre,
      weight: 1.0, // Peso inicial
    }));

    await prisma.userGenreWeight.createMany({
      data: genreWeights,
    });

    // Aquí se podrían procesar los anchors para extraer géneros
    // pero por MVP solo guardamos lo que seleccionó le usuario

    return NextResponse.json(
      {
        message: "Perfil guardado exitosamente",
        profileId: userProfile.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en onboarding:", error);
    return NextResponse.json(
      { error: "Error al guardar el perfil" },
      { status: 500 }
    );
  }
}
