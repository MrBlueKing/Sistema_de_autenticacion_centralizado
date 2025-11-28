# 🚀 CÓMO USAR EL PANEL DE ADMINISTRACIÓN

## PASO 1: Asignar rol de administrador a un usuario

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
cd backend
php setup-admin.php
```

El script te mostrará:
- Lista de todos los usuarios
- Te pedirá que selecciones uno por ID
- Le asignará automáticamente el rol de administrador

**Ejemplo:**
```
Usuarios disponibles:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 1) 12345678-9 - Juan Pérez
 2) 98765432-1 - María González ✓ ES ADMIN
 3) 11111111-1 - Pedro López

Ingresa el ID del usuario: 1
```

---

## PASO 2: Iniciar el backend

Abre una terminal:

```bash
cd C:\xampp\htdocs\Sistema_de_autenticacion_centralizado\backend
php artisan serve
```

Deberías ver:
```
INFO  Server running on [http://127.0.0.1:8000]
```

**⚠️ IMPORTANTE: Deja esta terminal abierta**

---

## PASO 3: Iniciar el frontend

Abre OTRA terminal:

```bash
cd C:\xampp\htdocs\Sistema_de_autenticacion_centralizado\frontend
npm run dev
```

Deberías ver:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

**⚠️ IMPORTANTE: Deja esta terminal abierta también**

---

## PASO 4: Acceder al panel de administración

1. Abre tu navegador en: `http://localhost:5173`

2. **Inicia sesión** con el usuario al que le asignaste el rol de administrador

3. Haz clic en tu **avatar** (arriba a la derecha)

4. En el menú desplegable verás: **🛡️ Panel de Administración**

5. ¡Haz clic y listo! 🎉

---

## 📋 LO QUE PUEDES HACER EN EL PANEL

### Dashboard Principal
- Ver estadísticas del sistema
- Usuarios totales, activos, inactivos
- Roles y permisos
- Distribución por faena
- Actividad reciente

### Gestionar Usuarios
✅ Ver todos los usuarios
✅ Crear nuevos usuarios
✅ Editar información
✅ Activar/Desactivar usuarios
✅ Eliminar usuarios
✅ Asignar faenas

### Gestionar Roles
✅ Ver todos los roles
✅ Crear nuevos roles
✅ Editar roles existentes
✅ Activar/Desactivar roles
✅ Ver usuarios por rol

### Gestionar Permisos
✅ Ver permisos organizados por módulo
✅ Crear nuevos permisos
✅ Editar permisos
✅ Eliminar permisos
✅ Ver roles que usan cada permiso

### Gestionar Módulos
✅ Ver todos los módulos
✅ Crear nuevos módulos
✅ Editar módulos
✅ Activar/Desactivar módulos
✅ Configurar URL e iconos

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### No veo el botón "Panel de Administración"

1. Verifica que el usuario tenga el rol de administrador:
   ```bash
   cd backend
   php artisan tinker
   ```

   ```php
   $user = User::where('rut', 'TU-RUT')->first();
   $user->esAdministrador(); // Debe retornar true
   exit
   ```

2. Cierra sesión y vuelve a iniciar sesión

### Error 403 al acceder al panel

- El usuario no tiene rol de administrador
- Vuelve a ejecutar `php setup-admin.php`

### Error de conexión con el backend

- Verifica que el backend esté corriendo: `http://127.0.0.1:8000`
- Verifica que XAMPP (MySQL) esté corriendo

### Las páginas están en blanco

- Abre la consola del navegador (F12)
- Revisa si hay errores de JavaScript
- Verifica que el frontend esté corriendo: `http://localhost:5173`

---

## 🎯 ACCESOS RÁPIDOS

Una vez en el panel:

- **Dashboard:** `http://localhost:5173/admin`
- **Usuarios:** `http://localhost:5173/admin/users`
- **Roles:** `http://localhost:5173/admin/roles`
- **Permisos:** `http://localhost:5173/admin/permisos`
- **Módulos:** `http://localhost:5173/admin/modulos`

---

## 📞 RESUMEN RÁPIDO

```bash
# 1. Asignar admin (solo una vez)
cd backend
php setup-admin.php

# 2. Iniciar backend (Terminal 1 - dejar abierta)
cd backend
php artisan serve

# 3. Iniciar frontend (Terminal 2 - dejar abierta)
cd frontend
npm run dev

# 4. Abrir navegador
http://localhost:5173

# 5. Login → Avatar → Panel de Administración
```

¡Listo! 🚀

