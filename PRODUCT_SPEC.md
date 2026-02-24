# WhatNow — Product Specification
> Documento de referencia del producto. Última actualización: febrero 2026.

---

## Índice

1. [Concepto y propuesta de valor](#1-concepto-y-propuesta-de-valor)
2. [Usuario objetivo](#2-usuario-objetivo)
3. [Core features y APIs](#3-core-features-y-apis)
4. [Flujo principal de usuario](#4-flujo-principal-de-usuario)
5. [Modelo de datos](#5-modelo-de-datos)
6. [Stack técnico y arquitectura](#6-stack-técnico-y-arquitectura)

---

## 1. Concepto y propuesta de valor

### Una frase
> *"Dime cómo te sientes y te digo qué consumir — serie, libro, juego o peli."*

### Problema que resolvemos
La vida adulta deja poco tiempo para explorar. Las plataformas actuales ofrecen catálogos infinitos separados por formato. El resultado: el usuario gasta 40 minutos eligiendo y acaba viendo lo mismo de siempre, o consumiendo contenido mediocre.

El problema no es falta de contenido. Es **parálisis de elección** combinada con **poco tiempo para equivocarse**.

### Propuesta formal
WhatNow es la app para adultos con poco tiempo libre que no quieren desperdiciarlo eligiendo mal. En lugar de navegar por catálogos separados por formato, WhatNow entiende tus gustos, tu estado de ánimo y tu disponibilidad, y te dice exactamente qué ver, leer o jugar ahora mismo.

### Por qué es diferente

| App tradicional | WhatNow |
|---|---|
| "¿Qué serie ves?" | "¿Qué quieres sentir esta noche?" |
| Catálogo por formato | Recomendación por perfil |
| Tú navegas y decides | La app decide por ti |
| Un tipo de contenido | Todos los formatos mezclados |

### Los tres ejes del producto

```
QUIÉN eres       → perfil de gustos permanente
CÓMO estás       → estado de ánimo / tiempo disponible ahora
QUÉ te damos     → una recomendación concreta, no una lista
```

El output no es "aquí tienes 50 opciones". Es **"hoy te recomendamos esto, y aquí está el por qué"**.

---

## 2. Usuario objetivo

### Perfil principal — "El Adulto Ocupado"

```
Edad:        28–45 años
Situación:   Trabajo estable, posiblemente pareja/familia
Tiempo ocio: 1–3 horas al día, no siempre las mismas
Dinero:      Paga por Netflix, Spotify, Game Pass sin problema
Problema:    Gasta 40 min eligiendo y acaba viendo lo mismo de siempre
Formato:     Le da igual — no tiene preferencia por serie, libro o juego
```

### Jobs To Be Done

| Situación | Lo que necesita | Lo que hace hoy |
|---|---|---|
| Son las 22h, tiene 1h libre | Algo bueno que no le exija pensar | Scrollea Netflix 20 min y pone algo random |
| Fin de semana, 3h libres | Algo más inmersivo, que le enganche | Pregunta en grupos de WhatsApp |
| Quiere algo nuevo pero sin riesgo | Descubrir sin invertir tiempo en explorar | Ve la misma serie por tercera vez |
| Está cansado emocionalmente | Algo ligero, que desconecte | Abre YouTube sin intención |

### Lo que este usuario NO quiere
- Otro catálogo que navegar
- Listas de "los 100 mejores X"
- Que le pregunten 20 cosas antes de darle algo
- Registrar manualmente todo lo que ha visto

### Implicaciones de diseño
- El onboarding no puede preguntar por formatos — debe preguntar por emociones, géneros, sensaciones
- La recomendación debe justificarse por gusto, no por "es una serie de acción"
- El perfil se construye con lo que ha consumido, no con lo que declara que le gusta
- La UI no tiene secciones por formato — tiene secciones por estado de ánimo o tipo de experiencia

---

## 3. Core features y APIs

### Qué hace la app
1. Construye un perfil de gustos del usuario
2. Recoge su contexto actual (tiempo, estado de ánimo)
3. Consulta APIs externas para obtener contenido real
4. Genera una recomendación personalizada cross-formato
5. Aprende del feedback del usuario

### Qué NO hace la app
- No reproduce contenido — solo recomienda
- No gestiona suscripciones del usuario
- No es una red social (de momento)
- No garantiza disponibilidad en plataformas del usuario
- No cubre podcasts, música ni contenido corto (YouTube, TikTok)

### APIs por formato

#### Películas y Series → TMDB
- Búsqueda por título
- Géneros, keywords, ratings, trailers
- Endpoints clave:
  - `GET /search/movie`
  - `GET /movie/{id}/keywords`
  - `GET /movie/{id}/recommendations`
  - `GET /movie/{id}/similar`

#### Anime → AniList (GraphQL)
- Tags muy detalladas: "Cyberpunk", "Dystopian", "Psychological", "Mecha"
- Sistema de relaciones entre obras
- Más fino que TMDB para este formato

#### Videojuegos → RAWG
- Búsqueda por título
- Géneros, tags, juegos similares
- Más de 500k juegos indexados

#### Libros → Google Books
- Categorías y descripciones
- Cobertura y estabilidad superiores a alternativas
- Limitación: tags menos estructuradas que otros formatos

### Modelo común de contenido (normalización)
Todos los formatos se normalizan a esta estructura para que el motor de recomendación trabaje sobre un único modelo:

```json
{
  "id": "uuid",
  "title": "The Last of Us",
  "format": "series | movie | game | book",
  "genres": ["drama", "thriller", "post-apocalíptico"],
  "mood_tags": ["intenso", "emotivo", "inmersivo"],
  "duration_profile": "largo | medio | corto",
  "effort_required": "alto | medio | bajo",
  "rating": 9.2,
  "source_api": "tmdb",
  "external_id": "100088"
}
```

### Flujo de datos a alto nivel

```
Usuario describe gustos / contexto
        ↓
App construye query por formato
        ↓
  ┌──────┬──────┬─────────┬─────────┐
 TMDB  RAWG  GBooks  AniList
  └──────┴──────┴─────────┴─────────┘
        ↓
Resultado normalizado a modelo común
        ↓
Motor de recomendación selecciona y rankea
        ↓
App presenta 1–3 recomendaciones con contexto
```

---

## 4. Flujo principal de usuario

### Vista general

```
Registro → Onboarding → Recomendación → Feedback → Recomendación mejorada
                                              ↑__________________|
```

### Registro
Simple y sin fricción:
- Email + contraseña (o Google/Apple login)
- Nickname
- Nada más — el perfil se construye en el onboarding

### Onboarding — El cuestionario
Máximo 5–7 preguntas, visuales y rápidas. Objetivo: construir perfil inicial.

**Bloque 1 — Anclas (lo más importante)**
```
¿Cuál fue la última obra que te enganchó de verdad?
→ Campo de texto + búsqueda en APIs (título de serie, peli, juego o libro)
→ El usuario puede añadir hasta 3
→ Extrae géneros, mood, duración y profundidad sin preguntar explícitamente
```

**Bloque 2 — Géneros**
```
¿Qué tipo de historia te suele gustar?
→ Tarjetas visuales: Terror / Thriller / Drama / Comedia /
  Ciencia ficción / Fantasía / Romance / Acción / Documental
→ Selección múltiple, mínimo 2
```

**Bloque 3 — Consumo**
```
¿Cuánto tiempo libre tienes normalmente?
→ "Menos de 1h" / "1–2 horas" / "Más de 2 horas" / "Depende del día"

¿Qué plataformas tienes? (opcional, para priorizar)
→ Netflix / Game Pass / Kindle / PS5 / etc.
```

**Bloque 4 — Mood base**
```
¿Qué buscas normalmente cuando tienes tiempo libre?
→ Desconectar y relajarme
→ Que me enganche y no pueda parar
→ Aprender algo o que me haga pensar
→ Reírme o pasar un buen rato
```

**Lo que NO preguntamos en el onboarding:**
- Edad, sexo, país
- Formato preferido (no existe preferencia)
- Listas de lo que ya ha visto

### La recomendación

**UI de la tarjeta de recomendación:**
```
┌─────────────────────────────┐
│  [Imagen / Cover]           │
│                             │
│  Titulo                     │
│  Serie • Drama, Thriller    │
│                             │
│  "Te lo recomendamos porque │
│   te gustó Dark y buscas    │
│   algo que te enganche"     │
│                             │
│  ⭐ 9.1  •  ~45min/ep  •  3T │
│                             │
│  [ 👎 No me convence ]       │
│  [ 👍 Me apunto ]            │
│  [ ✅ Ya lo vi / jugué ]     │
└─────────────────────────────┘
```

**Reglas:**
- Se muestra 1 recomendación principal, no una lista
- Siempre incluye el "por qué" — clave para la confianza del usuario
- El usuario puede pedir otra si no le convence

### Feedback loop

| Acción | Señal | Peso |
|---|---|---|
| 👍 Me apunto | Le interesa, no lo ha visto | Alto |
| ✅ Ya lo vi + puntuación | Dato de gustos confirmado | Muy alto |
| 👎 No me convence | Negativo sobre ese item | Medio |
| 👎 + "¿Por qué?" | Negativo con contexto | Muy alto |
| Ignora la recomendación | Señal débil negativa | Bajo |
| Marca como completado | Confirma consumo real | Muy alto |

### Estados del contenido en el perfil

```
pendiente     → Le interesa, lo tiene en cola
descartado    → No le apetece (puede cambiar)
completado    → Lo ha consumido + puntuación
ignorado      → No ha reaccionado (señal débil)
```

### Actualización de pesos por feedback

```
👍 Like                        → género +0.2
✅ Completado + rating 5       → género +0.4
✅ Completado + rating 3       → género +0.1
✅ Completado + rating 1       → género -0.2
👎 Dislike                     → género -0.3
```

---

## 5. Modelo de datos

**Base de datos:** PostgreSQL

### Esquema

#### `users`
```sql
id              UUID PRIMARY KEY
email           VARCHAR UNIQUE
nickname        VARCHAR
created_at      TIMESTAMP
```

#### `user_profile`
```sql
id                  UUID PRIMARY KEY
user_id             UUID FK → users
available_time      ENUM('short', 'medium', 'long', 'variable')
primary_mood        ENUM('relax', 'hooked', 'learn', 'fun')
preferred_formats   VARCHAR[]     -- ['series', 'game', 'book', ...]
platforms           VARCHAR[]     -- ['netflix', 'gamepass', ...]
updated_at          TIMESTAMP
```

#### `content`
```sql
id                  UUID PRIMARY KEY
external_id         VARCHAR       -- id en la API de origen
source_api          VARCHAR       -- 'tmdb', 'rawg', 'google_books', 'anilist'
format              ENUM('movie', 'series', 'game', 'book', 'anime')
title               VARCHAR
description         TEXT
cover_url           VARCHAR
genres              VARCHAR[]
mood_tags           VARCHAR[]
duration_profile    ENUM('short', 'medium', 'long')
effort_required     ENUM('low', 'medium', 'high')
rating              DECIMAL
release_year        INTEGER
fetched_at          TIMESTAMP
```

#### `user_genre_weights`
El perfil dinámico. Aquí vive el algoritmo de aprendizaje.
```sql
id              UUID PRIMARY KEY
user_id         UUID FK → users
genre           VARCHAR       -- 'thriller', 'drama', 'sci-fi'...
weight          DECIMAL       -- empieza en 1.0, sube/baja con feedback
updated_at      TIMESTAMP
```

#### `user_content_interactions`
```sql
id              UUID PRIMARY KEY
user_id         UUID FK → users
content_id      UUID FK → content
status          ENUM('liked', 'disliked', 'completed', 'pending', 'ignored')
rating          INTEGER       -- 1–5, solo si status = 'completed'
dislike_reason  VARCHAR       -- opcional
interacted_at   TIMESTAMP
```

#### `recommendations`
```sql
id              UUID PRIMARY KEY
user_id         UUID FK → users
content_id      UUID FK → content
reason          TEXT          -- "Te lo recomendamos porque..."
was_accepted    BOOLEAN
recommended_at  TIMESTAMP
```

### Relaciones

```
users
  │
  ├── user_profile              (1:1)
  ├── user_genre_weights        (1:N)
  ├── user_content_interactions (1:N)
  └── recommendations           (1:N)
            │
            └── content         (N:1)
```

### Algoritmo de recomendación

```
1. Leer user_genre_weights del usuario
2. Filtrar content por genres con mayor peso
3. Excluir content con interacción previa
4. Ordenar por (weight * rating) descendente
5. Seleccionar top resultado, evitando el mismo formato dos veces seguidas
6. Guardar en recommendations
7. Tras la respuesta → actualizar user_genre_weights
```

---

## 6. Stack técnico y arquitectura

### Decisión de arquitectura — Opción C

El buscador por título no es el producto, es la forma de construir el perfil inicial:

```
Usuario escribe obra que le gustó ("Interstellar", "Dark")
        ↓
Buscamos en APIs → extraemos géneros, keywords, tono
        ↓
Normalizamos al modelo común
        ↓
Guardamos como ancla del perfil del usuario
        ↓
Buscamos correlaciones cross-formato
        ↓
Mostramos recomendación con el "por qué"
        ↓
Usuario da like/dislike → ajustamos pesos
```

### Stack

| Capa | Tecnología | Motivo |
|---|---|---|
| Frontend | Next.js + TypeScript | SSR, API Routes, escalabilidad |
| Estilos | TailwindCSS | UI rápida y limpia |
| Data fetching | TanStack Query | Caché de llamadas a APIs |
| Backend (MVP) | API Routes de Next.js | Suficiente sin sobreingeniería |
| Base de datos | PostgreSQL | Modelo relacional claro |
| APIs externas | TMDB, AniList, RAWG, Google Books | Cobertura de todos los formatos |
| IA | No en MVP — gancho preparado | Ver abajo |

### Arquitectura general

```
┌─────────────────────────────────────────────┐
│              Next.js + TypeScript            │
│                                             │
│  ┌──────────────┐    ┌────────────────────┐ │
│  │   Frontend   │    │    API Routes      │ │
│  │  TailwindCSS │◄──►│  (backend ligero)  │ │
│  │  TanStack Q  │    └────────┬───────────┘ │
│  └──────────────┘             │             │
└───────────────────────────────│─────────────┘
                                │
              ┌─────────────────┼──────────────────┐
              ▼                 ▼                  ▼
        PostgreSQL         APIs externas      (futuro) IA
        perfil +           TMDB / AniList     embeddings
        feedback           RAWG / GBooks      semánticos
```

### Gancho para IA futura

Diseñado desde el principio para añadir IA sin reescribir:

```typescript
async function rankResults(
  results: Content[],
  userProfile: UserProfile,
  queryEmbedding?: number[]   // ← gancho para IA semántica
): Promise<Content[]> {
  if (!queryEmbedding) {
    return basicWeightedSort(results, userProfile)
  }
  return semanticSimilaritySort(results, queryEmbedding)
}
```

Con IA se podrán interpretar búsquedas como:
- "algo oscuro y psicológico como Black Mirror"
- "fantasía medieval pero sin magia"
- "anime con protagonistas moralmente ambiguos"

Sin IA, el sistema funciona por correlación de géneros y keywords.

### Caché de resultados de APIs
- Primera búsqueda de una obra → se guarda en `content`
- Siguientes búsquedas → se sirve desde PostgreSQL
- No se vuelve a llamar a la API externa para la misma obra

---

## 7. MVP

### Contexto
Proyecto personal con objetivo de aprendizaje y portfolio. No hay urgencia de lanzamiento.

### Criterio de MVP
La mínima versión que demuestra que el concepto funciona: dado un perfil básico de usuario, devolver recomendaciones reales cross-formato con un "por qué".

### Qué entra

| Feature | Motivo |
|---|---|
| Registro y login | Necesario para persistir el perfil |
| Onboarding con cuestionario | Es el core del producto |
| TMDB + Google Books | Suficiente para demostrar cruce de formatos |
| Normalización al modelo común | El reto técnico más interesante |
| Recomendación con "por qué" | El valor diferencial visible |
| Like / Dislike | Cierra el loop y da dinamismo |
| Perfil dinámico con pesos | Lo que lo hace "inteligente" |

### Qué no entra en el MVP

| Feature | Motivo |
|---|---|
| AniList (anime) | Complejidad sin concepto nuevo |
| RAWG (videojuegos) | Mismo motivo — se añade en v2 |
| IA / embeddings semánticos | No necesario para validar el concepto |
| Disponibilidad en plataformas | Complejidad alta, valor secundario |
| Biblioteca personal detallada | Mejora experiencia, no el concepto |

### Orden de construcción

```
FASE 1 — Base del proyecto
├── Setup Next.js + TypeScript + TailwindCSS
├── PostgreSQL conectado
└── Autenticación básica con NextAuth

FASE 2 — Primera API funcionando
├── Integración con TMDB
├── Búsqueda por título → resultado normalizado
└── Guardar en tabla content

FASE 3 — Perfil de usuario
├── Onboarding (cuestionario)
├── Guardar user_profile y anclas iniciales
└── Calcular user_genre_weights iniciales

FASE 4 — Primera recomendación real
├── Algoritmo básico de ranking por pesos
├── Pantalla de recomendación con "por qué"
└── Like / Dislike → actualizar pesos

FASE 5 — Segunda API (Google Books)
├── Integración y normalización
├── Recomendación mezcla película/serie + libro
└── El concepto cross-formato queda demostrado

FASE 6 — Pulir
├── Estados del contenido (pendiente, completado...)
├── Edición de perfil
└── UI limpia y coherente
```

---

## Pendiente de definir

- [ ] **Interfaz** — wireframes y flujos de pantalla
- [ ] **Autenticación** — proveedor elegido para el MVP
- [ ] **Base de datos** — local con Docker o Supabase
- [ ] **Despliegue** — Vercel + Supabase / Railway / render.com
- [ ] **Monetización** — no aplica en esta fase
