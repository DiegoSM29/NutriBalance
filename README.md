# NutriBalance

Sistema de gestión empresarial para NutriBalance. Permite administrar usuarios, productos, ventas, pedidos, inventario, alertas de stock y órdenes de producción.

## Requisitos

- **PHP** >= 8.1
- **Composer**
- **Node.js** >= 18 + **npm**
- **MySQL** o MariaDB
- **XAMPP / WAMP / Laragon** (recomendado)

---

## 1. Clonar e instalar dependencias

```bash
# Backend
cd backend
composer install
copy .env.example .env

# Frontend
cd ../frontend
npm install
```

---

## 2. Configurar base de datos

1. Crear la base de datos:
   ```sql
   CREATE DATABASE bionutri_balance;
   ```
2. Editar `backend/.env`:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=bionutri_balance
   DB_USERNAME=root
   DB_PASSWORD=
   ```

---

## 3. Inicializar backend

```bash
cd backend
php artisan key:generate
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate
php artisan db:seed
php artisan serve
```

Backend disponible en `http://localhost:8000`.

---

## 4. Inicializar frontend

```bash
cd frontend
npm run dev
```

Frontend disponible en `http://localhost:5173`.

---

## 5. Acceso al sistema

### Usuarios de prueba

| Correo | Contraseña | Rol |
|--------|-----------|------|
| `admin@nutribalance.com` | `admin123` | Administrador |
| `ventas@nutribalance.com` | `ventas123` | Ventas |
| `produccion@nutribalance.com` | `produccion123` | Producción |
| `inventario@nutribalance.com` | `inventario123` | Inventario |
| `logistica@nutribalance.com` | `logistica123` | Logística |
| `pedidos@nutribalance.com` | `pedidos123` | Pedidos |
| `cliente@nutribalance.com` | `cliente123` | Cliente |

### Roles y rutas permitidas

| Rol | Rutas |
|------|-------|
| **admin** | `/empresa`, `/perfil`, `/admin`, `/productos`, `/reportes` |
| **ventas** | `/empresa`, `/perfil`, `/ventas`, `/mis-ventas` |
| **inventario** | `/empresa`, `/perfil`, `/productos` |
| **producción** | `/empresa`, `/perfil`, `/produccion` |
| **logística** | `/empresa`, `/perfil`, `/logistica` |
| **pedidos** | `/empresa`, `/perfil`, `/pedidos` |
| **cliente** | `/empresa`, `/perfil`, `/client`, `/mis-pedidos`, `/mis-facturas`, `/notificaciones` |

---

## 6. Estructura del proyecto

```
NutriBalance/
├── backend/                    # API Laravel
│   ├── app/
│   │   ├── Controllers/
│   │   ├── Models/
│   │   └── ...
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/api.js
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## 7. Solución de problemas

**Error de conexión a la BD:** Verifica que MySQL esté corriendo y las credenciales en `.env`.

**Error "Class Spatie\Permission\Models\Permission not found":** Ejecuta `composer dump-autoload` en `backend/`.

**Error al llamar a la API:** Confirma que `php artisan serve` corra en `http://localhost:8000`.
