<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesPermisosSeeder extends Seeder
{
    public function run(): void
    {
        // Crear permisos especificos
        Permission::create(['name' => 'ver_precios']);
        Permission::create(['name' => 'modificar_inventario']);
        Permission::create(['name' => 'ver_insumos_productos']);
        Permission::create(['name' => 'ver_pedidos']);
        Permission::create(['name' => 'actualizar_estado_pedidos']);
        Permission::create(['name' => 'gestionar_roles']);

        // Crear Super Admin y Admin
        $superAdmin = Role::create(['name' => 'super-admin']);
        $superAdmin->givePermissionTo(Permission::all());
        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        // Crear Ventas
        $ventas = Role::create(['name' => 'ventas']);
        $ventas->givePermissionTo(['ver_precios']);

        // Crear Inventario
        $inventario = Role::create(['name' => 'inventario']);
        $inventario->givePermissionTo(['modificar_inventario', 'ver_insumos_productos']);

        // Crear Produccion
        $produccion = Role::create(['name' => 'produccion']);
        $produccion->givePermissionTo(['ver_insumos_productos']);

        // Crear Logistica
        $logistica = Role::create(['name' => 'logistica']);
        $logistica->givePermissionTo(['ver_pedidos', 'actualizar_estado_pedidos']);

        // Crear Pedidos
        $pedidos = Role::create(['name' => 'pedidos']);
        $pedidos->givePermissionTo(['ver_pedidos', 'actualizar_estado_pedidos']);

        // Crear Cliente
        $cliente = Role::create(['name' => 'cliente']);
        $cliente->givePermissionTo(['ver_precios']);
    }
}

