# Script para configurar la BD y crear usuario de prueba
# Uso: .\scripts\setup-test-env.ps1

Write-Host "`n" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "   Setup WhatNow — Base de datos y usuario de prueba" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Blue

# Verificar que estamos en la carpeta correcta
if (-not (Test-Path ".\package.json")) {
    Write-Host "❌ Error: Este script debe ejecutarse desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Paso 1: Verificar .env
Write-Host "📋 Paso 1: Verificando .env..." -ForegroundColor Yellow
if (-not (Test-Path ".\.env")) {
    Write-Host "❌ Error: No se encontró .env" -ForegroundColor Red
    Write-Host "   Copia .env.example a .env y configura DATABASE_URL" -ForegroundColor Yellow
    exit 1
}

# Verificar que DATABASE_URL está configurada
$envContent = Get-Content ".\.env"
if ($envContent -match 'DATABASE_URL=".*\[PASSWORD\].*' -or $envContent -match 'DATABASE_URL=""') {
    Write-Host "⚠️  Advertencia: DATABASE_URL no parece estar configurada correctamente" -ForegroundColor Yellow
    Write-Host "   Ve a SETUP_PRUEBA.md para instrucciones" -ForegroundColor Yellow
    $continue = Read-Host "   ¿Continuar de todas formas? (s/n)"
    if ($continue -ne "s") {
        exit 1
    }
}

Write-Host "✅ .env encontrado`n" -ForegroundColor Green

# Paso 2: Instalar dependencias
Write-Host "📋 Paso 2: Instalando dependencias..." -ForegroundColor Yellow
npm install
Write-Host "✅ Dependencias instaladas`n" -ForegroundColor Green

# Paso 3: Ejecutar migraciones
Write-Host "📋 Paso 3: Ejecutando migraciones de Prisma..." -ForegroundColor Yellow
npx prisma migrate dev --name init
Write-Host "✅ Migraciones completadas`n" -ForegroundColor Green

# Paso 4: Crear usuario de prueba
Write-Host "📋 Paso 4: Creando usuario de prueba..." -ForegroundColor Yellow
npx tsx scripts/create-test-user.ts
Write-Host "✅ Usuario de prueba listo`n" -ForegroundColor Green

# Resumen final
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "                    ✅ CONFIGURACIÓN LISTA" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Blue

Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Inicia el servidor: npm run dev" -ForegroundColor White
Write-Host "2. Abre http://localhost:3000" -ForegroundColor White
Write-Host "3. Ve a login: http://localhost:3000/login" -ForegroundColor White
Write-Host "4. Usa credenciales:
   📧 test@whatnow.com
   🔐 Test123456!`n" -ForegroundColor White

Write-Host "Útil:" -ForegroundColor Cyan
Write-Host "- Ver BD gráficamente: npm run db:studio" -ForegroundColor White
Write-Host "- Ejecutar migraciones: npm run db:migrate" -ForegroundColor White
Write-Host "- Ver guía completa: SETUP_PRUEBA.md`n" -ForegroundColor White
