<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Producto;
use App\Models\AlertaStock;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Instalar Roles y Permisos esenciales de Spatie
        $this->call(RolesPermisosSeeder::class);

        // 2. Crear un único usuario Administrador para acceder al sistema
        $admin = User::firstOrCreate(
            ['correo' => 'superadmin@nutribalance.com'],
            [
                'nombre' => 'SuperAdmin',
                'apellido' => 'Principal',
                'password' => Hash::make('admin123'),
                'rol' => 'admin',
                'estado' => true
            ]
        );
        $admin->assignRole('super-admin');

        // 3. Crear un catálogo amplio y variado de productos
        $productos = [
            ['nombre' => 'Proteína Whey 5lbs', 'categoria' => 'Suplementos', 'tipo_producto' => 'Polvo', 'precio_venta' => 450.00, 'stock_actual' => 50, 'stock_minimo' => 10],
            ['nombre' => 'Creatina Monohidratada 300g', 'categoria' => 'Suplementos', 'tipo_producto' => 'Polvo', 'precio_venta' => 150.00, 'stock_actual' => 5, 'stock_minimo' => 15], // Alerta de stock
            ['nombre' => 'BCAA 2:1:1', 'categoria' => 'Suplementos', 'tipo_producto' => 'Polvo', 'precio_venta' => 180.00, 'stock_actual' => 30, 'stock_minimo' => 10],
            ['nombre' => 'Pre-Entreno C4', 'categoria' => 'Suplementos', 'tipo_producto' => 'Polvo', 'precio_venta' => 220.00, 'stock_actual' => 25, 'stock_minimo' => 5],
            ['nombre' => 'Multivitamínico Mens', 'categoria' => 'Vitaminas', 'tipo_producto' => 'Capsulas', 'precio_venta' => 120.00, 'stock_actual' => 40, 'stock_minimo' => 10],
            ['nombre' => 'Omega 3 Fish Oil', 'categoria' => 'Salud', 'tipo_producto' => 'Capsulas', 'precio_venta' => 95.00, 'stock_actual' => 60, 'stock_minimo' => 15],
            ['nombre' => 'Colágeno Hidrolizado', 'categoria' => 'Salud', 'tipo_producto' => 'Polvo', 'precio_venta' => 160.00, 'stock_actual' => 8, 'stock_minimo' => 10], // Alerta de stock
            ['nombre' => 'Magnesio Quelado', 'categoria' => 'Vitaminas', 'tipo_producto' => 'Capsulas', 'precio_venta' => 85.00, 'stock_actual' => 55, 'stock_minimo' => 15],
            ['nombre' => 'Barra Energética Cacao', 'categoria' => 'Snack', 'tipo_producto' => 'Snack', 'precio_venta' => 15.00, 'stock_actual' => 100, 'stock_minimo' => 20],
            ['nombre' => 'Barra Proteica Vainilla', 'categoria' => 'Snack', 'tipo_producto' => 'Snack', 'precio_venta' => 20.00, 'stock_actual' => 80, 'stock_minimo' => 20],
            ['nombre' => 'Mantequilla de Maní Natural', 'categoria' => 'Salud', 'tipo_producto' => 'Snack', 'precio_venta' => 35.00, 'stock_actual' => 45, 'stock_minimo' => 10],
            ['nombre' => 'Shaker NutriBalance 700ml', 'categoria' => 'Accesorios', 'tipo_producto' => 'Accesorio', 'precio_venta' => 45.00, 'stock_actual' => 150, 'stock_minimo' => 20],
            ['nombre' => 'Guantes de Entrenamiento', 'categoria' => 'Accesorios', 'tipo_producto' => 'Accesorio', 'precio_venta' => 65.00, 'stock_actual' => 30, 'stock_minimo' => 5],
            ['nombre' => 'Cinturón de Levantamiento', 'categoria' => 'Accesorios', 'tipo_producto' => 'Accesorio', 'precio_venta' => 120.00, 'stock_actual' => 15, 'stock_minimo' => 5],
            ['nombre' => 'Vitamina C 1000mg', 'categoria' => 'Vitaminas', 'tipo_producto' => 'Capsulas', 'precio_venta' => 60.00, 'stock_actual' => 70, 'stock_minimo' => 15],
            ['nombre' => 'Proteína Isolatada 2lbs', 'categoria' => 'Suplementos', 'tipo_producto' => 'Polvo', 'precio_venta' => 320.00, 'stock_actual' => 2, 'stock_minimo' => 5], // Alerta de stock
            ['nombre' => 'ZMA Recovery', 'categoria' => 'Vitaminas', 'tipo_producto' => 'Capsulas', 'precio_venta' => 110.00, 'stock_actual' => 25, 'stock_minimo' => 10],
            ['nombre' => 'Bebida Isotónica Citrus', 'categoria' => 'Snack', 'tipo_producto' => 'Liquido', 'precio_venta' => 12.00, 'stock_actual' => 200, 'stock_minimo' => 50],
        ];

        foreach ($productos as $p) {
            $prod = Producto::create($p);
            // Ejecutamos la función de alerta para que evalúe si el stock que le asignamos arriba es crítico
            AlertaStock::verificarStock($prod);
        }
    }
}