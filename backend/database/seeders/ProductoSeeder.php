<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Producto;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        $productos = [
            [
                'nombre' => 'Proteina Whey',
                'categoria' => 'Suplementos',
                'tipo_producto' => 'Polvo',
                'precio_venta' => 250.50,
                'stock_actual' => 50,
                'stock_minimo' => 10
            ],
            [
                'nombre' => 'Creatina Pura',
                'categoria' => 'Suplementos',
                'tipo_producto' => 'Polvo',
                'precio_venta' => 120.00,
                'stock_actual' => 30,
                'stock_minimo' => 5
            ],
            [
                'nombre' => 'Multivitaminico',
                'categoria' => 'Vitaminas',
                'tipo_producto' => 'Capsulas',
                'precio_venta' => 85.00,
                'stock_actual' => 100,
                'stock_minimo' => 20
            ],
            [
                'nombre' => 'Colageno',
                'categoria' => 'Salud',
                'tipo_producto' => 'Polvo',
                'precio_venta' => 150.00,
                'stock_actual' => 5, // Stock bajo para pruebas
                'stock_minimo' => 10
            ]
        ];

        foreach ($productos as $producto) {
            Producto::create($producto);
        }
    }
}

