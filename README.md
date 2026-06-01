# NutriBalance

Sistema de gestión empresarial para la empresa NutriBalance. Permite administrar usuarios, productos, ventas, pedidos, inventario, alertas de stock y órdenes de producción.

## Requisitos del sistema

- **PHP** >= 8.1
- **Composer** (gestor de dependencias PHP)
- **Node.js** >= 18
- **npm** (gestor de dependencias Node.js)
- **MySQL** o MariaDB
- **XAMPP / WAMP / Laragon** (entorno de desarrollo local recomendado)

---

## 1. Configuración de la base de datos

1. Abre **phpMyAdmin** o tu gestor de base de datos.
2. Ejecuta el script SQL que se encuentra en `database.sql` (o crea la base de datos manualmente):
   ```sql
   CREATE DATABASE bionutri_balance;
   ```
3. Importa el archivo SQL con todas las tablas si lo tienes, o ejecuta las migraciones de Laravel (ver punto 3).

---

## 2. Configuración del Backend (Laravel)

```bash
# 1. Ir a la carpeta del backend
cd backend

# 2. Instalar dependencias de PHP
composer install

# 3. Copiar el archivo de configuración
copy .env.example .env

# 4. Configurar la base de datos en el archivo .env
#    Abre .env y modifica estas líneas:
#    DB_DATABASE=bionutri_balance
#    DB_USERNAME=root
#    DB_PASSWORD=
```

Edita el archivo `.env` con los datos de tu conexión:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bionutri_balance
DB_USERNAME=root
DB_PASSWORD=
```

```bash
# 5. Generar la clave de la aplicación
php artisan key:generate

# 6. Ejecutar migraciones y seeders (crea tablas y datos iniciales)
php artisan migrate
php artisan db:seed

# 7. Iniciar el servidor backend
php artisan serve
```

El backend quedará disponible en `http://localhost:8000`.

> **Nota:** Si las tablas ya fueron creadas manualmente, ejecuta solo las migraciones faltantes con `php artisan migrate`.

---

## 3. Configuración del Frontend (React + Vite)

```bash
# 1. Ir a la carpeta del frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

El frontend quedará disponible en la URL que indique Vite (generalmente `http://localhost:5173`).

---

## 4. Acceso al sistema

### Roles disponibles

| Rol | Descripción |
|------|-------------|
| **admin** | Acceso completo al sistema. Gestiona usuarios, productos, ventas, pedidos, inventario y producción. |
| **ventas** | Registrar ventas y ver el historial de sus ventas realizadas. |
| **inventario** | Gestionar productos, ajustar stock y ver movimientos de inventario. |
| **producción** | Crear y gestionar órdenes de producción. |
| **pedidos** | Revisar y actualizar el estado de los pedidos de clientes. |
| **logística** | Gestión logística. |
| **cliente** | Ver catálogo, realizar pedidos y consultar sus pedidos. |

### Usuarios de prueba

Después de ejecutar los seeders, puedes iniciar sesión con:

| Correo | Contraseña | Rol |
|--------|-----------|-----|
| `admin@nutribalance.com` | `admin123` | Administrador |
| `ventas@nutribalance.com` | `ventas123` | Ventas |
| `produccion@nutribalance.com` | `produccion123` | Producción |
| `inventario@nutribalance.com` | `inventario123` | Inventario |
| `cliente@nutribalance.com` | `cliente123` | Cliente |

---

## 5. Guía rápida de uso

### Módulo de Administración
- Accede a **Usuarios** desde el menú lateral (solo admin).
- Puedes crear empleados, cambiar roles y habilitar/deshabilitar cuentas.

### Módulo de Productos
- Accede a **Productos** desde el menú.
- Permite registrar, editar y eliminar productos.
- Ajusta el stock con entradas y salidas.
- Las alertas de stock bajo se muestran automáticamente.

### Módulo de Ventas
- Accede a **Nueva Venta** desde el menú (rol ventas).
- Selecciona un cliente, agrega productos al carrito y confirma la venta.
- En **Mis Ventas** puedes ver el historial de ventas realizadas.

### Módulo de Pedidos
- Los clientes realizan pedidos desde **Mi Tienda**.
- El personal de pedidos revisa comprobantes y cambia estados.
- Los clientes consultan sus pedidos en **Mis Pedidos**.

### Módulo de Producción
- Accede a **Órdenes de Producción** desde el menú (rol producción/admin).
- Crea órdenes seleccionando producto, cantidad y fecha planificada.
- Cambia el estado: Planificada → En Proceso → Completada.
- Puedes cancelar o reprogramar órdenes activas.

### Módulo de Inventario
- Consulta movimientos de inventario desde **Productos** → pestaña Movimientos.
- Registra entradas y salidas de stock.

---

## 6. Estructura del proyecto

```
NutriBalance/
├── backend/                    # API Laravel
│   ├── app/
│   │   ├── Controllers/        # Controladores de cada módulo
│   │   ├── Models/             # Modelos Eloquent
│   │   └── ...
│   ├── database/
│   │   ├── migrations/         # Migraciones de base de datos
│   │   └── seeders/            # Datos de prueba
│   ├── routes/
│   │   └── api.php             # Rutas de la API
│   └── ...
├── frontend/                   # Aplicación React
│   ├── src/
│   │   ├── components/         # Componentes UI
│   │   ├── pages/              # Páginas con lógica de estado
│   │   ├── services/
│   │   │   └── api.js          # Llamadas a la API
│   │   └── App.jsx             # Configuración de rutas
│   └── ...
└── README.md
```

---

## 7. Solución de problemas

**Error de conexión a la base de datos:**
- Verifica que MySQL esté corriendo (LARAGON).
- Revisa las credenciales en `.env`.

**Error "composer install" falla:**
- Asegúrate de tener PHP 8.1+ instalado.
- Verifica que `composer` esté en tu PATH.

**Error al hacer peticiones a la API:**
- Confirma que `php artisan serve` esté corriendo en `http://localhost:8000`.
- Revisa la consola del navegador para ver errores CORS.
