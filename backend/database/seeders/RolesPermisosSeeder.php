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
        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        // Crear Vendedor
        $vendedor = Role::create(['name' => 'vendedor']);
        $vendedor->givePermissionTo(['ver_precios']);

        // Crear Encargado Inventario
        $inventario = Role::create(['name' => 'inventario']);
        $inventario->givePermissionTo(['modificar_inventario', 'ver_insumos_productos']);

        // Crear Produccion
        $produccion = Role::create(['name' => 'produccion']);
        $produccion->givePermissionTo(['ver_insumos_productos']);

        // Crear Logistica
        $logistica = Role::create(['name' => 'logistica']);
        $logistica->givePermissionTo(['ver_pedidos', 'actualizar_estado_pedidos']);
    }
}