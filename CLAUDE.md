# WhatNow — Guía para agentes de IA

Este documento es la fuente de verdad del proyecto. Léelo completo antes de tocar cualquier archivo.
Para el diseño de producto completo, consulta `PRODUCT_SPEC.md`.

---

## Qué es esta app

Recomendador de ocio cross-formato (películas, series, libros — videojuegos y anime en v2).
El eje no es el formato sino los gustos del usuario. La app aprende con cada like/dislike.
Usuario objetivo: adulto con trabajo, poder adquisitivo y poco tiempo para elegir.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 + TypeScript |
| Estilos | TailwindCSS |
| ORM | Prisma v6 |
| Base de datos | PostgreSQL en Supabase |
| Auth | NextAuth.js v4 + PrismaAdapter |
| APIs externas | TMDB (películas/series), Google Books (libros) |

---

## Variables de entorno necesarias

Copiar `.env.example` a `.env` y rellenar:

```
DATABASE_URL        → Supabase: Project Settings → Database → Connection string → URI
NEXTAUTH_SECRET     → Generar con: openssl rand -base64 32
NEXTAUTH_URL        → http://localhost:3000 en local
TMDB_API_KEY        → https://www.themoviedb.org/settings/api
GOOGLE_BOOKS_API_KEY → https://console.cloud.google.com
```

---

## Cómo arrancar el proyecto

```bash
npm install
# Asegúrate de tener .env configurado antes de continuar
npx prisma migrate dev     # aplica el schema a la BD
npx prisma generate        # genera el cliente de Prisma
npm run dev                # arranca en http://localhost:3000
```

---

## Estructura del proyecto

```
src/
  app/                  → App Router de Next.js
    api/
      auth/
        [...nextauth]/  → Endpoint de NextAuth (pendiente de crear)
  lib/
    prisma.ts           → Cliente de Prisma (singleton)
    auth.ts             → Configuración de NextAuth
  generated/
    prisma/             → Cliente generado por Prisma (no editar)
prisma/
  schema.prisma         → Schema de la base de datos
.env                    → Variables de entorno (NO subir a git)
.env.example            → Plantilla de variables (sí subir a git)
PRODUCT_SPEC.md         → Diseño completo del producto
CLAUDE.md               → Este archivo
```

---

## Estado actual del proyecto

### Fase 1 — Base del proyecto → EN PROGRESO

#### Completado
- [x] Next.js 15 + TypeScript + TailwindCSS scaffoldeado
- [x] Prisma inicializado con PostgreSQL
- [x] Schema de Prisma completo (todos los modelos del producto + modelos de NextAuth)
- [x] `src/lib/prisma.ts` — cliente Prisma singleton
- [x] `src/lib/auth.ts` — configuración NextAuth con PrismaAdapter y CredentialsProvider
- [x] `.env.example` creado y documentado
- [x] `.env` en `.gitignore`

#### Pendiente (continuar desde aquí)
- [ ] Crear `src/app/api/auth/[...nextauth]/route.ts` — endpoint de NextAuth
- [ ] Instalar `bcryptjs` y `@types/bcryptjs` para hashear contraseñas
- [ ] Crear API route `POST /api/auth/register` para registro de usuarios
- [ ] Ejecutar `npx prisma migrate dev --name init` una vez configurado el `.env`
- [ ] Verificar que NextAuth funciona con una página de login básica

### Fases siguientes (no empezar hasta completar Fase 1)

- **Fase 2** — Integración TMDB: búsqueda por título → normalización → guardar en `Content`
- **Fase 3** — Onboarding: cuestionario de gustos → guardar `UserProfile` + `UserGenreWeight`
- **Fase 4** — Recomendación: algoritmo de ranking por pesos + pantalla con "por qué" + like/dislike
- **Fase 5** — Google Books: segunda API, cruce de formatos real
- **Fase 6** — Pulido: estados de contenido, edición de perfil, UI coherente

---

## Modelo de datos (resumen)

```
User (NextAuth)
  ├── UserProfile        (1:1)  — perfil base del onboarding
  ├── UserGenreWeight    (1:N)  — pesos dinámicos por género (el algoritmo vive aquí)
  ├── UserContentInteraction (1:N) — historial de likes, dislikes, completados
  └── Recommendation     (1:N)  — historial de qué se recomendó y si fue aceptado
            └── Content  (N:1)  — catálogo normalizado de APIs externas
```

Schema completo en `prisma/schema.prisma`.

---

## Lógica del algoritmo de recomendación

```
1. Leer UserGenreWeight del usuario
2. Filtrar Content por genres con mayor weight
3. Excluir Content con interacción previa (liked, disliked, completed)
4. Ordenar por (weight × rating) descendente
5. Evitar el mismo format dos veces seguidas
6. Guardar resultado en Recommendation
7. Tras respuesta del usuario → actualizar UserGenreWeight

Pesos:
👍 Like                  → +0.2
✅ Completado rating 5   → +0.4
✅ Completado rating 3   → +0.1
✅ Completado rating 1   → -0.2
👎 Dislike               → -0.3
```

---

## APIs externas

### TMDB (películas y series)
- Base URL: `https://api.themoviedb.org/3`
- Auth: query param `?api_key=TMDB_API_KEY`
- Endpoints que usaremos:
  - `GET /search/movie?query={título}`
  - `GET /search/tv?query={título}`
  - `GET /movie/{id}/keywords`
  - `GET /movie/{id}/recommendations`

### Google Books (libros)
- Base URL: `https://www.googleapis.com/books/v1`
- Auth: query param `?key=GOOGLE_BOOKS_API_KEY`
- Endpoints que usaremos:
  - `GET /volumes?q={título o género}`

### Normalización
Todo el contenido externo se mapea al modelo `Content` antes de guardarse.
Ver campos completos en `prisma/schema.prisma`.

---

## Decisiones de arquitectura tomadas

- **Opción C**: el buscador por título es la forma de construir el perfil inicial, no el producto en sí
- **No hay IA en MVP** — el gancho está preparado en la función de ranking (parámetro `queryEmbedding?`)
- **NextAuth con JWT** (no database sessions) para simplificar
- **CredentialsProvider** en MVP — se puede añadir Google OAuth en v2
- **Supabase** como host de PostgreSQL — el schema se gestiona con Prisma Migrate, no con Supabase directamente
- **No usar MongoDB** — el modelo es relacional y se beneficia de PostgreSQL

---

## Notas importantes

- La carpeta `[...nextauth]` es una convención de Next.js App Router, no una ruta local del sistema
- `src/generated/prisma/` está en `.gitignore` — cada desarrollador debe ejecutar `npx prisma generate`
- El `.env` nunca se sube a git — usar `.env.example` como referencia
- Cada compañero necesita su propia cuenta de Supabase o compartir credenciales por canal seguro
