# Configuración para crear usuario de prueba

## Paso 1: Configurar la base de datos

### 1.1 Obtener credenciales de Supabase

1. Ve a https://supabase.com y logéate
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **Project Settings** → **Database** → **Connection string**
4. Copia el string URI (debe parecer algo como):
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 1.2 Configurar el .env

Abre el archivo `.env` en la raíz del proyecto y reemplaza `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

NEXTAUTH_SECRET="tu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"

TMDB_API_KEY="1a8a5cbbb840a5efbbcc9d60073c9fc1"
GOOGLE_BOOKS_API_KEY="AIzaSyBokse3gNpFDFa1M-kT8waffxgiXGSJpM0"
```

> **⚠️ IMPORTANTE**: Genera un NEXTAUTH_SECRET con:
> ```powershell
> openssl rand -base64 32
> ```

## Paso 2: Ejecutar las migraciones

En la terminal (PowerShell), ejecuta:

```powershell
npx prisma migrate dev --name init
```

Esto:
- ✅ Crea todas las tablas en PostgreSQL
- ✅ Aplica el schema de Prisma
- ✅ Genera el cliente de Prisma

## Paso 3: Crear usuario de prueba

Una vez completada la migración, ejecuta:

```powershell
npx tsx scripts/create-test-user.ts
```

**Deberías ver algo como:**
```
═══════════════════════════════════════════════════════════
         Creando usuario de prueba en WhatNow
═══════════════════════════════════════════════════════════

✅ Usuario de prueba creado exitosamente:

   📧 Email:      test@whatnow.com
   🔐 Contraseña: Test123456!
   👤 Nickname:   TestUser
   🆔 ID:         cm2a5xyz...

📝 Copia estas credenciales para probar la app.
```

## Paso 4: Acceder a la app

### En desarrollo local:

1. Inicia el servidor:
   ```powershell
   npm run dev
   ```

2. Abre http://localhost:3000

3. Haz clic en "¿No tienes cuenta? Regístrate"

4. O ve directamente a http://localhost:3000/login

5. Usa las credenciales:
   - **Email:** test@whatnow.com
   - **Contraseña:** Test123456!

6. Después del login, completarás el onboarding (4 pasos)

7. Al final irás al dashboard

### Acceso a la base de datos (Prisma Studio):

Para ver/modificar los datos en la BD directamente:

```powershell
npx prisma studio
```

Se abrirá en http://localhost:5555 con una interfaz visual para:
- Ver todos los usuarios
- Ver UserProfile
- Ver UserGenreWeight
- Ver Content
- Y más...

## Paso 5: Probar el flujo completo

### Opción A: Con usuario de prueba
1. Login con test@whatnow.com / Test123456!
2. Completa los 4 pasos del onboarding
3. Verás el dashboard

### Opción B: Crear un usuario nuevo
1. Ve a http://localhost:3000/register
2. Crea una cuenta con email y contraseña
3. Se te redirigirá al login automáticamente
4. Inicia sesión
5. Completa el onboarding

## Solución de problemas

### Error: "No se puede conectar a la base de datos"
- Verifica que DATABASE_URL está correcta en .env
- Asegúrate de que tus credenciales de Supabase son válidas
- Prueba la conexión en Supabase directamente

### Error: "Tablas no existen"
- Ejecuta: `npx prisma migrate dev --name init`
- Si seguía dando error, ejecuta: `npx prisma db push`

### Error: "NEXTAUTH_SECRET no está definido"
- Genera uno: `openssl rand -base64 32`
- Ponlo en .env como: `NEXTAUTH_SECRET="el-valor-generado"`

### Error: "No se encuentra el script"
- Asegúrate de estar en la carpeta raíz del proyecto
- Si falta instalación: `npm install`
- Luego: `npx tsx scripts/create-test-user.ts`

## Próximos pasos

Una vez hayas probado que todo funciona:
1. Fase 2: Implementar algoritmo de recomendación
2. Fase 3: Crear pantalla de recomendación
3. Fase 4: Sistema de like/dislike y feedback
